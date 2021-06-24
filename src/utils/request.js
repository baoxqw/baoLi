import fetch from 'dva/fetch';
import { notification } from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import { stringify } from 'qs';
import { isAntdPro } from './utils';
import storage from '@/utils/storage';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
const getsessionid = () => {
  const bb = storage.get('sessionID');
  console.log(storage.get('sessionID'));
  return bb;
};

let status = false;

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
      message: `请求错误 ${response.status}: ${response.url}`,
      description: errortext,
    });
 /* const error = new Error(errortext);
  error.name = response.status;
  error.response = response;*/

  //throw error;
  return response
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    expirys: isAntdPro(),
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');
  const aa = getsessionid();
  // 默认在所有请求中带上
  const defaultOptions = {
    credentials: 'include',
    headers: {
      sessionId: aa,
    },
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      // urlencoded 类型自动序列化
      const isUrlencoded = /urlencoded/.test(newOptions.headers['Content-Type']);
      if (newOptions.headers && isUrlencoded) {
        newOptions.body = stringify(newOptions.body);
      } else {
        // 默认 json 类型
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          ...newOptions.headers,
        };
        // 若 body 不为 string 类型， 则转化为 json
        if (typeof newOptions.body !== 'string') {
          newOptions.body = JSON.stringify(newOptions.body);
        }
      }
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return (
    fetch(url, newOptions)
      .then(checkStatus)
      // .then(response => cachedSave(response, hashcode))
      .then(response => {
        // DELETE and 204 do not return data by default
        // using .json will report an error.
        console.log((window.test = response), 'response');
        if (newOptions.method === 'DELETE' || response.status === 204) {
          return response.text();
        }
        return response.json().catch(console.log);
      })
      .then(res => {
        console.log('退出',res)
        // 服务器返回错误信息处理
        const hasError = res.errCode < 200 || res.errCode > 400;
        if (hasError) {
          // 错误信息提示
          if(!status){
            notification.error({
              message: '提示',
              description: res.errMsg,
            });
          }
          // 登录失效
          if (res.errCode === 401) {
            // @HACK
            /* eslint-disable no-underscore-dangle */
            status = true;
            window.g_app._store.dispatch({
              type: 'login/logout',
            });
          }

          return Promise.reject(res.errMsg);
        }else{
          status = false
        }
        return res;
      })
      .catch(e => {
        const status = e.name;
        if (status === 401) {
          // @HACK
          /* eslint-disable no-underscore-dangle */
          window.g_app._store.dispatch({
            type: 'login/logout',
          });
        } else if (status === 403) {
          router.push('/exception/403');
        } else if (status <= 504 && status >= 500) {
          router.push('/exception/500');
        } else if (status >= 404 && status < 422) {
          router.push('/exception/404');
        }
        return Promise.reject(e);
      })
  );
}

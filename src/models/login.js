import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getFakeCaptcha } from '@/services/api';
// import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { requestLogin, requestLogout } from '@/services/user';
import storage from '@/utils/storage';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    userinfo: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const data = yield call(requestLogin, payload);
      if (!data) return;
      const sessionId = data.resData;
      const userinfo = data.customize;
      console.log('---data',data)
      // 本地持久化 sessionI
      storage.set('sessionID', sessionId);
      storage.set('userinfo', userinfo);

      // 角色权限设置
      const getAuthority = userData => {
        if (userData.isAdmin === 1) return ['admin'];
        if(!userData.authority){
          userData.authority = "";
        }
        return userData.authority.split(",")
      };

      console.log("权限",getAuthority(userinfo))

      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'ok',
          currentAuthority: getAuthority(userinfo),
          userinfo,
        },
      });
      yield put({
        type: 'user/saveCurrentUser',
        payload: userinfo,
      });

      reloadAuthorized();
      //已注释
      // const urlParams = new URL(window.location.href);
      // const params = getPageQuery();
      // let { redirect } = params;
      // if (redirect) {
      //   const redirectUrlParams = new URL(redirect);
      //   if (redirectUrlParams.origin === urlParams.origin) {
      //     redirect = redirect.substr(urlParams.origin.length);
      //     if (redirect.match(/^\/.*#/)) {
      //       redirect = redirect.substr(redirect.indexOf('#') + 1);
      //     }
      //   } else {
      //     window.location.href = redirect;
      //     return;
      //   }
      // }
      //停止
       yield put(routerRedux.replace('/'));
       window.location.reload();
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put, call }) {
      yield call(requestLogout);

      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: undefined,
          currentAuthority: [],
        },
      });
      reloadAuthorized();

      // 清除本地数据
      storage.remove(['userinfo', 'sessionID']);

      yield put(
        routerRedux.push({
          pathname: '/user/login',
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(
      state,
      {
        payload: { currentAuthority, ...rest },
      }
    ) {
      setAuthority(currentAuthority);
      return {
        ...state,
        ...rest,
      };
    },
  },
};

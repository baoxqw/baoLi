import axios from 'axios'
import store from 'store'

/*const baseUrl = process.env.REACT_APP_API_ENDPOINT
if (!baseUrl) {
  throw new Error('REACT_APP_API_ENDPOINT env is not defined')
}*/

const api = axios.create({
  baseURL: 'http://192.168.2.208:8080/',
  timeout: 10000
});

const token = store.get('token');

store.set('name','134143214');

if (token) {
  api.defaults.headers.common['Authorization'] = token
}

api.login = async ({ code, password }) => {
  let res;
  try {
    res = await api.post('/v1/users/login', {
      code,
      password
    })
  } catch (err) {
    throw err.response.data
  }

  const token = res.sessionID;
  const corp_id = res.corpId;

  store.set('token', token);

  store.set('corpId', corp_id);

  api.defaults.headers.common['Authorization'] = token;

  return res
};

api.extras = {};

window.$axios = api;
window.store = store;

export default $axios

import request from '@/utils/request';

// 代理路径
const baseUrl = '/wookong';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function querymenuData(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/shortcut/save`,{
    method:'POST',
    body: str
  });
}
// 请求登录
export const requestLogin = data =>{
  return request(`${baseUrl}/userLogin`, {
    method: 'POST',
    body: data
  });
};


// 获取用户中心数据
export const fetchUserDashboard = () => request(`${baseUrl}/dashboard/user`);

// 获取用户月份日程
export const fetchUserSchedule = data =>
  request(`${baseUrl}/user/schedule`, { body: data, method: 'POST' });


// 登出登录
export const requestLogout = () => request(`${baseUrl}/logout`);

// 获取个人任务信息列表
export const fetchUserTaskMsg = body =>
  request(`${baseUrl}/user/taskMsg`, { method: 'POST', body })

// 获取个人投后信息列表
export const fetchUserAfterInvestMsg = body =>
  request(`${baseUrl}/user/afterInvestMsg`, { method: 'POST', body });

// 获取所有用户数据
export const fetchAllUser = body => request(`${baseUrl}/rest/sm/user`, { body, method: 'POST' });


// 标记消息已读
export const markRead = body =>
  request(`${baseUrl}/analysis/markmessage`, { body, method: 'POST' });

export async function userFetchFind(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/shortcut/querybyuserid`,{
    method:'POST',
    body: str
  });
}

export async function queryUser(params) {
  return request(`${baseUrl}/rest/sm/user`,{
    method:'POST',
    body: params
  });
}

export async function queryUserById(params) {
  return request(`${baseUrl}/rest/sm/user/queryById`,{
    method:'POST',
    body: params
  });
}

export async function setPhone(params) {
  return request(`${baseUrl}/rest/sm/user/changephone`,{
    method:'POST',
    body: params
  });
}

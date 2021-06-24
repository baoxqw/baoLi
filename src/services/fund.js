import request from '@/utils/request';

const baseUrl = '/wookong';

// 查询基金信息列表
export const queryFund = async body =>
  request(`${baseUrl}/rest/bd/queryfund`, { method: 'POST', body });

// 查询项目信息列表
export const queryProject = async () => request('rest/pm/querynewproject');

// 查询 LP 信息列表
export const queryLP = async () => request('/rest/bd/querylp');

// 获取基金经理列表
export const queryPM = async body =>
  request(`${baseUrl}/rest/sm/user_pm`, { method: 'POST', body });

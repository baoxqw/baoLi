import request from '@/utils/request';

const baseUrl = '/wookong';

// 获取基金净值表格数据
export const fetchNetFund = async () => request('/api/analysis/netFund');
// 获取用户月份日程
export const fetchUserScheduled = data =>
  request(`${baseUrl}/user/schedule`, { body: data, method: 'POST' });
// 获取风险状态列表
export const fetchRiskStatus = async () => request('/api/analysis/fetchRiskStatus');

// 获取项目统计面板数据
export const fetchProjectDashboard = async () => request(`${baseUrl}/dashboard/project`);

// 获取经理面板数据
export const fetchAccountDashboard = async () => request('/dashboard/manager');

// 项目区域数据
export const fetchAreaStatistics = async () => request(`${baseUrl}/analysis/areaStatistics`);

// 获取项目阶段统计数据
export const fetchProjectStageStatistics = async () =>
  request(`${baseUrl}/analysis/projectStageStatistics`);

// 获取项目风险信息列表
export const fetchProjectRiskList = async data =>
  request(`${baseUrl}/analysis/projectRisk`, { method: 'POST', body: data });

// 获取基金项目分析数据
export const fetchFundProjectList = async data =>
  request(`${baseUrl}/analysis/fundProject`, { method: 'POST', body: data });

// 基金净值列表查询
export const fetchNetFundList = async data =>
  request(`/analysis/fundnet/List`, { method: 'POST', body: data });

// 基金净值列表中项目信息列表查询
export const fetchNetFundProjectList = async data =>
  request(`${baseUrl}/analysis/fundnet/projectList`, { body: data, method: 'POST' });

// 基金净值列表中项目LP列表查询
export const fetchNetFundLpList = async data =>
  request('/analysis/fundnet/lpList', { method: 'POST', body: data });

// 更改基金项目发布状态
export const changeProjectPublishStatus = async body =>
  request('/analysis/changeStatus/projectPublish', { body, method: 'POST' });

// 更改基金项目风险等级
export const changeProjectRiskStatus = async body =>
  request(`${baseUrl}/analysis/changeStatus/projectRisk`, { body, method: 'POST' });


export const fetchDataMap = async body =>
  request(`${baseUrl}/analysis/countryStatistics`);

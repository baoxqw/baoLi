import request from '@/utils/request';

// 代理路径
const baseUrl = '/wookong';

export async function finanQuery(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/user`,{
    method:'POST',
    body: str
  });
}
export async function submitapply(params) {
   const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/commit/ExpensesClaim`,{
    method:'POST',
    body: str
  });
}

export async function submitleave(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/commit/AskForLeave`,{
    method:'POST',
    body: str
  });
}

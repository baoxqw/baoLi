import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchCA(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectcloseout/onaudit/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchBL(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getLoan`,{
    method:'POST',
    body: str,
  });
}
export async function reject(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/baoLi/loan`,{
    method:'POST',
    body: str,
  });
}
export async function lookLoan(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getLoanResult`,{
    method:'POST',
    body: str,
  });
}
export async function queryLoanRes(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getLoanResult`,{
    method:'POST',
    body: str,
  });
}



export async function queryId(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getLoan`,{
    method:'POST',
    body: str,
  });
}
export async function findmore(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getCredit`,{
    method:'POST',
    body: str,
  });
}




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
  return request(`${baseUrl}/getCredit`,{
    method:'POST',
    body: str,
  });
}
export async function addcre(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/baoLi/personal`,{
    method:'POST',
    body: str,
  });
}

export async function reject(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/baoLi/personal`,{
    method:'POST',
    body: str,
  });
}
export async function findList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/oss`,{
    method:'POST',
    body: str,
  });
}
export async function lookTable(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getCreditResult`,{
    method:'POST',
    body: str,
  });
}

export async function queryCreditRes(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getCreditResult`,{
    method:'POST',
    body: str,
  });
}


export async function queryId(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getCredit`,{
    method:'POST',
    body: str,
  });
}
export async function fetchUcum(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/queryUser`,{
    method:'POST',
    body: str,
  });
}
export async function findLeagl(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getCreditLMStatus`,{
    method:'POST',
    body: str,
  });
}




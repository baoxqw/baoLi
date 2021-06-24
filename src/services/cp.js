import request from '@/utils/request';

const baseUrl = '/wookong';



export async function fetchCMX(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmContractH/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchpReview(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectmodifyapproval/queryaudittaskbyuserid`,{
    method:'POST',
    body: str,
  });
}

export async function fetchMessage(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmProjectHHis/querybyid`,{
    method:'POST',
    body: str,
  });
}












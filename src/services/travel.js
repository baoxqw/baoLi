import request from '@/utils/request';
const baseUrl = '/wookong';

export async function fetchChild(params) {
  return request(`${baseUrl}/rest/wfTravelclaimformH/query_`,{
    method:'POST',
    body: params,
  });
}

export async function fetchList(params) {
  console.log("params",params)
  return request(`${baseUrl}/rest/projectTravelclaimform/query`,{
    method:'POST',
    body: params,
  });
}

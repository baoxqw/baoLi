import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmBdMilestonenode/query`,{
    method:'POST',
    body: str,
  });
}

export async function addBosom(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/pmBdMilestonenode/add`,{
    method:'POST',
    body: str,
  });
}

export async function removeBosom(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/pmBdMilestonenode/delete`,{
    method:'POST',
    body: str,
  });
}










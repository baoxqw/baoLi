import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchTree(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/dept`,{
    method:'POST',
    body: str,
  });
}


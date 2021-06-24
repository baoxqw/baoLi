import request from '@/utils/request';

const baseUrl = '/wookong';

export async function findList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/getDirectoryData`,{
    method:'POST',
    body: str,
  });
}







import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchUser(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/queryUser`,{
    method:'POST',
    body: str,
  });
}


export async function addUser(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/userRegistered`,{
    method:'POST',
    body: str,
  });
}

export async function deleteUser(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/deleteUser`,{
    method:'POST',
    body: str,
  });
}

export async function updatePassWord(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/updatePassWord`,{
    method:'POST',
    body: str,
  });
}

export async function updateIsAdmin(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/updateIsAdmin`,{
    method:'POST',
    body: str,
  });
}


export async function updateAuthority(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/updateAuthority`,{
    method:'POST',
    body: str,
  });
}






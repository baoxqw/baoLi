import request from '@/utils/request';

const baseUrl = '/wookong';



export async function fetchCMX(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmContractH/query`,{
    method:'POST',
    body: str,
  });
}

export async function addCMX(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmContractH/add`,{
    method:'POST',
    body: str,
  });
}

export async function updateCMX(params) {
  const str = JSON.stringify(params);
  return request(`/rest/bm/update`,{
    method:'POST',
    body: str,
  });
}

export async function deleteCMX(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmInvoiceH/delete`,{
    method:'POST',
    body: str,
  });
}

export async function removeCMX(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmContractH/delete`,{
    method:'POST',
    body: str,
  });
}
export async function fetchClientTree(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/areacl`,{
    method:'POST',
    body: str,
  });
}
export async function findClientTable(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/cubasdoc`,{
    method:'POST',
    body: str,
  });
}

export async function fetchDept(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/dept`,{
    method:'POST',
    body: str,
  });
}

export async function findPerson(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/psndoc`,{
    method:'POST',
    body: str,
  });
}

export async function findId(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmContractBasic/query`,{
    method:'POST',
    body: str,
  });
}

export async function childadd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmContractH/addwithchild`,{
    method:'POST',
    body: str,
  });
}

export async function deleteChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmContractBasic/delete`,{
    method:'POST',
    body: str,
  });
}

export async function fetchProject(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchTree(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/dept`,{
    method:'POST',
    body: str,
  });
}

export async function fetchPerson(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/psndoc`,{
    method:'POST',
    body: str,
  });
}

export async function uploadList(params) {
  return request(`${baseUrl}/rest/attachment/upload`,{
    method:'POST',
    body: params,
  });
}


export async function fileList(params) {
  return request(`${baseUrl}/rest/attachment/queryByTypeandId`,{
    method:'POST',
    body: params,
  });
}

export async function subapprove(params) {
  return request(`${baseUrl}/rest/projectapproval/commit`,{
    method:'POST',
    body: params,
  });
}

export async function historyCMX(params) {
  return request(`${baseUrl}/rest/pmContract/queryhistory`,{
    method:'POST',
    body: params,
  });
}

export async function historyDetailsCMX(params) {
  return request(`${baseUrl}/rest/pmContractH/querybyid`,{
    method:'POST',
    body: params,
  });
}


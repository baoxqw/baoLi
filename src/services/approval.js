import request from '@/utils/request';

const baseUrl = '/wookong';

// 提交审批申请
export const submitApproval = async body =>
  request(`${baseUrl}/rest/workflow/savefinancewf`, { body, method: 'POST' });

// 上传附件
// 上传附件
export const fileUpload = async () => request('/rest/uploadfile');

//审批财务详情
export async function fetchApprovalDetail(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/queryprocessbyid`,{
    method:'POST',
    body:str
  })
}
//审批 请假详情
export async function fetchLeaveDetail(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/commit/AskForLeave`,{
    method:'POST',
    body:str
  })
}
//提交意见
export async function subresult(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/agree`,{
    method:'POST',
    body:str
  })
}

/*export async function fetchSdetail(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/wfClaimformH/querybyid_`,{
    method:'POST',
    body:str
  })
}*/
//绩效
export async function fetchSdetail(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/wfClaimformH/querybyid_`,{
    method:'POST',
    body:str
  })
}

export async function refuseed(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/reject`,{
    method:'POST',
    body:str
  })
}

export async function fetchMessage(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/querybyid`,{
    method:'POST',
    body:str
  })
}

export async function addUserRole(params){
  return request(`${baseUrl}/rest/approval/changeauditors`,{
    method:'POST',
    body:params
  })
}

export async function fetchAdvice(params) {
  return request(`${baseUrl}/rest/approval/queryCommentsByProcessbyid`,{
    method:'POST',
    body: params,
  });
}

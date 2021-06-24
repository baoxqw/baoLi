import { stringify } from 'qs';
import request from '@/utils/request';
import storage from '@/utils/storage'
// 代理路径
const baseUrl = '/wookong';
// 假数据接口

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}
// 角色查询
export async function findRole(params) {
  return request(`${baseUrl}/rest/sm/role`,{
    method:'POST',
    body: params,
  });
}
// 用户管理
export async function querySysuser(params) {
  return request(`/rest/sm/user/save?${stringify(params)}`);
}
export async function findSysuser(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/user`,{
    method:'POST',
    body: str,
  });
}
export async function findPageSysuser(params) {
  return request(`${baseUrl}/rest/sm/user`,{
    method:'POST',
    body: params
  });
}
export async function addSysuser(params) {
  return request(`${baseUrl}/rest/sm/user/save`, {
    method: 'POST',
    body: params,
  });
}
export async function updateSysuser(params) {
  const {name,code,corp_id,id} = params;
  const obj = {
    reqData:{
      name,
      code,
      corp_id,
      id
    }
  };
  const str = JSON.stringify(obj);
  /*return request(`${baseUrl}/rest/sm/user/save`, {
    method: 'POST',
    body: str,
  });*/
}
export async function removeSysuser(params) {
  const obj = {
    reqData:{
      id:params
    }
  };
  const str = JSON.stringify(obj);
  return request(`${baseUrl}/rest/sm/user/delete`, {
    method: 'POST',
    body: str,
  });
}
export async function assignSysuser(params) {
  return request(`${baseUrl}/rest/sm/role`, {
    method: 'POST',
    body:params
  });
}
export async function distSysuser(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/wxminiprogram/role/save`,{
    method:"POST",
    body:str
  });
}
export async function evenSysuser(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/sm/user/role`,{
    method:"POST",
    body:str
  });
}

export async function findRoleBussiness(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/cubasdoc`,{
    method:'POST',
    body: str,
  });
}
export async function removeRole(params) {
  return request(`${baseUrl}/rest/sm/role/delete`,{
    method:'POST',
    body: params
  });
}

export async function removeRoleBussiness(params) {
  const str = JSON.stringify(params);

  return request(`${baseUrl}/rest/bd/cubasdoc/delete`,{
    method:'POST',
    body: str
  });
}
export async function updateRole(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/sm/role/save`,{
    method:'POST',
    body: str
  });
}

export async function updateRoleBussiness(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/bd/cubasdoc/queryById`,{
    method:'POST',
    body: str
  });
}
export async function addRoleBussiness(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/cubasdoc/save`,{
    method:'POST',
    body: str,
  });
}

export async function newdataList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/cubasdoc`,{
    method:'POST',
    body: str,
  });
}

export async function addfilekehu(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/cubasdoc/batchadd`,{
    method:'POST',
    body: str,
  });
}

export async function queryRole(params) {
  return request(`${baseUrl}/wxminiprogram/sm/role/query`,{
    method:'POST',
    body: params
  });
}
export async function getRole(params) {
  return request(`/rest/sm/role/find`,{
    method:'POST',
    body: params
  });
}

export async function queryRoleForTable(params) {
  return request(`/api/rolefortable?${stringify(params)}`);
}


//项目管理
export async function queryCorp(params) {
  return request(`/api/corp/project`);
}
export async function removeCorp(params) {
  return request(`/api/corp/project`, {
    method: 'POST',
    body: params
  });
}
  export async function addCorp(params) {
   const obj = JSON.stringify(params)
    return request(`${baseUrl}/rest/bd/lpadmin/save`,{
      method:'POST',
      body: obj
    });
  }
// export async function queryLp(params) {
//   return request(`/api/limitpartner?${stringify(params)}`);
// }
export async function findLp(params) {
  const str = JSON.stringify(params);
  /*return request(`${baseUrl}/rest/bd/querylp`,{
    method:'POST',
    body: str
  });*/
}
export async function queryLp(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/querylp`,{
    method:'POST',
    body: str
  });
}



export async function updateLp(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/lpadmin/save `,{
    method:'POST',
    body: str
  });
}
// export async function queryFund(params) {
//   const str = JSON.stringify(params);
//   return request(`${baseUrl}/rest/bd/queryfund`,{
//     method:'POST',
//     body: str
//   });
// }


export async function removeFund(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/fundadmin/delete`,{
    method:'POST',
    body: str
  });
}

export async function removeLP(params) {
  const obj = {
    reqData:{
      id:params
    }
  };
  const str = JSON.stringify(obj);
  return request(`${baseUrl}/rest/bd/lpadmin/delete`,{
    method:'POST',
    body: str
  });
}
export async function deleteLp(params) {
  const obj = {
    reqData:{
      id:params
    }
  };
  const str = JSON.stringify(obj);
  return request(`${baseUrl}/rest/bd/lpadmin/delete`, {
    method: 'POST',
    body: str
  });
}
export async function queryProject(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/querynewproject`,{
    method:'POST',
    body: str

  });
}
//分配学员
export async function assignProject(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/user`,{
    method:'POST',
    body: str
  });
}
export async function newassignProject(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/pm/projectassign`,{
    method:'POST',
    body:str
  });
}
export async function findProject(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/pm/querynewproject`,{
    method:'POST',
    body: str
  });
}
//确认投资关系
export async function addDesc(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/pm/confiminvestplan`,{
    method:'POST',
    body: str
  });
}
export async function findongoingProject(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/pm/queryownproject`,{
    method:'POST',
    body: str
  });
}
//根据id查询概念信息
export async function updateongoingProjectinfor(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/pm/queryProjectBasicInfoById`,{
    method:'POST',
    body: str
  });
}

//投资者关系-查询附件列表
export async function queryattchmentList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: str
  });
}
export async function queryattchmentListholder(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: str
  });
}
export async function queryattchmentListaudit(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: str
  });
}
export async function queryattchmentListquater(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: str
  });
}
//尽职调查-查询附件列表
export async function queryattchmentListdue(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: str
  });
}
//删除附件
export async function deleteAT(params) {
  const obj = {
    reqData:{
      id:params
    }
  };
  const str = JSON.stringify(obj);
  return request(`${baseUrl}/rest/pm/delattachment`, {
    method: 'POST',
    body: str
  });
}
export async function deleteATholder(params) {
  const obj = {
    reqData:{
      id:params
    }
  };
  const str = JSON.stringify(obj);
  return request(`${baseUrl}/rest/pm/delattachment`, {
    method: 'POST',
    body: str
  });
}
export async function deleteATquater(params) {
  const obj = {
    reqData:{
      id:params
    }
  };
  const str = JSON.stringify(obj);
  return request(`${baseUrl}/rest/pm/delattachment`, {
    method: 'POST',
    body: str
  });
}
export async function deleteATaudit(params) {
  const obj = {
    reqData:{
      id:params
    }
  };
  const str = JSON.stringify(obj);
  return request(`${baseUrl}/rest/pm/delattachment`, {
    method: 'POST',
    body: str
  });
}
export async function updateongoingProject(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/pm/updateproject`,{
    method:'POST',
    body: str
  });
}

export async function queryOngoingProjectUpdate(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/pm/queryProjectDetailById`,{
    method:'POST',
    body: str
  });
}
export async function queryVote(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/pm/queryProjectDetailById`,{
    method:'POST',
    body: str
  });
}
// export async function removeProject(params) {
//   return request(`/api/removeproject?${stringify(params)}`);
// }
// 项目管理列表删除
export async function removeProject(params) {
  return request(`${baseUrl}/rest/pm/delproject?${stringify(params)}`);
}
// 项目管理列表
export async function addLP(params) {
  const str = JSON.stringify(params)
}
export async function newaddLp(params) {
  const par = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/lpadmin/save`,{
    method:'POST',
    body:par,
  });

}
export async function queryOngoingProject(params) {
  const par = JSON.stringify(params);
  const sessionId = storage.get("sessionID");
  return request(`${baseUrl}/rest/pm/queryownproject`,{
        method:'POST',
        body:par,
    });

}

export async function queryPostManagement(params) {
  return request(`${baseUrl}/rest/post/querypostproject`,{
    method:'POST',
    body:JSON.stringify(params||{})
  });
}

// 查询投后管理的主信息详情
export async function queryPostManagementDetail(id) {
  return request(`/api/postmanagement/${id}`);
}

// 查询投后管理子信息 - 公司信息
export async function queryPostManagementDetailCorpInfo(id) {
  return request(`/api/postmanagement/${id}/corpinfo`);
}

// 查询投后管理子信息 - 投资信息
export async function queryPostManagementDetailInvestmentInfo(id) {
  return request(`/api/postmanagement/${id}/investment`);
}

// 查询投后管理子信息 - 财务信息
export async function queryPostManagementDetailFinancialInfo(id) {
  return request(`/api/postmanagement/${id}/financialinfo`);
}
// 查询投后管理子信息 - 季度报告
export async function queryPostManagementDetailSeasonInfo(id) {
  return request(`/api/postmanagement/${id}/seasoninfo`);
}
// 查询投后管理子信息 - 股东信息
export async function queryPostManagementDetailShareholderInfo(id) {
  return request(`/api/postmanagement/${id}/shareholderinfo`);
}
// 查询投后管理子信息 - 审计报告
export async function queryPostManagementDetailAuditreportInfo(id) {
  return request(`/api/postmanagement/${id}/auditreportinfo`);
}
// 查询投后管理子信息 - 退出情况
export async function queryPostManagementDetailQuitInfo(id) {
  return request(`/api/postmanagement/${id}/quitinfo`);
}
// 查询投后管理子信息 - 过程查看
export async function queryPostManagementDetailProcessInfo(id) {
  return request(`/api/postmanagement/${id}/processinfo`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function addProject(params) {
  return request('/rest/pm/newproject', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

// 代理路径
// const baseUrl = '/wookong';
//项目分配附件上传
// export async function fakeSubmitForm(params) {
//   return request(`${baseUrl}/rest/pm/newproject`, {
//     method: 'POST',
//     body: formData,
//     // headers: {
//     //   'Content-Type': 'multipart/form-data',
//     //   credentials: 'same-origin'
//     // },
//   });F
// }
export async function fakeSubmitForm(formData) {
  return request(`${baseUrl}/rest/pm/newproject`, {
    method: 'POST',
    body: formData
  });
}

//投资者关系-附件上传
export async function submitProjectAddForm(params) {
  return request(`${baseUrl}/rest/pm/updateprojectwithattachment`,{
    method:'POST',
    body: params
  });
}
export async function submitProjectAddFormend(params) {
  return request(`${baseUrl}/rest/pm/updateprojectwithattachment`,{
    method:'POST',
    body: params
  });
}
export async function submitProjectAddFormholder(params) {
  return request(`${baseUrl}/rest/pm/updateprojectwithattachment`,{
    method:'POST',
    body: params
  });
}
export async function submitProjectAddFormaudit(params) {
  return request(`${baseUrl}/rest/pm/updateprojectwithattachment`,{
    method:'POST',
    body: params
  });
}
export async function submitProjectAddFormquater(params) {
  return request(`${baseUrl}/rest/pm/updateprojectwithattachment`,{
    method:'POST',
    body: params
  });
}
//投决会表单提交
export async function icmupdate(params) {
  return request(`${baseUrl}/rest/pm/icmupdate`,{
    method:'POST',
    body: params
  });
}
export async function submitProjectAddFormdue(params) {
  return request(`${baseUrl}/rest/pm/ddupdate`,{
    method:'POST',
    body: params
  });
}
export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}


export async function queryInvestDecision(params) {
  return request(`/api/investDecision?${stringify(params)}`);
}

export async function queryLicen(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/querylicense`,{
    method:'POST',
    body: str
  });
}

// 基金管理
export async function queryFund(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/queryfund`,{
    method:'POST',
    body: str
  });
}
export async function findFund(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/querylpbyfundid`,{
    method:'POST',
    body: str
  });
}


export async function addFund(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/fundadmin/save`,{
    method:'POST',
    body: str
  });
}



//牌照管理
export async function queryLicense(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/bd/querylicense`,{
    method:"POST",
    body: str
  });
}
export async function newqueryIcm(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/pm/icm/queryByid`,{
    method:"POST",
    body: str
  });
}
//合作伙伴
export async function queryPartner(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/querypartner`,{
    method:'POST',
    body: str
  });
}

export async function addPartnerAdd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/partneradmin/save`,{
    method:'POST',
    body: str
  });
}

export async function removePartner(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/partneradmin/delete`,{
    method:'POST',
    body: str
  });
}




// 基本管理中lp查询
export async function queryLpList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/querylp`,{
    method:'POST',
    body: str
  });
}




//ceshi
export async function ceshiProject(params) {
  return request(`/dd/api/futures/v3/instruments?instrument_id=BTC-USD/:index`);
}



//基金id查询
export async function queryFundup(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/fundadmin/queryById`,{
    method:'POST',
    body: str
  });
}


export async function getRules(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/user`,{
    method:'POST',
    body: str
  });
}

export async function addRules(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/fundvoterule/save`,{
    method:'POST',
    body: str
  });
}

export async function findRules(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/queryfundvoterule`,{
    method:'POST',
    body: str
  });
}

export async function queryPlan(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/investplan/queryById`,{
    method:'POST',
    body: str
  });
}

export async function findPlan(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/queryfund`,{
    method:'POST',
    body: str
  });
}
export async function updatePlan(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/investplan/save`,{
    method:'POST',
    body: str
  });
}

export async function assignIcm(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/user`, {
    method: 'POST',
    body:str
  });
}

export async function evenIcm(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/icm/queryByid`,{
    method:"POST",
    body:str
  });
}

export async function fetchresult(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/icm/queryByid`,{
    method:"POST",
    body:str
  });
}
export async function icmupdateIcm(params) {
  return request(`${baseUrl}/rest/pm/icmupdate`,{
    method:'POST',
    body: params
  });
}
export async function icmupdateIcmNoFile(params) {
  const str = JSON.stringify(params)
  return request(`${baseUrl}/rest/pm/icmupdate`,{
    method:'POST',
    body: params
  });
}
export async function resultVote(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/wm/vote`,{
    method:'POST',
    body: str
  });
}

export async function updatePassword(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/setPassWord`,{
    method:'POST',
    body: str
  });
}

export async function queryPostProjectBasicInfoById(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/post/queryPostProjectBasicInfoById`,{
    method:'POST',
    body: str
  });
}

export async function fetchcorpDetaildata(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/queryProjectDetailById`,{
    method:'POST',
    body: str
  });
}

export async function addfinace(params) {
  return request(`${baseUrl}/rest/pm/updateprojectwithattachment`,{
    method:'POST',
    body: params
  });
}

export async function fetchfinace(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: str
  });
}

export async function addquater(params) {
  return request(`${baseUrl}/rest/pm/updateprojectwithattachment`,{
    method:'POST',
    body: params
  });
}

export async function fetchquater(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: str
  });
}

export async function addholder(params) {
  return request(`${baseUrl}/rest/pm/updateprojectwithattachment`,{
    method:'POST',
    body: params
  });
}

export async function fetchholder(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: str
  });
}

export async function addaudit(params) {
  return request(`${baseUrl}/rest/pm/updateprojectwithattachment`,{
    method:'POST',
    body: params
  });
}

export async function fetchaudit(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/queryattchment`,{
    method:'POST',
    body: str
  });
}

export async function queryConfirm(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/investplan/queryById`,{
    method:'POST',
    body:str
  })
}

//我的申请--已审批列表
export async function queryApplyed(params){
  return request(`${baseUrl}/rest/approval/queryminelist`,{
    method:'POST',
    body:{
      ...params
    }
  })
}

//我的申请--待审批列表
/*export async function queryReadyApply(params){
  return request(`${baseUrl}/rest/wfClaimformH/onaudit/query`,{
    method:'POST',
    body:params
  })
}*/
//未审批
export async function queryReadyApply(params){
  return request(`${baseUrl}/rest/approval/queryaudittaskbyuserid`,{
    method:'POST',
    body:params
  })
}
//我的申请--已审批列表
export async function queryReadyApplyed(params){
  return request(`${baseUrl}/rest/approval/queryauditedtaskbyuserid`,{
    method:'POST',
    body:params
  })
}

export async function removePlan(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/cancel`,{
    method:'POST',
    body:str
  })
}
export async function findLpListData(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/querylp`,{
    method:'POST',
    body:str

  })
}

export async function FindManager(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/user`,{
    method:'POST',
    body:str
  })
}
export async function querylist(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pm/queryownproject`,{
    method:'POST',
    body:str
  })
}
export async function newdata(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/dept`,{
    method:'POST',
    body:str
  })
}

export async function addPersonal(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/psndoc/save`,{
    method:'POST',
    body:str
  })
}
export async function queryPersonal(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/psndoc`,{
    method:'POST',
    body:str
  })
}

export async function removePersonal(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/psndoc/delete`,{
    method:'POST',
    body:str
  })
}
export async function newdataPer(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/dept`,{
    method:'POST',
    body:str
  })
}
export async function submitData(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/dept/save`,{
    method:'POST',
    body:str
  })
}

export async function queryRoles(params){
  const str = JSON.stringify(params);
  return request(`/rest/role/query`,{
    method:'POST',
    body:str
  })
}

export async function newdatasss(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/areacl`,{
    method:'POST',
    body:str
  })
}

export async function addData(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/areacl/save`,{
    method:'POST',
    body:str
  })
}

export async function findId(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/areacl/querybyid`,{
    method:'POST',
    body:str
  })
}
export async function newregister(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/menu/save`,{
    method:'POST',
    body:str
  })
}

export async function assignsss(params){
  const str = JSON.stringify(params);
  return request(`/rest/user/query`,{
    method:'POST',
    body:str
  })
}
export async function fetchAntu(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/menu`, {
    method:'POST',
    body:str
  })
}

export async function findnewdata(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/psndoc`,{
    method:'POST',
    body:str
  })
}

export async function selectBus(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/cubasdoc/queryById`,{
    method:'POST',
    body:str
  })
}

export async function findRoleA(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/cubasdoc`,{
    method:'POST',
    body:str
  })
}

export async function bussTree(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/areacl`,{
    method:'POST',
    body:str
  })
}
export async function findnewdataDapart(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/psndoc`,{
    method:'POST',
    body:str
  })
}
export async function removenewdata(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/areacl/delete`,{
    method:'POST',
    body:str
  })
}

export async function removenewdatamenu(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/menu/delete`,{
    method:'POST',
    body:str
  })
}
export async function removeDM(params){
  return request(`${baseUrl}/rest/bd/dept/delete`,{
    method:'POST',
    body:params
  })
}

export async function Distribution(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/role/wxminiprogram/menu/save`,{
    method:'POST',
    body:str
  })
}

export async function addRole(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/role/save`,{
    method:'POST',
    body: str,
  });
}

export async function roleIdAntu(params){
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/role/menu`,{
    method:'POST',
    body:str
  })
}

export async function fetchStatus(params){
  const str = JSON.stringify(params);
  return request(`/rest/status/query`,{
    method:'POST',
    body:str
  })
}

export async function inputIndex(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/role/updateindexpage`,{
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

export async function fetchPerson(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/user_unassociated`,{
    method:'POST',
    body: str,
  });
}

export async function checkStatustable(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/agree`,{
    method:'POST',
    body: str,
  });
}

export async function refuseStatustable(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/reject`,{
    method:'POST',
    body: str,
  });
}
//   1：合同审核
//   2：合同变更审核
//   3：立项审核
//   4：立项变更审核
//   5：项目里程碑审核
//   6：营销里程碑审核
//   7：结项审核
//   8：报销单审核
//
//

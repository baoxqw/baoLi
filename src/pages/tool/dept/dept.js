import storage from '@/utils/storage'

const userinfo = storage.get("userinfo");
//自身部门
let deptName = "";
//自身角色
let roleListName = [];

if(userinfo){
  if(userinfo.psndoc){
    deptName = userinfo.psndoc.deptname;
  }
  if(userinfo.roleList && userinfo.roleList.length){
    userinfo.roleList.map(item =>{
      roleListName.push(item.roleName)
    })
  }
}

//工程部报销单
const EngineeringReimbursement= "工程部员工-项目经理-工程部经理-技术总监-总经理-财务";
//工程部差旅
const EngineeringTravel= "工程部员工-工程部经理-技术总监-总经理-财务";

//商务部报销单
const MinistryReimbursement= "商务部员工-商务部经理-总经理";
//商务部差旅
const EngineeringDepartment= "商务部员工-商务部经理-总经理-财务";

//财务部差旅
const FinanceDepartmentTravel = "财务部员工-财务部经理-总经理-财务";

//生产采购部差旅
const ProductionPurchasingTravel = "生产采购部员工-生产采购部经理-总经理-财务";

/*function isProcess(isArr = []) { // 判断流程
  let arr = [];
  isArr.map(item =>{
    const a = item.split("-");
    roleListName.map(item =>{
      a.map((it,i) =>{
        if(item === it){
          arr = a.slice(i+1);
        }
      })
    });
  })
  return arr
}

function setEngineering(is){ // 0:报销单 1:差旅
  let NextRole = []; //下一步
  let status = false;
  switch (is) {
    case 0:
      NextRole = isProcess([EngineeringReimbursement,MinistryReimbursement])
      if(roleListName.indexOf("工程部员工") !== -1){
        status = true;
      }
      break;
    case 1:
      NextRole = isProcess([EngineeringTravel,EngineeringDepartment,FinanceDepartmentTravel,ProductionPurchasingTravel]);
      break;
  }
  return {
    NextRole,
    status
  }
}*/

function isProcess(isArr = [],is) { // 判断流程
  let zong = false
  roleListName.map(item =>{
    if(item === "总经理"){
      zong = true
    }
  });

  if(zong){
    return ["财务"]
  }else{
    let arr = [];
    let role = "";
    let status = false;
    let index = 0;
    isArr.map((item,i) =>{
      const a = item.split("-");
      roleListName.map(it =>{
        a.map((em) =>{
          if(em === it){
            status = true;
            role = it;
            index = i;
          }
        })
      });
    });
    if(status){
      if(is){
        arr = ["总经理","财务"]
      }else{
        if(index === 0){
          arr = ["总经理","财务"]
        }
        if(index === 1){
          arr = ["总经理"]
        }
      }
    }
    return arr
  }
}

function setEngineering(is){ // 0:报销单 1:差旅
  let data = []; //下一步
  switch (is) {
    case 0:
      data = isProcess([EngineeringReimbursement,MinistryReimbursement],is);
      break;
    case 1:
      data = isProcess([EngineeringTravel,EngineeringDepartment,FinanceDepartmentTravel,ProductionPurchasingTravel],is);
      break;
  }
  return data
}

export {
  setEngineering,
  roleListName
};

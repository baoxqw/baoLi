import { parse } from 'url';

// mock userAdminDataSource
let dataSource = [];
for (let i = 0; i < 6; i += 1) {
  dataSource.push({
    key: i,
    id:i,
    code:`0977${i}`,
    type: `测试` ,
    projectname: ` 项目 ${i}`,
    projectperson: ` 孙俪`,
    completetime: `2019-04-25`,
    department: `检查组`,
    status: `${Math.round(Math.random()) === 1 ? '已通过':'未通过'}`,
  });
}

function fetchpApproval(req, res, u,b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const body = (b && b.body) || req.body;
  const { reqData:{ pageIndex,pageSize } } = body;
  const result = {
    list: dataSource,
    total: dataSource.length,
  };
  return res.json(result);
}
function removeApproval(req, res, u,b) {

  const {reqData} = req.body
  const id = reqData.id
  console.log('id',id)
  const newdata = dataSource.filter((item)=>{
    if(item.id !== id){
      return item
    }
  })
  console.log('newdata',newdata)
  const result = {
    list:newdata,
    total:newdata.length
  }
  return res.json(result);
  /* const body = (b && b.body) || req.body;
   const { reqData:{ pageIndex,pageSize } } = body;
   const result = {
     list: dataSource,
     pagination: {
       total: dataSource.length,

     },
   };
   return res.json(result);*/
}
function approvalAdd(req, res, u,b) {
  const {reqData} = req.body

  let id = Math.max.apply(null,dataSource.map((item)=>item.id))
      id+=1
  let key = Math.max.apply(null,dataSource.map((item)=>item.key))
      key+=1
  reqData.id = id
  reqData.key = key
  reqData.status =`${Math.round(Math.random()) === 1 ? '已通过':'未通过'}`,
  dataSource.unshift(reqData)
  return res.json(dataSource)
}
function removeApprovald(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const { method } = req;
  const body = (b && b.body) || req.body;
  const {  name, desc, key } = body;
  console.log('----',method)
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'DELETE':
      //dataSource = dataSource.filter(item => key.indexOf(item.key) === -1);
      console.log('----')
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      dataSource.unshift({
        key: i,
        code:`0977${i}`,
        type: `测试` ,
        projectperson: ` 孙俪`,
        projectname: ` 项目 ${i}`,
        completetime: `2019-04-25`,
        project: `检查组`,
        status: `${Math.round(Math.random()) === 1 ? '已通过':'未通过'}`,
      });
      break;
    case 'update':
      dataSource = dataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { desc, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
    },
  };

  return res.json(result);
}

export default {
  'POST /rest/projectapproval/query': fetchpApproval,
  'POST /rest/projectapproval/remove': removeApproval,
  'POST /rest/projectapproval/add': approvalAdd,

};

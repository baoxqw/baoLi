import { parse } from 'url';

// mock userAdminDataSource
let dataSource = [];
for (let i = 0; i < 46; i += 1) {
  dataSource.push({
    key: i,
    id:i,
    numbering:i,
    node: `测试 ${i}`,
    projectname: ` 项目 ${i}`,
    projecttype: 1,
    //projectamount: 30000+i,
    //projectbudget: 20000+i,
    projectprincipal: `张三${i}`,
    projectschedule: `${i}%`,
    knottype:Math.round(Math.random()) === 1 ? 1:0,
    projectstatus:Math.round(Math.random()) === 1 ? 1:0,
    ischange:Math.round(Math.random()) === 1 ? 1:0,
  });
}

function fetchFP(req, res, u,b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { reqData:{ pageIndex,pageSize } } = body;

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      //pageSize,
      //current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function updateFP(req, res) {
  const { reqData } = req.body;
  const { id } = reqData;
  dataSource.map(item =>{
    if(item.id === id){
      Object.assign(item,reqData);
      return item
    }
    return item
  })
  console.log("dataSource",dataSource)
  return res.json("修改成功")
}

function deleteFP(req, res) {
  const { reqData:{id} } = req.body;
  const data = dataSource.filter((item)=>{
    return item.id !== id
  })
  dataSource = data;
  console.log("data",data);
  return res.json("删除成功")
}

export default {
  'POST /rest/projectfind/query': fetchFP,
  'POST /rest/projectfind/update': updateFP,
  'POST /rest/projectfind/delete': deleteFP,
};

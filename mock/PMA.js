import { parse } from 'url';

// mock userAdminDataSource
let dataSource = [];
for (let i = 0; i < 46; i += 1) {
  dataSource.push({
    key: i,
    index:i,
    id:i,
    projectname: ` 跨海工程 ${i}`,
    paymentamount: `10000${i*10}`,
    paymentdate: `2019-04-10`,
    manager: `${Math.round(Math.random()) === 1 ? '超级管理员':'管理员'}`,
    isconfirm: `${Math.round(Math.random()) === 1 ? '是':'否'}`,
    memo: `备注 ${i}`,
  });
}

function fetchPMA(req, res, u,b) {
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

function addPMA(req, res) {
  console.log("req",req);
  const { reqData } = req.body;
  //获取最大的key和最大的index和id
  const keyMax = Math.max.apply(Math,dataSource.map((item)=>item.key));
  const indexMax = Math.max.apply(Math,dataSource.map((item)=>item.index));
  const idMax = Math.max.apply(Math,dataSource.map((item)=>item.id));
  const key = keyMax + 1;
  const index = indexMax + 1;
  const id = idMax + 1;
  reqData.key = key;
  reqData.index = index;
  reqData.id = id;
  dataSource.push(reqData);
  console.log("dataS",dataSource);
  return res.json("成功")
}

function deletePMA(req, res) {
  const { reqData:{id} } = req.body;
  const data = dataSource.filter((item)=>{
    return item.id !== id
  })
  dataSource = data;
  console.log("data",data);
  return res.json("删除成功")
}

function updatePMA(req, res) {
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

export default {
  'POST /rest/pma/query': fetchPMA,
  'POST /rest/pma/add': addPMA,
  'POST /rest/pma/delete': deletePMA,
  'POST /rest/pma/update': updatePMA,
};

import { parse } from 'url';

// mock userAdminDataSource
let dataSource = [];
for (let i = 0; i < 46; i += 1) {
  dataSource.push({
    key: i,
    id:i,
    index: i,
    customernumber:`客户编号 ${i}`,
    customername:`客户名称 ${i}`,
    abbreviation: `简称 ${i}`,
    contact: ` 联系人 ${i}`,
    phone: `131221782${i}`,
    customertype: `${Math.round(Math.random()) === 1 ? '合资':'独资'}`,
    industry: `电力`,
    address: `地址 ${i}`,
    email:`89145317${i}@qq.com`,
    memo:`备注 ${i}`
  });
}

function fetchCM(req, res, u,b) {
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

function addCM(req, res) {
  console.log("req",req);
  const { reqData } = req.body;
  //获取最大的key和最大的index和id
  const keyMax = Math.max.apply(Math,dataSource.map((item)=>item.key));
  const indexMax = Math.max.apply(Math,dataSource.map((item)=>item.index));
  const idMax = Math.max.apply(Math,dataSource.map((item)=>item.id));
  const key = keyMax + 1;
  const index = indexMax + 1;
  const id = idMax + 1;
  const customernumber = `客户编号 ${id}`;
  reqData.key = key;
  reqData.index = index;
  reqData.id = id;
  reqData.customernumber = customernumber;
  dataSource.push(reqData);
  console.log("dataS",dataSource);
  return res.json("成功")
}

function updateCM(req, res) {
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

function deleteCM(req, res) {
  const { reqData:{id} } = req.body;
  const data = dataSource.filter((item)=>{
    return item.id !== id
  })
  dataSource = data;
  console.log("data",data);
  return res.json("删除成功")
}


export default {
  'POST /rest/cm/query': fetchCM,
  'POST /rest/cm/add': addCM,
  'POST /rest/cm/update': updateCM,
  'POST /rest/cm/delete': deleteCM,
};

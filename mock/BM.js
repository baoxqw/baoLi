import { parse } from 'url';

// mock userAdminDataSource
let dataSource = [];
for (let i = 0; i < 46; i += 1) {
  dataSource.push({
    key: i,
    id:i,
    invoicetype:`类型 ${i}`,
    invoicenumber:i + Math.round(Math.random()),
    billingdate: "2019-12-12",
    clientname: `张三`,
    customerphone: 1312217824,
    customerprintname: `打印`,
    customertaxnumber: `12334565436796588`,
    customerbank: '工商',
  });
}

function fetchBM(req, res, u,b) {
  console.log("req",req.body)
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

function addBM(req, res) {
  console.log("req",req);
  const { reqData } = req.body;
  //获取最大的key和最大的index和id
  const keyMax = Math.max.apply(Math,dataSource.map((item)=>item.key));
  const idMax = Math.max.apply(Math,dataSource.map((item)=>item.id));
  const key = keyMax + 1;
  const id = idMax + 1;
  reqData.key = key;
  reqData.id = id;
  dataSource.push(reqData);
  console.log("dataS",dataSource);
  return res.json("成功")
}

function updateBM(req, res) {
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

function deleteBM(req, res) {
  const { reqData:{id} } = req.body;
  const data = dataSource.filter((item)=>{
    return item.id !== id
  })
  dataSource = data;
  console.log("data",data);
  return res.json("删除成功")
}


export default {
  'POST /rest/bm/query': fetchBM,
  'POST /rest/bm/add': addBM,
  'POST /rest/bm/update': updateBM,
  'POST /rest/bm/delete': deleteBM,
};

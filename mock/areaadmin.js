import { parse } from 'url';

// mock userAdminDataSource

const arrData = [
  {title:'中国',id:1},
  {title:'河南',id:2,pid:1},
  {title:'浙江',id:3,pid:1},
  {title:'上海',id:4,pid:1},
  {title:'美国',id:5},
  {title:'纽约',id:6,pid:5},
  {title:'洛杉矶',id:7,pid:5},
  {title:'芝加哥',id:8,pid:5},
  {title:'韩国',id:9},
  {title:'首尔',id:10,pid:9},
  {title:'仁川',id:11,pid:9},
]


function newdatasss(req, res, u,b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;

  return res.json(arrData);
}

function addData(req, res, u,b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const body = (b && b.body) || req.body;
  const { reqData } = body;
  let a = [];
  arrData.map(item =>{
    a.push(item.id)
  });
  let idMax = Math.max(...a);
  let id = idMax + 1;
  reqData.id = id;
  arrData.push(reqData)
  console.log(reqData)
  return res.json("添加成功");
}


export default {
  'POST /rest/bd/dept': newdatasss,
  'POST /rest/add/dept': addData,
};

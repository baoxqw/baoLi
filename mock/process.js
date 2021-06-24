import { parse } from 'url';

// mock userAdminDataSource
let dataSource = [];
for (let i = 0; i < 46; i += 1) {
  dataSource.push({
    key: i,
    id:i,
    code:`4977${i}`,
    type: `测试` ,
    projectname: ` 项目 ${i}`,
    projectperson: ` 艾琳`,
    department:`技术部`,
    foreproject:`${i+8}%`,
    realproject:`${i}%`,
    agreement:`67${i}`,
    status: `${Math.round(Math.random()) === 1 ? '已通过':'未通过'}`,
  });
}
let historySource = [];
for (let i = 0; i < 6; i += 1) {
  historySource.push({
    key: i,
    id:i,
    esprogress:`${i}0%`,
    progress:`${i}2%`,
    creater: ` 艾琳`,
    department:`技术部`,
    createdata:'2019-01-11'
  });
}
let bosomSource = [];
for (let i = 0; i < 6; i += 1) {
  bosomSource.push({
    key: i,
    id:i,
    esprogress:`${i}1%`,
    progress:`${i}4%`,
    creater: ` 李科`,
    department:`研发组`,
    createdata:'2014-05-11'
  });
}
let hismarketSource = [];
for (let i = 0; i < 6; i += 1) {
  hismarketSource.push({
    key: i,
    id:i,
    esprogress:`${i}3%`,
    progress:`${i}9%`,
    creater: ` 营销`,
    department:`里程碑`,
    createdata:'2018-05-11'
  });
}
function fetchpProcess(req, res, u,b) {
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
function updateProcess(req, res,) {
  const { reqData } = req.body;
  const id = reqData.id
  console.log('reqData',reqData)
  dataSource.map((item)=>{
    if(item.id == id){
      Object.assign(item,reqData)
      return item
    }
  })
  return res.json(dataSource)
}
function fetchHistory( req, res,u,b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { reqData:{ pageIndex,pageSize } } = body;

  const result = {
    list: historySource,
    pagination: {
      total: historySource.length,
      //pageSize,
      //current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}
function fetchBosom(req, res, u,b) {
  const body = (b && b.body) || req.body;
  const { reqData:{ pageIndex,pageSize } } = body;

  const result = {
    list: bosomSource,
    pagination: {
      total: bosomSource.length,
      //pageSize,
      //current: parseInt(params.currentPage, 10) || 1,
    },
  };
console.log('result',result)
  return res.json(result);
}
function hismarketFetch(req,res) {
  const { reqData:{ pageIndex,pageSize } } = req.body;
  const result = {
    list: hismarketSource,
    pagination: {
      total: hismarketSource.length,
      //pageSize,
      //current: parseInt(params.currentPage, 10) || 1,
    },
  };
  console.log('result',result)
  return res.json(result);
}
function removeProcess(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      dataSource = lpDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':

      const i = Math.ceil(Math.random() * 10000);
      lpDataSource.unshift({
        key: i,
        id:i,
        code:`4977${i}`,
        type: `测试` ,
        projectname: ` 项目 ${i}`,
        projectperson: ` 艾琳`,
        department:`技术部`,
        agreement:`67${i}`,
        status: `${Math.round(Math.random()) === 1 ? '已通过':'未通过'}`,
      });
      break;
    case 'update':
      dataSource = lpDataSource.map(item => {
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
    list: lpDataSource,
    pagination: {
      total: lpDataSource.length,
    },
  };

  return res.json(result);
}

export default {
  'POST /rest/projectprocess/query': fetchpProcess,
  'POST /rest/historyprocess/query': fetchHistory,
  'POST /rest/hismarket/query': hismarketFetch,
  'POST /rest/projectprocess/remove': removeProcess,
  'POST /rest/bosom/query': fetchBosom,
  'POST /rest/updateProcess/query': updateProcess,

};

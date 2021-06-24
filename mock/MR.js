import { parse } from 'url';

// mock userAdminDataSource
let dataSource = [];
for (let i = 0; i < 46; i += 1) {
  dataSource.push({
    key: i,
    index:i,
    id:i,
    node: `测试 ${i}`,
    projectname: ` 项目测试流程 ${i}`,
    completetime: `2019-04-25`,
    informant: `张三${i}`,
    memo:`暂无备注信息${i}`,
    opinion:`暂无任何意见${i}`,
    evidence:`文件${i}`,
    infordate: `2019-04-13`,
    status: `${Math.round(Math.random()) === 1 ? '已审核':'未审核'}`,
  });
}

function fetchMR(req, res, u,b) {

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
console.log('result',result)
  return res.json(result);
}

function addMR(req, res, u, b) {
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
        name: `Lp名称 ${i}`,
        subscribed: ` ${1000 * i}`,
        payin: `${100 * i}`,
        paydate: `2010-01-01`,
        contactperson: `联系人 ${i}`,
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
function checkMR(req,res) {
  return
  const { reqData } = req.body
  const id = reqData.id
  dataSource.map((item)=>{
    if(item.id == id){
      Object.assign(item,reqData)
      item.status = '已审核'
      return item
    }
  })
  return res.json(dataSource)
}
export default {
  'POST /rest/milestone/query': fetchMR,
  'POST /rest/milestone/check': checkMR,
};

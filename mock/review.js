import { parse } from 'url';

// mock userAdminDataSource
let dataSource = [];
for (let i = 0; i < 46; i += 1) {
  dataSource.push({
    key: i,
    id:i,
    code:`0977${i}`,
    type: `测试` ,
    projectname: ` 项目 ${i}`,
    projectperson: ` 孙俪`,
    completetime: `2019-04-25`,
    project: `检查组`,
    status: `${Math.round(Math.random()) === 1 ? '已通过':'未通过'}`,
  });
}

function fetchpReview(req, res, u,b) {
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
function updateReview(req,res){
  const { reqData } = req.body
  const id = reqData.id
  dataSource.map((item)=>{
    if(item.id == id ){
      Object.assign(item,reqData)
      return item
    }
  })
  return res.json(dataSource)
  console.log('req',req)
}
function removeReview(req, res, u, b) {
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
  'POST /rest/projectreview/query': fetchpReview,
  'POST /rest/projectreview/remove': removeReview,
  'POST /rest/projectreview/check': updateReview,

};

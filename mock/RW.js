import { parse } from 'url';

// mock userAdminDataSource
let dataSource = [];
for (let i = 0; i < 46; i += 1) {
  dataSource.push({
    key: i,
    index:i,
    node: `测试 ${i}`,
    projectname: ` 项目名称 ${i}`,
    department: ` 部门 ${i}`,
    projectamount: 15000 + i,
    costincurred:5000+i,
    costthismonth:2000+i,
    costbudget:9000+i,
    proportion:20,
    laborfee:1000+i,
    travelexpenses:500+i,
    externalfee:600+i,
    managementallocation:1000+i,
    tax:700+i,
    othercosts:500+i,
  });
}

function fetchRW(req, res, u,b) {
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

export default {
  'POST /rest/rw/query': fetchRW,
};

import { parse } from 'url';

// mock userAdminDataSource
let dataSource = [];
for (let i = 0; i < 46; i += 1) {
  dataSource.push({
    key: i,
    projectname: ` AGC ${i}`,
    implementer: `张三${i}`,
    content: `与本地调试${i}`,
    date: `2019-04-13`,
    days: 3,
    trafficdays: 1,
    workdays: 2,
    costofexpenses: 150+i,
    projectbudget: 1500+i,
    projectbalance: 708+i,
  });
}

function fetchPOM(req, res, u,b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;

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


export default {
  'POST /rest/pom/query': fetchPOM,
};

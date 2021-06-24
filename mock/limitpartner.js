import { parse } from 'url';

// mock userAdminDataSource
let lpDataSource = [];
for (let i = 0; i < 46; i += 1) {
  lpDataSource.push({
    key: i,
    name: `Lp名称 ${i}`,
    subscribed: ` ${1000 * i}`,
    payin: `${100 * i}`,
    paydate: `2010-01-01`,
    contactperson: `联系人 ${i}`,
  });
}

function getLp(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = lpDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function postLp(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      lpDataSource = lpDataSource.filter(item => key.indexOf(item.key) === -1);
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
      lpDataSource = lpDataSource.map(item => {
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
  'GET /api/limitpartner': getLp,
  'POST /api/limitpartner': postLp,
};

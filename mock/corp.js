import { parse } from 'url';

// mock userAdminDataSource
let corpDataSource = [];
for (let i = 0; i < 46; i += 1) {
  corpDataSource.push({
    key: i,
    name: `公司名称 ${i}`,
    tag: `tag ${i}`,
    region: `地区 ${i}`,
    createdate: `2010-01-01`,
    mainbusiness: `主营业务 ${i}`,
    ceo: `ceo ${i}`,
  });
}

function getCorp(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = corpDataSource;

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

function postCorp(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      corpDataSource = corpDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      corpDataSource.unshift({
        key: i,
        name: `公司名称 ${i}`,
        tag: `tag ${i}`,
        region: `地区 ${i}`,
        createdata: `2010-01-01`,
        mainbusiness: `主营业务 ${i}`,
        ceo: `ceo ${i}`,
      });
      break;
    case 'update':
      corpDataSource = corpDataSource.map(item => {
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
    list: corpDataSource,
    pagination: {
      total: corpDataSource.length,
    },
  };

  return res.json(result);
}

function deleteProject(req,res) {
  const key = req.body;
  corpDataSource = corpDataSource.filter(value => value.key !== key);
  const result = {
    list: corpDataSource,
    pagination: {
      total: corpDataSource.length,
    },
  };
  return res.json(result);
}


export default {
  'GET /api/corp/project': getCorp,
  'POST /api/corp': postCorp,
  'POST /api/corp/project': deleteProject
};

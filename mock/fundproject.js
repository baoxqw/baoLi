import { parse } from 'url';

// mock userAdminDataSource
let projectDataSource = [];
for (let i = 0; i < 46; i += 1) {
  projectDataSource.push({
    key: i,
    name: `项目+名称 ${i}`,
    createperson: `创建人${i}`,
    state: `状态${i}`,
    attachment: `${i}.docx`,
  });
}


let ongoingprojectDataSource = [];
for (let i = 0; i < 46; i += 1) {
  ongoingprojectDataSource.push({
    key: i,
    name: `项目名称 ${i}`,
    projectmanager: `项目经理${i}`,
    state: `状态${i}`,
  });
}

function getProject(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = projectDataSource;

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

function getOngoingProject(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = ongoingprojectDataSource;

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

function postProject(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      projectDataSource = projectDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      projectDataSource.unshift({
        key: i,
        name: `项目名称 ${i}`,
        createperson: `创建人${i}`,
        state: `状态${i}`,
        attachment: `${i}.docx`,
      });
      break;
    case 'update':
      projectDataSource = projectDataSource.map(item => {
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
    list: projectDataSource,
    pagination: {
      total: projectDataSource.length,
    },
  };

  return res.json(result);
}

// function newAddProject(req,res,u) {
//   const body = req.body;
//   const {  name,type } = body[0];
//   const i = Math.ceil(Math.random() * 10000);
//   projectDataSource.unshift({
//     key: i,
//     name: `项目名 ${i}`,
//     state: `状态${i}`,
//     createperson:`创建人${i}`,
//     attachment: name
//   });
//   const result = {
//     list: projectDataSource,
//     pagination: {
//       total: projectDataSource.length,
//     },
//   };
//
//   return res.json(result);
// }
function newAddProject(req,res) {
  const obj = {
    msg:"成功"
  }
  console.log(req)
  return res.json(obj)
}
function removeProject(req, res) {
  const url = req.url;
  const params = parse(url, true).query;
  const key = Number(params.key)
  projectDataSource = projectDataSource.filter(value => value.key !== key);
  const result = {
    list: projectDataSource,
    pagination: {
      total: projectDataSource.length,
    },
  };

  // console.log(result)
  return res.json(result);
}

function findProject(req,res){
  const code = req.body;
  let arr = []
  arr = projectDataSource.filter(value => value.name === code)
  const result = {
    list: arr,
    pagination: {
      total: arr.length,
    },
  };
  return res.json(result);
}

function findongoingProject(req,res){
  const {code} = req.body;
  let arr = [];
  arr = ongoingprojectDataSource.filter(value => value.name === code)
  const result = {
    list: arr,
    pagination: {
      total: arr.length,
    },
  };
  return res.json(result);
}
export default {
  'GET /api/fundproject': getProject,
  'POST /api/fundproject': postProject,
  'GET /api/ongoingproject': getOngoingProject,
  'POST /rest/pm/newproject': newAddProject,
  'GET /rest/pm/delproject': removeProject,
  'POST /rest/pm/querynewproject': findProject,
  'POST /rest/pm/findongoing': findongoingProject,

};

import { parse } from 'url';

// mock userAdminDataSource
const arrData = [
  {name:'基础数据',id:1},
  {name:'地区分类',id:2,pid:1},
  {name:'客商管理',id:3,pid:1},
  {name:'项目管理',id:4},
  {name:'立项申请',id:5,pid:4},
  {name:'立项审核',id:6,pid:4},
  {name:'立项XXX',id:7,pid:6},
]

const treeData = [
  {
    name: '基础数据',
    id:1,
    children: [
      {
        name: '地区分类',
        id:2
      },
      {
        name: '客商管理',
        id:3
      },
    ],
  },
  {
    name: '项目管理',
    id:4,
    children: [
      {
        name: '立项申请',
        id:5
      },
      {
        name: '立项审核',
        id:6,
        children:[
          {
            name: '立项XXX',
            id:7,
          }
        ]
      },
    ]
  },
];

function queryRoles(req, res, u,b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;

  return res.json(arrData);
}



export default {
  'POST /rest/role/query': queryRoles,
};

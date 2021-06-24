const routesConfig = [
  // user
  {
    path: '/user',
    // component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      // { path: '/user/register', component: './User/Register' },
      // { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // 管理员 dashboard
      {
        path: '/credit/list',
        component: './Func/Credit',
      },
      //机构
      {
        path: '/organ',
        icon: 'export',
        name: 'organ',
        authority: ['admin'],
        hideChildrenInMenu: true,
        routes:[
          {
            path: '/organ',
            redirect: '/organ/list',
          },
          {
            path: '/organ/list',
            name: 'organList',
            component: './Organ/Organ',
            authority: ['admin'],
          }
        ]
      },
      //授信
      {
        path: '/credit',
        icon: 'setting',
        name: 'credit',
        authority: ['admin','creditQuery','creditAudit'],
        hideChildrenInMenu: true,
        routes:[
          {
            path: '/credit',
            redirect: '/credit/list',
          },
          {
            path: '/credit/list',
            name: 'creditList',
            component: './Func/Credit',
            authority: ['admin','creditQuery','creditAudit'],
          },
          {
            path: '/credit/creditInfo/:id',
            name: 'detail',
            component: './Func/CreditInfo',
            authority: ['admin','creditQuery','creditAudit'],
          },
        ]
      },
      //支用
      {
        path: '/loan',
        icon: 'file-sync',
        name: 'loan',
        authority: ['admin','loanQuery','loanAudit'],
        hideChildrenInMenu: true,
        routes:[
          {
            path: '/loan',
            redirect: '/loan/list',
          },
          {
            path: '/loan/list',
            name: 'loanList',
            authority: ['admin','loanQuery','loanAudit'],
            component: './FuncLoan/Loan',
          },
          {
            path: '/loan/loanInfo/:id',
            name: 'detail',
            authority: ['admin','loanQuery','loanAudit'],
            component: './FuncLoan/LoanInfo',
          },
        ]
      },
      //资料附件
      {
        path: '/information',
        icon: 'profile',
        name: 'information',
        authority: ['admin','dataSync'],
        hideChildrenInMenu: true,
        routes:[
          {
            path: '/information',
            redirect: '/information/list',
          },
          {
            path: '/information/list',
            name: 'InformationList',
            authority: ['admin','dataSync'],
            component: './Information/Information',
          },

        ]
      },
    ],
  },

];

export default routesConfig;

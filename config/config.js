// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';
import env from './env'

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
      },
      pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
          importWorkboxFrom: 'local',
        },
      },
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: true,
          }
        : {}),
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// 业务上不需要这个
if (process.env.APP_TYPE === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },

  ]);
}

export default {
  // add for transfer to umi
  plugins,
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
     // DID_MOCK: process.env.MOCK !== 'none',
    'process.env':{
      API_ENV: process.env.API_ENV,
    }
  },
  targets: {
    ie: 11,
  },
  // 路由配置
  routes: pageRoutes,
   // Themefor:antd,
   // https:ant.design/docs/react/customize-theme-cn,
  //
  theme: {
     // 'primary-color': defaultSettings.primaryColor,
     'primary-color': '#ff0006',
    // 'primary-color': '#1DA57A',
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  proxy: {
    // '/server/api/': {
    //   target: 'https://preview.pro.ant.design/',
    //   changeOrigin: true,
    //   pathRewrite: { '^/server': '' },
    // },
    '/wookong': {

                  // target: 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT',

                  // target: process.env.API_ENV === 'test'?'https://49.234.209.104/nien-0.0.1-SNAPSHOT':'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT',

                 //   target: 'http://192.168.2.180:8080',


            //target: 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT',
            //target: process.env.API_ENV === 'test'?'https://49.234.209.104/nien-0.0.1-SNAPSHOT':'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT',
            target: env+"/wookong",
           //   target: 'http://192.168.2.180:8080',

           //target: 'http://118.24.64.142:8000/',
           //    target: 'https://49.234.209.104/nien-0.0.1-SNAPSHOT',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/wookong': '',
      },
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  history: 'hash',
  chainWebpack: webpackPlugin,
  publicPath:'/static/'
};

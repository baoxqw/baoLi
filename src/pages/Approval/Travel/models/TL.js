import { fetchTL,superAdd,superDelete,childFetch,childAdd,childDelete,fetchList,deleteend,fetchticket,submitProjectAddForm} from '@/services/TL';
import { fetchProject, fetchRR, submitRR,queryRole,queryNameRole,sendMessage } from '@/services/RR';
import { queryPersonal } from '@/services/api';
import { fetchTree } from '@/services/IAE';

export default {
  namespace: 'TL',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchTL, payload);
      let { pageIndex = 0 } = payload;
      let obj = {};
      if(response.resData){
        for(let i = 0; i<response.resData.length;i++){
          const data = response.resData[i];
          const conditions = [{
            code:'CLAIMFORM_H_ID',
            exp:'=',
            value:data.id
          }]
          const res = yield call(childFetch, {conditions});
          if(res && res.resData){
            let count = 0;
            res.resData.map(item =>{
              count += item.claimingamount
            })
            response.resData[i].mny = count;
          }
        }
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      yield put({
        type: 'save',
        payload: obj,
      });
    },

    *superAdd({ payload, callback }, { call, put }) {
      const response = yield call(superAdd, payload);
      if (callback) callback(response);
    },
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      console.log("查询文件",response)
      let obj = []
      if(response.resData){
        let env = '';
        switch (process.env.API_ENV) {
          case 'test': //测试环境
            env = 'https://49.234.209.104/nienboot-0.0.1-SNAPSHOT';
            break;
          case 'dev': //开发环境
            env = 'http://127.0.0.1:8080';
            break;
          case 'produce': //生产环境
            env = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT';
            break;
        }
        response.resData.map(item =>{
          item.key = item.id;
          item.uid = item.id;
          item.url = env+item.path+'/'+item.name;
          item.thumbUrl = env+item.path+'/'+item.name;
          return item
        });
        obj = response.resData
      }
      if (callback) callback(obj);
    },
    *fetchticket({ payload, callback }, { call, put }) {
      const response = yield call(fetchticket, payload);
      let object = []
      if(response.resData){
        let env = '';
        switch (process.env.API_ENV) {
          case 'test': //测试环境
            env = 'https://49.234.209.104/nienboot-0.0.1-SNAPSHOT';
            break;
          case 'dev': //开发环境
            env = 'http://127.0.0.1:8080';
            break;
          case 'produce': //生产环境
            env = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT';
            break;
        }
        response.resData.map(item =>{
          item.key = item.id;
          item.uid = item.id;
          item.url = env+item.path+'/'+item.name;
          item.thumbUrl = env+item.path+'/'+item.name;
          return item
        });
        object = response.resData

      }
      if (callback) callback(object);
    },
    *submitProjectAddForm({ payload,callback }, { call, put }) {
      const response = yield call(submitProjectAddForm, payload);

      if (callback) callback(response);

    },
    *fetchProject({ payload,callback }, { call, put }) {
      const response = yield call(fetchProject, payload);
      const { pageIndex } = payload;
      let obj = [];
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },

    *fetchPerson({ payload,callback }, { call, put }) {
      const response = yield call(queryPersonal, payload);
      let { pageIndex = 0 } = payload;
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total,
          current:pageIndex + 1
        }
      };
      if (callback) callback(obj);
    },

    *submit({ payload,callback }, { call, put }) {
      const response = yield call(submitRR, payload);
      if (callback) callback(response);
    },

    *superDelete({ payload,callback }, { call, put }) {
      const response = yield call(superDelete, payload);
      if (callback) callback(response);
    },
    *deleteend({ payload,callback }, { call, put }) {
      const response = yield call(deleteend, payload);
      if(callback) callback(response)
    },
    *childFetch({ payload,callback }, { call, put }) {
      const response = yield call(childFetch, payload);
      if (callback) callback(response);
    },

    *childAdd({ payload,callback }, { call, put }) {
      const response = yield call(childAdd, payload);
      if (callback) callback(response);
    },

    *newdatasss({ payload,callback }, { call, put }) {
      const response = yield call(fetchTree, payload);
      if (callback) callback(response);
    },

    *childDelete({ payload,callback }, { call, put }) {
      const response = yield call(childDelete, payload);
      if (callback) callback(response);
    },

    *queryRole({ payload,callback }, { call, put }) {
      const response = yield call(queryRole, payload);
      if (callback) callback(response);
    },
    *queryNameRole({ payload,callback }, { call, put }) {
      const response = yield call(queryNameRole, payload);
      if (callback) callback(response);
    },
    *sendMessage({ payload,callback }, { call, put }) {
      const response = yield call(sendMessage, payload);
      if (callback) callback(response);
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

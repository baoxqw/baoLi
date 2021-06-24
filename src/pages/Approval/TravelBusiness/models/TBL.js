import { fetchAA,findCheck,fetched} from '@/services/TBL';
import moment from 'moment';
import { childFetch,fetchList } from '@/services/TL';
import { fetchAdvice } from '@/services/MM';
export default {
  namespace: 'TBL',

  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
    childData: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchAA, payload);
      let { pageIndex = 0 } = payload;
      let obj = {};
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id;
        })
        response.resData.map((item,index)=>{
          item.startTime = moment(item.startTime).format("YYYY-MM-DD");
          item.endTime = moment(item.endTime).format("YYYY-MM-DD");
          if(item.params){
            // item.billcode = item.params.billcode
            item.username = item.params.username
          }
          return item
        })
        obj ={
          list:response.resData,
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
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchList, payload);
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
    *fetched({ payload }, { call, put }) {
      const response = yield call(fetched, payload);
      let { pageIndex = 0 } = payload;
      let obj = {};
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id;
        })
        response.resData.map((item,index)=>{
          item.startTime = moment(item.startTime).format("YYYY-MM-DD");
          item.endTime = moment(item.endTime).format("YYYY-MM-DD");
          if(item.params){
            // item.billcode = item.params.billcode
            item.username = item.params.username
          }
          return item
        })
        obj ={
          list:response.resData,
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
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *detailcheck({ payload, callback }, { call, put }) {
      const response = yield call(detailcheck, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *find({ payload, callback }, { call, put }) {
      const response = yield call(findCheck, payload);
      console.log("查询",response)
      if (callback) callback(response);
    },
    *fetchAdvice({ payload, callback }, { call, put }) {
      const response = yield call(fetchAdvice, payload);
      if (callback) callback(response);
    },
    *childFetch({ payload,callback }, { call, put }) {
      const response = yield call(childFetch, payload);
      let count = 0;
      if(response.resData && response.resData.length){
        response.resData.map(item=>{
          item.key = item.id;
        })
        response.resData.map(item=>{
          count += item.claimingamount
        })
      }
      yield put({
        type: 'child',
        payload: response.resData,
      });
      if (callback) callback(count);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    },
    child(state, action) {
      return {
        ...state,
        childData: action.payload,
      };
    },
  },
};

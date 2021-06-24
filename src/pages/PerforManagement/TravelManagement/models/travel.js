import { fetchChild,fetchList } from '@/services/travel';
import { fetchProject } from '@/services/PMA';

export default {
  namespace: 'travel',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      let { conditions = [] } = payload;
      let status = false
      conditions.map(item =>{
        if(item.code === "status"){
          status = true
        }
      });
      if(!status){
        if(conditions.length){
          conditions.push({
            code:"status",
            exp:"=",
            value:"审批通过"
          })
        }else{
          payload.conditions = [{code:"status",
            exp:"=",
            value:"审批通过"}];

        }
      }
      const response = yield call(fetchList, payload);
      let obj = {
        list:[],
        pagination:{}
      }
      const { pageIndex } = payload;
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
      yield put({
        type: 'save',
        payload: obj
      });
      if (callback) callback(obj);
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
    *fetchChild({ payload,callback }, { call, put }) {
      const response = yield call(fetchChild, payload);
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

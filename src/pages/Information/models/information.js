import {
  fetchBL,
  findList,
} from '@/services/information';

export default {
  namespace: 'information',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchBL, payload);
      let { pageIndex = 0 } = payload;
      let obj = [];
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id
          // item.fee = JSON.parse(item.extendInfo).fee
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
        payload: obj,
      });
    },

    *findList({ payload,callback }, { call, put }) {
      const response = yield call(findList, payload);
      let { pageIndex = 0 } = payload;
      let obj = {
        list: [],
        pagination:{
          total: 0,
          current:0
        }
      };
      if(response.resData){
        response.resData.map((item,index)=>{
          item.key = index + 1
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
        console.log("obj",obj)
      }
      yield put({
        type: 'save',
        payload: obj,
      });
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    }
  },
};

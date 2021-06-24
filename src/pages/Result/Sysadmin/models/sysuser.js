import { querySysuser, removeSysuser,findPageSysuser, addSysuser,evenSysuser, updateSysuser,findSysuser,assignSysuser,distSysuser } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'sysuser',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    list:{

    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySysuser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *find({ payload }, { call, put }) {
      const response = yield call(findSysuser, payload);
      console.log(response)
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total
        }
      };

      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *findPage({ payload }, { call, put }) {
      const response = yield call(findPageSysuser, payload);
      const obj = {
        list: response.resData,
      };
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const {req,pageIndex} = payload;
      const response = yield call(addSysuser, req);
      if (response) {
        message.success('成功');
      }else{
        message.error('失败');
      }
      yield put({
        type: 'find',
        payload:{
          id:1,
          pageIndex,
          pageSize: 10
        }
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const { id, pageIndex} = payload;
      const response = yield call(removeSysuser, id);
      if (response) {
        message.success('删除成功');
      }else{
        message.error('删除失败');
      }
      yield put({
        type: 'find',
        payload: {
          id:1,
          pageIndex,
          pageSize:10
        }
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateSysuser, payload);
      yield put({
        type: 'find',
        payload: {
          id:1
        }
      });
      if (callback) callback();
    },
    *assign({ payload,callback }, { call, put }) {
      const response = yield call(assignSysuser, payload);
      console.log("返回值",response)
      /*const obj ={
        list:response.resData
      };
      yield put({
        type: 'aaa',
        payload: obj,
      });*/

      if (callback) callback(response.resData);
    },

    *dist({ payload, callback }, { call, put }) {
      const {req,pageIndex} = payload
      const response = yield call(distSysuser, req);
      console.log("res",response)
      yield put({
        type: 'find',
        payload: {
          id:req.id,
          pageIndex,
          pageSize:10
        },
      });
      if (callback) callback();
    },
    *even({ payload, callback }, { call, put }) {
      const response = yield call(evenSysuser, payload);
      if (callback) callback(response.resData);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    aaa(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

import { queryRole,findRole,getRole,roleIdAntu,inputIndex, newdata,newregister,queryRoleForTable,Distribution,removenewdatamenu,findnewdata, removeRole, addRole, updateRole,fetchAntu } from '@/services/api';

import { message } from 'antd';

export default {
  namespace: 'role',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(findRole, payload);
      const { pageIndex = 0 } = payload;
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
      yield put({
        type: 'save',
        payload: obj,
      });
      if(callback) callback(response);
    },
    *find({ payload }, { call, put }) {
      const response = yield call(findRole, payload);
      const { pageIndex = 0 } = payload;
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
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *fetchfortable({ payload }, { call, put }) {

      const response = yield call(queryRoleForTable, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *newdata({ payload,callback }, { call, put }) {
      const response = yield call(newdata, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *findnewdata({ payload,callback }, { call, put }) {
      const response = yield call(findnewdata, payload);
      yield put({
        type: 'save',
        payload: response.resData[0],
      });
      if (callback) callback(response.resData[0]);
    },
    *register({ payload ,callback}, { call, put }) {
      const response = yield call(newregister, payload);
      if(callback) callback(response)
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRole, payload);
      if(callback) callback(response)
    },
    *index({ payload, callback }, { call, put }) {
      const response = yield call(inputIndex, payload);
      if(callback) callback(response)
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(getRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *removenewdatamenu({ payload, callback }, { call, put }) {
      const response = yield call(removenewdatamenu, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRole, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const {req,pageIndex} = payload
      const response = yield call(updateRole, req);
      yield put({
        type: 'find',
        payload:{
          pageIndex,
          pageSize:10
        }
      });
      if (callback) callback();
    },
    *fetchAntu({ payload,callback }, { call, put }) {
      const response = yield call(fetchAntu, payload);
      if (callback) callback(response);
    },
    *roleIdAntu({ payload,callback }, { call, put }) {
      const response = yield call(roleIdAntu, payload);

      if (callback) callback(response);
    },
    *distribution({ payload,callback }, { call, put }) {
      const response = yield call(Distribution, payload);

      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

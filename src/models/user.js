import {
  query as queryUsers,
  queryCurrent,
  fetchUserDashboard,
  fetchUserSchedule,
  fetchUserAfterInvestMsg,
  fetchUserTaskMsg,
  markRead,
  querymenuData,
  fetchmenuData,
  queryUserById,
  userFetchFind,
  queryUser,
  setPhone
} from '@/services/user';
import storage from '@/utils/storage';
import { sendMessage } from '@/services/RR';
import { findRole } from '@/services/api';

export default {
  namespace: 'user',

  state: {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    list: [],
    currentUser: storage.get('userinfo') || {},
    userDashboard: {},
    userSchedule: [],
    userAfterInvestMsg: {
      data: [],
      total: 0,
      unreadCount: 0,
    },
    userTaskMsg1: {
      data: [],
      total: 0,
      unreadCount: 0,
    },
    userTaskMsg2: {
      data: [],
      total: 0,
      unreadCount: 0,
    },
    userTaskMsg3: {
      data: [],
      total: 0,
      unreadCount: 0,
    },
    userTaskMsg4: {
      data: [],
      total: 0,
      unreadCount: 0,
    },
    userTaskMsg5: {
      data: [],
      total: 0,
      unreadCount: 0,
    },
    userTaskMsg6: {
      data: [],
      total: 0,
      unreadCount: 0,
    },
    userTaskMsg7: {
      data: [],
      total: 0,
      unreadCount: 0,
    },
    userTaskMsg8: {
      data: [],
      total: 0,
      unreadCount: 0,
    },
    userTaskMsg9: {
      data: [],
      total: 0,
      unreadCount: 0,
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchmenu({ payload,callback }, { call, put }) {
      const response = yield call(fetchmenuData,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if(callback) callback(response)
    },
    *menuData({ payload,callback }, { call, put }) {
      const response = yield call(querymenuData,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if(callback) callback(response)
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    // 获取用户面板数据
    *fetchUserDashboard(_, { call, put }) {
      const { resData } = yield call(fetchUserDashboard);
      yield put({
        type: 'setUserDashboard',
        payload: resData[0],
      });
    },
    // 获取用户日程
    *fetchUserSchedule({ payload,callback }, { call, put }) {
      const { resData } = yield call(fetchUserSchedule, payload);
      yield put({
        type: 'setUserSchedule',
        payload: resData,
      });
      if (callback) callback(resData);
    },
    // 获取任务信息列表
    *fetchUserTaskMsg({ payload }, { call, put }) {
      const response = yield call( fetchUserTaskMsg,payload );
      const { resData: data, total, userDefineInt1: unreadCount} = response;
      if(response.resData){
        response.resData.map((item)=>{
          if(item.ct){
            let str = item.ct.toString();
            let nian = str.substr (0,4);
            let yue = str.substr (4,2);
            let ri = str.substr (6,2);
            let shi = str.substr (8,2);
            let fen = str.substr (10,2);
            let miao = str.substr (12,2);
            item.datetime = `${nian}-${yue}-${ri} ${shi}:${fen}:${miao}`
          }
          item.title = `您有一个项目名称是:${item.content}的任务 ${item.title} `;
          return item
        })
      }
      const { reqData:{type} } = payload;
      switch (type) {
        case 1:
          yield put({
            type: 'setUserTaskMsg1',
            payload: { data, total, unreadCount },
          });
          break;
        case 2:
          yield put({
            type: 'setUserTaskMsg2',
            payload: { data, total, unreadCount },
          });
          break;
        case 3:
          yield put({
            type: 'setUserTaskMsg3',
            payload: { data, total, unreadCount },
          });
          break;
        case 4:
          yield put({
            type: 'setUserTaskMsg4',
            payload: { data, total, unreadCount },
          });
          break;
        case 5:
          yield put({
            type: 'setUserTaskMsg5',
            payload: { data, total, unreadCount },
          });
          break;
        case 6:
          yield put({
            type: 'setUserTaskMsg6',
            payload: { data, total, unreadCount },
          });
          break;
        case 7:
          yield put({
            type: 'setUserTaskMsg7',
            payload: { data, total, unreadCount },
          });
          break;
        case 8:
          yield put({
            type: 'setUserTaskMsg8',
            payload: { data, total, unreadCount },
          });
          break;
        case 9:
          yield put({
            type: 'setUserTaskMsg9',
            payload: { data, total, unreadCount },
          });
          break;
      }

    },
    // 获取投后信息列表
    *fetchUserAfterInvestMsg({ payload }, { call, put }) {
      const response = yield call(fetchUserAfterInvestMsg,payload );
      const { resData: data, userDefineInt1: unreadCount, total } = response;
      console.log("投后",response);
      yield put({
        type: 'setUserAfterInvestMsg',
        payload: { data, total, unreadCount },
      });
    },
    *markRead({ payload }, { call, put }) {
      const { type, index, id } = payload;

      if (type === 'task') {
        // 任务信息
        yield put({
          type: 'changeTaskMsgRead',
          payload: index,
        });
      } else if (type === 'afterInvest') {
        // 投后信息
        yield put({
          type: 'changeAfterInvestMsgRead',
          payload: index,
        });
      }

      yield call(markRead, { reqData: { id } });
    },

    *marked({ payload,callback}, { call, put }) {
      const { type, id } = payload;
      const response = yield call(markRead, { reqData: { id } });
      const a = {
        reqData: {
          type,
        },
        pageSize:100000,
        pageIndex:0,
      };
      yield put({
        type: 'fetchUserTaskMsg',
        payload: a,
      });
      if(callback) callback(response)
    },

    *userFetchFind({ payload,callback }, { call, put }) {
      const response = yield call(userFetchFind,payload);
      if(callback) callback(response)
    },

    *queryUser({ payload,callback }, { call, put }) {
      const response = yield call(queryUser, payload);
      if (callback) callback(response);
    },

    *queryUserById({ payload,callback }, { call, put }) {
      const response = yield call(queryUserById, payload);
      if (callback) callback(response);
    },

    *setPhone({ payload,callback }, { call, put }) {
      const response = yield call(setPhone, payload);
      if (callback) callback(response);
    },

    *queryRole({ payload,callback }, { call, put }) {
      const response = yield call(findRole, payload);
      if(callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    setUserDashboard(state, { payload: userDashboard }) {
      return {
        ...state,
        userDashboard,
      };
    },
    setUserSchedule(state, { payload: userSchedule }) {
      return { ...state, userSchedule };
    },
    setUserTaskMsg1(state, { payload: userTaskMsg1 }) {
      return { ...state, userTaskMsg1 };
    },
    setUserTaskMsg2(state, { payload: userTaskMsg2 }) {
      return { ...state, userTaskMsg2 };
    },
    setUserTaskMsg3(state, { payload: userTaskMsg3 }) {
      return { ...state, userTaskMsg3 };
    },
    setUserTaskMsg4(state, { payload: userTaskMsg4 }) {
      return { ...state, userTaskMsg4 };
    },
    setUserTaskMsg5(state, { payload: userTaskMsg5 }) {
      return { ...state, userTaskMsg5 };
    },
    setUserTaskMsg6(state, { payload: userTaskMsg6 }) {
      return { ...state, userTaskMsg6 };
    },
    setUserTaskMsg7(state, { payload: userTaskMsg7 }) {
      return { ...state, userTaskMsg7 };
    },
    setUserTaskMsg8(state, { payload: userTaskMsg8 }) {
      return { ...state, userTaskMsg8 };
    },
    setUserTaskMsg9(state, { payload: userTaskMsg9 }) {
      return { ...state, userTaskMsg9 };
    },
    setUserAfterInvestMsg(state, { payload: userAfterInvestMsg }) {
      return { ...state, userAfterInvestMsg };
    },
    changeTaskMsgRead(state, { payload: id }) {
      const userMsg = state.userTaskMsg.data;
      userMsg.map((item)=>{
        if(item.id === id){
          item.read = true
          item.state = 1
        }
      })
      const userTaskMsg = {
        data: [
          ...userMsg
       /*   ...state.userTaskMsg.data.slice(0, index),
          { ...state.userTaskMsg.data[index], state: 1 },
          ...state.userTaskMsg.data.slice(index + 1),*/

        ],
        unreadCount: state.userTaskMsg.unreadCount - 1,
        total: state.userTaskMsg.total,

      };

      return { ...state, userTaskMsg };
    },
    changeAfterInvestMsgRead(state, { payload: index }) {
      const userAfterInvestMsg = {
        data: [
          ...state.userAfterInvestMsg.data.slice(0, index),
          { ...state.userAfterInvestMsg.data[index], state: 1 },
          ...state.userAfterInvestMsg.data.slice(index + 1),
        ],
        unreadCount: state.userAfterInvestMsg.unreadCount - 1,
        total: state.userAfterInvestMsg.total,
      };
      return { ...state, userAfterInvestMsg };
    },
  },
};

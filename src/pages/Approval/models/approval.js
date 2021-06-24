import { submitApproval, fileUpload,fetchApprovalDetail,
  subresult,fetchLeaveDetail,fetchSdetail,refuseed,fetchMessage,addUserRole,fetchAdvice } from '@/services/approval';
import { fetchAllUser } from '@/services/user';
import { fetchProcessId } from '@/services/review';


export default {
  namespace: 'approval',

  state: {
    approvalPerson: [],
  },

  effects: {
    *fetchApprovalPerson(_, { call, put }) {
      const { resData } = yield call(fetchAllUser, {});
      if (!resData) return;

      yield put({
        type: 'setApprovalPerson',
        payload: resData,
      });
    },
    *submitApproval({ payload }, { call, put }) {
      const res = yield call(submitApproval, payload);
    },
    *fetchMessage({ payload,callback }, { call, put }) {
      const res = yield call(fetchMessage, payload);
      if (callback) callback(res);
    },
    *fetchAdvice({ payload,callback }, { call, put }) {
      const res = yield call(fetchAdvice, payload);
      if (callback) callback(res);
    },
    *fetchProcessId({ payload,callback }, { call, put }) {
      const response = yield call(fetchProcessId, payload);
      if (callback) callback(response);
    },
    *fetchSdetail({ payload,callback }, { call, put }) {
      const res = yield call(fetchSdetail, payload);
      console.log("查询结果",res)
      if (callback) callback(res);
    },
    *fetchdetail({ payload ,callback}, { call, put }) {
      const res = yield call(fetchApprovalDetail, payload);
      console.log('====models',res)
      if (callback) callback(res);
    },
    *fetchleavedetail({ payload ,callback}, { call, put }) {
      const res = yield call(fetchLeaveDetail, payload);
      if (callback) callback(res);
    },
    *result({ payload ,callback}, { call, put }) {
      const res = yield call(subresult, payload);
      console.log('---已同意',res)
      if (callback) callback(res);
    },
    *refuse({ payload ,callback}, { call, put }) {
      const res = yield call(refuseed, payload);
      if (callback) callback(res);
    },
    *addUserRole({ payload ,callback}, { call, put }) {
      const res = yield call(addUserRole, payload);
      if (callback) callback(res);
    },
  },

  reducers: {
    setApprovalPerson(state, { payload }) {
      return {
        ...state,
        approvalPerson: payload,
      };
    },
  },
};

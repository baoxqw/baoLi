import {fetchAntu } from '@/services/api';

export default {
  namespace: 'findRoles',

  state: {

  },

  effects: {
    *fetchAntu({ payload,callback }, { call,put }) {
      const response = yield call(fetchAntu, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

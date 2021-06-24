import { updatePassword } from '@/services/api';

export default {
  namespace: 'upuser',

  state: {
    data: {},
  },

  effects: {
    *update({ payload,callback }, { call, put }) {
      const response = yield call(updatePassword,payload);
      if(callback) callback(response)
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

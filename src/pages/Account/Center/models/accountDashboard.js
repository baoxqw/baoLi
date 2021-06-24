import { fetchAccountDashboard } from '@/services/analysis';

export default {
  namespace: 'accountDashboard',

  state: {
    dashboardData: null,
  },

  effects: {
    *fetchAccountDashboard(_, { call, put }) {
      const data = yield call(fetchAccountDashboard);

      yield put({
        type: 'setAccountDashboard',
        payload: data,
      });
    },
  },

  reducers: {
    setAccountDashboard(state, { payload: dashboardData }) {
      return {
        ...state,
        dashboardData,
      };
    },
  },
};

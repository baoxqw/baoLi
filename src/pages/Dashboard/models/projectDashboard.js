import {
  fetchProjectDashboard ,
  fetchUserDashboard,
  fetchUserScheduled
} from '@/services/analysis';

export default {
  namespace: 'projectDashboard',

  state: {
    dashboardData: {
      fundnet: 0,
      userSchedule:[],
      projectCount: 0,
      invest: {
        count: 0,
        investInStatistics: [],
        investOutStatistics: [],
      },
      roi: {
        week: 0,
        day: 0,
        average: 0,
        statistics: [],
      },
    },
  },

  effects: {
    // 获取用户面板数据
    *fetchUserDashboard(_, { call, put }) {
      const { resData } = yield call(fetchUserDashboard);

      yield put({
        type: 'setUserDashboard',
        payload: resData[0],
      });
    },
    // 获取用户日程
    *fetchUserScheduled({ payload,callback }, { call, put }) {
      const { resData } = yield call(fetchUserScheduled, payload);
      yield put({
        type: 'setUserSchedule',
        payload: resData,
      });
      console.log('用户日程',resData)
      if (callback) callback(resData);
    },
    *fetchProjectDashboard(_, { call, put, select }) {
      const { fundnet, invest, projectCount, roi } = yield call(fetchProjectDashboard);

      const dashboardData = yield select(({ projectDashboard }) => projectDashboard.dashboardData);
      console.log('获取日程：',dashboardData)
      let result = dashboardData;
      if (fundnet) {
        result = { ...result, fundnet };
      }
      if (invest) {
        result = { ...result, invest };
      }
      if (projectCount) {
        result = { ...result, projectCount };
      }
      if (roi) {
        result = { ...result, roi };
      }

      yield put({
        type: 'setProjectDashboard',
        payload: result,
      });
    },
  },

  reducers: {
    setProjectDashboard(state, { payload: dashboardData }) {
      return {
        ...state,
        dashboardData,
      };
    },
    setUserSchedule(state, { payload: userSchedule }) {
      return { ...state, userSchedule };
    },
    setUserDashboard(state, { payload: userDashboard }) {
      return {
        ...state,
        userDashboard,
      };
    },
  },
};

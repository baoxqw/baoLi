import { queryFund, queryProject, queryLP, queryPM } from '@/services/fund';

export default {
  namespace: 'fund',

  state: {
    fundList: [],
    projectList: null,
    LPList: null,
    PMList: [],
  },

  effects: {
    // 获取基金列表
    *fetchFundList({ payload = { pageSize: 1000 } }, { call, put, select }) {
      const { corpId: id } = yield select(({ user }) => user.currentUser);
      if (!id) throw Error(`corpId为${id}`);
      // if (!id) return;
      const { resData } = yield call(queryFund, { ...payload, id });

      yield put({
        type: 'setFundList',
        payload: resData,
      });
    },
    //
    *queryPM({ payload }, { call, put }) {
      const { resData } = yield call(queryPM, payload);
      yield put({
        type: 'setPMList',
        payload: resData,
      });
    },
    *queryProject(_, { call, put }) {
      const data = yield call(queryProject);

      yield put({
        type: 'setProjectList',
        payload: data,
      });
    },
    *queryLp(_, { call, put }) {
      const data = yield call(queryLP);

      yield put({
        type: 'setLPList',
        payload: data,
      });
    },
  },

  reducers: {
    setProjectList(state, { payload: projectList }) {
      return { ...state, projectList };
    },
    setLPList(state, { payload: LPList }) {
      return { ...state, LPList };
    },
    // 设置基金列表
    setFundList(data, { payload: fundList }) {
      return { ...data, fundList };
    },
    setPMList(data, { payload: PMList }) {
      return { ...data, PMList };
    },
  },
};

import {
  queryPostManagement,
  queryPostManagementDetail,
  queryPostManagementDetailCorpInfo,
  queryPostManagementDetailInvestmentInfo,
  queryPostManagementDetailFinancialInfo,
  queryPostManagementDetailSeasonInfo,
  queryPostManagementDetailShareholderInfo,
  queryPostManagementDetailAuditreportInfo,
  queryPostManagementDetailQuitInfo,
  queryPostManagementDetailProcessInfo,
} from '@/services/api';

export default {
  namespace: 'PostManagement',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    // 单个信息详情
    currentDetail: {},
    // 公司信息
    corpInfo: [],
    // 投资信息
    investmentInfo: { list: [] },
    // 财务信息
    financialInfo: {},
    // 季度报告
    seasonInfo: {},
    // 股东信息
    shareholderInfo: {},
    // 审计报告
    auditreportInfo: {},
    // 退出情况
    quitInfo: {},
    // 过程查看
    processInfo: {},
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryPostManagement, payload);
      console.log("--res--",response)
      yield put({
        type: 'queryPostManagementOk',
        payload: {
          list: response.resData,
          pagination: { total: response.total }
        },
      });
      if(callback) callback(response)
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryPostManagementDetail, payload.id);
      yield put({
        type: 'queryPostManagementDetailOk',
        payload: {
          currentDetail: response.resData[0]
        },
      });
    },
    *fetchDetailCorpInfo({ payload }, { call, put }) {
      const response = yield call(queryPostManagementDetailCorpInfo, payload.id);
      yield put({
        type: 'queryPostManagementDetailCorpInfoOk',
        payload: response,
      });
    },
    *fetchDetailInvestmentInfo({ payload }, { call, put }) {
      const response = yield call(queryPostManagementDetailInvestmentInfo, payload.id);
      yield put({
        type: 'queryPostManagementDetailInvestmentInfoOk',
        payload: response,
      });
    },
    *fetchDetailFinancialInfo({ payload }, { call, put }) {
      const response = yield call(queryPostManagementDetailFinancialInfo, payload.id);
      yield put({
        type: 'queryPostManagementDetailFinancialInfoOk',
        payload: response,
      });
    },
    *fetchDetailSeasonInfo({ payload }, { call, put }) {
      const response = yield call(queryPostManagementDetailSeasonInfo, payload.id);
      yield put({
        type: 'queryPostManagementDetailSeasonInfoOk',
        payload: response,
      });
    },
    *fetchDetailShareholderInfo({ payload }, { call, put }) {
      const response = yield call(queryPostManagementDetailShareholderInfo, payload.id);
      yield put({
        type: 'queryPostManagementDetailShareholderInfoOk',
        payload: response,
      });
    },
    *fetchDetailAuditreportInfo({ payload }, { call, put }) {
      const response = yield call(queryPostManagementDetailAuditreportInfo, payload.id);
      yield put({
        type: 'queryPostManagementDetailAuditreportInfoOk',
        payload: response,
      });
    },
    *fetchDetailQuitInfo({ payload }, { call, put }) {
      const response = yield call(queryPostManagementDetailQuitInfo, payload.id);
      yield put({
        type: 'queryPostManagementDetailQuitInfoOk',
        payload: response,
      });
    },
    *fetchDetailProcessInfo({ payload }, { call, put }) {
      const response = yield call(queryPostManagementDetailProcessInfo, payload.id);
      yield put({
        type: 'queryPostManagementDetailProcessInfoOk',
        payload: response,
      });
    },
  },

  reducers: {
    queryPostManagementOk(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    queryPostManagementDetailOk(state, action) {
      return {
        ...state,
        currentDetail: action.payload,
      };
    },

    queryPostManagementDetailCorpInfoOk(state, action) {
      return {
        ...state,
        corpInfo: action.payload,
      };
    },

    queryPostManagementDetailInvestmentInfoOk(state, action) {
      return {
        ...state,
        investmentInfo: action.payload,
      };
    },

    queryPostManagementDetailFinancialInfoOk(state, action) {
      return {
        ...state,
        financialInfo: action.payload,
      };
    },

    queryPostManagementDetailSeasonInfoOk(state, action) {
      return {
        ...state,
        seasonInfo: action.payload,
      };
    },
    queryPostManagementDetailShareholderInfoOk(state, action) {
      return {
        ...state,
        shareholderInfo: action.payload,
      };
    },
    queryPostManagementDetailAuditreportInfoOk(state, action) {
      return {
        ...state,
        auditreportInfo: action.payload,
      };
    },
    queryPostManagementDetailQuitInfoOk(state, action) {
      return {
        ...state,
        quitInfo: action.payload,
      };
    },
    queryPostManagementDetailProcessInfoOk(state, action) {
      return {
        ...state,
        processInfo: action.payload,
      };
    },
  },
};

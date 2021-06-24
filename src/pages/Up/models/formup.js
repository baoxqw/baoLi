import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';
import router from 'umi/router';
export default {
  namespace: 'formup',

  state: {
    uploading: false,
    fileList: [],
    message:{
      msg:{}
    }
  },

  effects: {
    *submitRegularForm({ payload ,callback}, { call, put }) {
      //  //发出Action 更新state
      //  yield put({
      //   type: 'aa',
      //   payload,
      // });
      const res = yield call(fakeSubmitForm, payload);
      if (res) {
        message.success('创建成功',1.5,()=>{

        });
      }else{
        message.error('创建失败');
      }
      //发出Action 更新state

      if (callback) callback();
    },
  },

  reducers: {
    beforeupload(state, { payload }) {
      state.fileList= [...state.fileList, payload];
      // state.uploading = true;
      return {
        ...state,
        // aa:payload,
      };
    },
    aa(state, { payload }) {
      state.uploading = true;
      return {
        ...state,
      };
    },
    save(state, { payload }) {
      state.uploading = false;
      state.fileList = [];
      return {
        ...state,
      };
    },
    newsave(state, { payload }) {
      return {
        ...state,
        message: payload
      };
    }
  },
};

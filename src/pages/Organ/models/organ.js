import {
  fetchUser,
  addUser,
  deleteUser,
  updatePassWord,
  updateIsAdmin,
  updateAuthority
} from '@/services/organ';



export default {
  namespace: 'organ',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchUser, payload);
      console.log("response",response)
      let { pageIndex = 0 } = payload;
      let obj = [];
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id;
          if(item.isAdmin === 1){
            item.authority2 = "全部权限"
          }else if(item.authority){
            const a = item.authority.split(",");
            const b = [];
            a.map(item =>{
              switch (item) {
                case 'creditQuery':
                  b.push("授信查看");
                  break;
                case 'loanQuery':
                  b.push("支用查看");
                  break;
                case 'creditAudit':
                  b.push("授信审核");
                  break;
                case 'loanAudit':
                  b.push("支用审核");
                  break;
                case 'dataSync':
                  b.push("文件同步");
                  break;
              }
            });
            item.authority2 = b.join(',');
          }
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
    *addUser({ payload,callback }, { call, put }) {
      const response = yield call(addUser, payload);
      if (callback) callback(response);
    },
    *deleteUser({ payload,callback }, { call, put }) {
      const response = yield call(deleteUser, payload);
      if (callback) callback(response);
    },
    *updatePassWord({ payload,callback }, { call, put }) {
      const response = yield call(updatePassWord, payload);
      if (callback) callback(response);
    },
    *updateIsAdmin({ payload,callback }, { call, put }) {
      const response = yield call(updateIsAdmin, payload);
      if (callback) callback(response);
    },
    *updateAuthority({ payload,callback }, { call, put }) {
      const response = yield call(updateAuthority, payload);
      if (callback) callback(response);
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    }
  },
};

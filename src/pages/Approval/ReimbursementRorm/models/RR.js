import {
  addRR,
  fetchRR,
  updateBM,
  deleteRR,
  fetchClientTree,
  findClientTable,
  fetchDept,
  uploadDelete,
  findPerson,
  findId,
  childadd,
  deleteChild,
  fetchProject,
  fetchCostsubj,
  checkRR,
  refuseRR,
  uploadFileList,
  returnRR,
  uploadFile,
  submitRR,
  fetchProjectType,
  fetchProjectTypeFind,queryRole,queryNameRole,sendMessage
} from '@/services/RR';
import {  queryPersonal } from '@/services/api';
import { fetchChildModle, fetchModle } from '@/services/papproval';

export default {
  namespace: 'RR',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
    childTable: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchRR, payload);
      const { pageIndex } = payload;
      console.log("查询",response)
      let obj = {};
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id;
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
    *fetchFetch({ payload,callback }, { call, put }) {
      const { selectedRowKeys,page,Mconditions,type } = payload;
      const conditions = [{
        code:'PROJECT_ID',
        exp:'=',
        value:selectedRowKeys
      }];
      let response = yield call(fetchRR, {conditions});
      let idList = [];
      if(response.resData && response.resData.length){
        response.resData.map(item =>{
          if(item.finishphase){
            let arrStr = item.finishphase.split(",");
            idList = idList.concat(arrStr);
            idList = [...new Set(idList)];
          }
        })
      }

      const con = [{
        code: 'PROJECT_ID',
        exp: '=',
        value: selectedRowKeys
      },{
        code: 'TYPE',
        exp: '=',
        value: "项目"
      }];
      let response2 = yield call(fetchProjectTypeFind, {
        conditions:con.concat(Mconditions),
        ...page
      });

      let obj = {}
      if(response2.resData && response2.resData.length && idList.length){
        obj = {
          list: response2.resData,
          pagination:{
            total: response2.total,
            current:page.pageIndex + 1
          }
        };
        idList = idList.map(item=>{
          return Number(item)
        });
        if(type === "新增"){
          obj.list = obj.list.filter(item =>{
            return idList.indexOf(item.id) === -1
          });
        }
        if(type === "编辑"){
          const { selectedRowManyKeys } = payload;
          console.log("selectedRowManyKeys",selectedRowManyKeys)
          obj.list = obj.list.filter(item =>{
            return (idList.indexOf(item.id) === -1 ) || (selectedRowManyKeys.indexOf(item.id) !== -1)
          });
        }
        obj.pagination.total = obj.list.length
      }

      if(callback) callback(obj)
    },
    *fetchPerson({ payload,callback }, { call, put }) {
      const response = yield call(queryPersonal, payload);

      const { pageIndex } = payload;
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total,
          current:pageIndex + 1
        }
      };
      if (callback) callback(obj);
    },
    *fetchProjectType({ payload,callback }, { call, put }) {
      const response = yield call(fetchProjectType, payload);

      const { pageIndex } = payload;
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total,
          current:pageIndex + 1
        }
      };
      if (callback) callback(obj);
    },
    *fetchProjectTypeFind({ payload,callback }, { call, put }) {
      const response = yield call(fetchProjectTypeFind, payload);
      console.log("response",response)
      const { pageIndex } = payload;
      let obj = {};
      if(response.resData && response.resData.length){
        response.resData.map(item=>{
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },
    *fetchModle({ payload,callback }, { call, put }) {
      const response = yield call(fetchModle, payload);
      let obj = [];
      if(response.resData){
        obj = {
          list:response.resData
        }
      }
      if(callback) callback(obj)
    },
    *fetchChildModle({ payload,callback }, { call, put }) {
      const response = yield call(fetchChildModle, payload);
      let obj = [];
      if(response.resData){
        obj = {
          list:response.resData
        }
      }
      if(callback) callback(obj)
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addRR, payload);
      console.log("response",response)
      if (callback) callback(response);
    },
    *uploadDelete({ payload,callback }, { call, put }) {
      const response = yield call(uploadDelete, payload);
      console.log("response删除",response)
      if (callback) callback(response);
    },
    *update({ payload,callback }, { call, put }) {
      const response = yield call(updateBM, payload);
      if (callback) callback(response);
    },
    *uploadFileList({ payload,callback }, { call, put }) {
      const response = yield call(uploadFileList, payload);
      const { pageIndex } = payload;
      console.log('列表',response)
      let obj = {};
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id;
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
        type: 'saveupload',
        payload: obj,
      });
      /*if(response){
        let obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
        yield put({
          type: 'saveupload',
          payload: obj,
        });
      }*/
      if (callback) callback(response);
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deleteRR, payload);
      if (callback) callback(response);
    },
    *uploadFile({ payload,callback }, { call, put }) {
      const response = yield call(uploadFile, payload);
      if (callback) callback(response);
    },
    *findId({ payload,callback }, { call, put }) {
      const response = yield call(findId, payload);

      const { pageIndex } = payload;
      let obj = [];
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },
    *fetchClientTree({ payload,callback }, { call, put }) {
      const response = yield call(fetchClientTree, payload);
      console.log("树",response)
      if (callback) callback(response.resData);
    },
    *findClientTable({ payload,callback }, { call, put }) {
      const response = yield call(findClientTable, payload);
      console.log("res",response)
      let obj = {};
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      if (callback) callback(obj);
    },
    *fetchDept({ payload,callback }, { call, put }) {
      const response = yield call(fetchDept, payload);
      if(callback) callback(response.resData)
    },
    *findPerson({ payload,callback }, { call, put }) {
      const response = yield call(findPerson, payload);
      console.log("res",response)
      let obj = {};
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      if (callback) callback(obj);
    },
    *childadd({ payload,callback }, { call, put }) {
      const response = yield call(childadd, payload);
      console.log("res",response);
      if (callback) callback(response);
    },
    *fetchCostsubj({ payload,callback }, { call, put }) {
      const response = yield call(fetchCostsubj, payload);
      console.log("res",response);
      if (callback) callback(response.resData);
    },
    *deleteChild({ payload,callback }, { call, put }) {
      const response = yield call(deleteChild, payload);
      console.log("res",response);
      if (callback) callback(response);
    },
    *fetchProject({ payload,callback }, { call, put }) {
      const response = yield call(fetchProject, payload);
      const { pageIndex } = payload;
      let obj = [];
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id;
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },
    *check({ payload,callback }, { call, put }) {
      const response = yield call(checkRR, payload);
      if (callback) callback(response);
    },
    *refuse({ payload,callback }, { call, put }) {
      const response = yield call(refuseRR, payload);
      if (callback) callback(response);
    },
    *return({ payload,callback }, { call, put }) {
      const response = yield call(returnRR, payload);
      if (callback) callback(response);
    },
    *submit({ payload,callback }, { call, put }) {
      const response = yield call(submitRR, payload);
      if (callback) callback(response);
    },
    *queryRole({ payload,callback }, { call, put }) {
      const response = yield call(queryRole, payload);
      if (callback) callback(response);
    },
    *queryNameRole({ payload,callback }, { call, put }) {
      const response = yield call(queryNameRole, payload);
      if (callback) callback(response);
    },
    *sendMessage({ payload,callback }, { call, put }) {
      const response = yield call(sendMessage, payload);
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
    },
    saveupload(state, action) {
      return {
        ...state,
        uploadData: action.payload,
      };
    },
    find(state, action) {
      return {
        ...state,
        childTable: action.payload,
      };
    }
  },
};

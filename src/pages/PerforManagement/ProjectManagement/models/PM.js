//股东信息
import {
  fetchList,
  fetchChild,
} from '@/services/perf';
import { fetchProject } from '@/services/PMA';
import { fetchChild2,fetchChild3 } from '@/services/PM';

export default {
  namespace: 'PM',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      let obj = {
        list:[],
        pagination:{}
      }
      const { pageIndex } = payload;
      if(response.resData){
        //计算项目余额
        let arr = [];
        let arr2 = [];
        let arr3 = [];
        for(let i=0;i<response.resData.length;i++){
          let conditions = [{
            code:'PROJECT_ID',
            exp:'=',
            value:response.resData[i].id?response.resData[i].id:''
          },
            {
              code:'STATUS',
              exp:'=',
              value:'审批通过'
            }
          ];
          const childresponse = yield call(fetchChild, {conditions});
          if(childresponse.resData){
            arr = arr.concat(childresponse.resData);
          }
          const childresponse2 = yield call(fetchChild2, {conditions});
          if(childresponse2.resData){
            arr2 = arr2.concat(childresponse2.resData);
          }
          const childresponse3 = yield call(fetchChild3, {
            reqData:{
              projectId:response.resData[i].id?response.resData[i].id:''
            }
          });
          console.log("childresponse3",childresponse3)
          if(childresponse3.resData){
            arr3 = arr3.concat(childresponse3.resData);
          }
        }
        response.resData = response.resData.map((item)=>{
          let arrCount = [];
          let arrCount2 = [];
          arr.forEach((value)=>{
            if(item.id === value.projectId){
              arrCount.push(value)
            }
          });

          arr2.forEach((value)=>{
            if(item.id === value.projectId){
              arrCount2.push(value)
            }
          });

          let ld = null; // 项目结余
          let ndef1 = item.ndef1;
          if(ndef1){
            if(arrCount.length > ndef1){
              let count = 0;
              for(let i = ndef1;i<arrCount.length;i++){
                count = count + arrCount[i].travelfee;
              }
              item.leftfeeend = item.projectmoney - count - item.totalsubsidy;
              item.le = item.projectmoney - count - item.totalsubsidy;
              ld = item.projectmoney - count - item.totalsubsidy;
            }else{
              item.leftfeeend = item.projectmoney  - item.totalsubsidy;
              item.le = item.projectmoney  - item.totalsubsidy;
              ld = item.projectmoney - item.totalsubsidy;
            }
          }
          let totaltravelfee = item.totaltravelfee; //交通费
          let totalsubsidy = item.totalsubsidy; //补贴
          let ticheng = 0;

          arrCount = arrCount.map(it =>{
            if(item.id === it.projectId){
              ticheng += ld * it.sumratio
            }
            return it
          });

          let totalCost = 0; //绩效总费用

          if(ticheng>0){
            totalCost = totaltravelfee + totalsubsidy + ticheng
          }else{
            totalCost = totaltravelfee + totalsubsidy + 0
          }

          item.totalCost = totalCost;

          let travelCount = 0; //差旅总费用

          arrCount2.forEach(it =>{
            if(item.id === it.projectId){
              travelCount += it.claimingamount
            }
          });

          item.travelCount = travelCount;

          item.key = item.id;

          let totalPrice = 0;

          arr3.map(ie =>{
            if(ie){
              if(ie.projectId === item.id){
                item.totalPrice = ie.totalPrice;
                totalPrice = ie.totalPrice;
              }
            }
          });

          item.count = totalCost + travelCount + totalPrice; //项目总费用

          return item
        });
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
        payload: obj
      });
      if (callback) callback(obj);
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
    *fetchChild({ payload,callback }, { call, put }) {
      const response = yield call(fetchChild, payload);
      console.log("绩效",response)
      if (callback) callback(response);
    },
    *fetchChild2({ payload,callback }, { call, put }) {
      const response = yield call(fetchChild2, payload);
      console.log("差旅",response)
      if (callback) callback(response);
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

  },
};

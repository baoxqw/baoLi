import {
  addcre,
  fetchBL,
  reject,
  findList,
  lookTable,
  queryId,
  fetchUcum,
  findLeagl,
  queryCreditRes
} from '@/services/Cre';


export default {
  namespace: 'Cre',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchBL, payload);
      let { pageIndex = 0 } = payload;
      let obj = [];
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id
          if(item.companyLicenseType === 'UNITY'){
            item.companyLicenseType = '企业的统一社会信用代码'
          }
          if(item.companyLicenseType === 'GENERAL'){
            item.companyLicenseType = '传统工商注册类型'
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
    *findLeagl({ payload,callback }, { call, put }) {
      const response = yield call(findLeagl, payload);
      let { pageIndex = 0 } = payload;
      let obj = {};
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id
          if(item.companyLicenseType === 'UNITY'){
            item.companyLicenseType = '企业的统一社会信用代码'
          }
          if(item.companyLicenseType === 'GENERAL'){
            item.companyLicenseType = '传统工商注册类型'
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
      if(callback) callback(obj)
    },
    *queryListRes({ payload,callback }, { call, put }) {
      const { arr } = payload;
      let Array = [];
      for(let i = 0;i<arr.length;i++){
        const response = yield call(queryCreditRes, {conditions:[{
            code:'credit_id',
            exp:"=",
            value:arr[i].id
          }]});
        console.log("response",response)
        if(response.resData.length){
          for(let i = 0;i<response.resData.length;i++){
            const resBody = response.resData[i].resBody;
            console.log('resBody',response.resData[i].resBody)
            if(resBody){
              const resBodyObj = JSON.parse(resBody);
              if('alibaba_finance_creditresult_notify_response' in resBodyObj){
                console.log("进来")
                const extendInfo = response.resData[i].extendInfo;
                if(extendInfo){
                  const extendInfoObj = JSON.parse(extendInfo);
                  const { loanLimitQuota } = extendInfoObj;
                  response.resData[i].loanLimitQuota2 = loanLimitQuota;
                }

                delete response.resData[i].status;
                delete response.resData[i].createTime;
                delete response.resData[i].userName;
                delete response.resData[i].userDate;
                delete response.resData[i].creditApplyNo;
                delete response.resData[i].customerId;
                Array.push(response.resData[i]);
              }
            }
          }
        }
      }
      const resArr = arr.map(item =>{
        Array.map(it =>{
          if(item.id === it.creditId){
            delete it.id;
            item = {
              ...item,
              ...it
            }
          }
        })
        return item;
      })
      resArr.map((item,index)=>{
        if(index === 0){
          console.log("item",item)
          if(!item.institutionCreditNo){
            item.institutionCreditNo = ""
          }
          if(!item.eventTime){
            item.eventTime = ""
          }
          if(!item.channel){
            item.channel = ""
          }
          if(!item.quotaAmount){
            item.quotaAmount = ""
          }
          if(!item.creditTerm){
            item.creditTerm = ""
          }
          if(!item.creditTermUnit){
            item.creditTermUnit = ""
          }
          if(!item.startDate){
            item.startDate = ""
          }
          if(!item.endDate){
            item.endDate = ""
          }
          if(!item.loanLimitQuota2){
            item.loanLimitQuota2 = " "
          }
          if(!item.failReasonCode){
            item.failReasonCode = ""
          }
          if(!item.failReasonMessage){
            item.failReasonMessage = ""
          }
          if(!item.amountRatio){
            item.amountRatio = ""
          }
          if(!item.resBody){
            item.resBody = ""
          }
        }
      })
      if(callback) callback(resArr)
    },
    *queryId({ payload,callback }, { call, put }) {
      const response = yield call(queryId, payload);
      if(callback) callback(response)
    },
    *lookTable({ payload,callback }, { call, put }) {
      const response = yield call(lookTable, payload);
      let { pageIndex = 0 } = payload;
      let obj = [];
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id
          if(!item.extendInfo){
            item.extendInfo = ""
          }
          let obj = JSON.parse(item.extendInfo);
          item.customerId = obj.customerId?obj.customerId:null
          item.loanLimitQuota = obj.loanLimitQuota?obj.loanLimitQuota:null
          item.quotaChangeReason = obj.quotaChangeReason?obj.quotaChangeReason:null
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
    *addcre({ payload,callback }, { call, put }) {
      const response = yield call(addcre, payload);
      if (callback) callback(response);
    },
    *fetchUcum({ payload,callback }, { call, put }) {
      const response = yield call(fetchUcum, payload);
      let obj = {};
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
            total: response.total
          }
        };
      }
      if(callback) callback(obj)
    },
    *reject({ payload,callback }, { call, put }) {
      const response = yield call(reject, payload);
      if (callback) callback(response);
    },
    *findList({ payload,callback }, { call, put }) {
      const response = yield call(findList, payload);
      let obj = {}
      if(response.resData){
        let env = '';
        switch (process.env.API_ENV) {
          case 'test': //测试环境
            env = 'http://49.234.209.104:8080';
            break;
          case 'dev': //开发环境
            env = 'http://192.168.2.166:8080';
            break;
          case 'produce': //生产环境
            env = 'https://www.leapingtech.com/nienboot-0.0.1-SNAPSHOT';
            break;
        }
        response.resData.key = response.resData.id
        response.resData.uid = response.resData.id
        response.resData.url = env+response.resData.path;
        response.resData.thumbUrl = env+response.resData.path;

       /* response.resData.map(item =>{
          item.key = item.id;
          item.uid = item.id;
          //https://www.leapingtech.net/nien-0.0.1-SNAPSHOT
          item.url = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT'+item.path+'/'+item.name;
          item.thumbUrl = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT'+item.path+'/'+item.name;
          return item
        });*/
        obj = response.resData
      }
      if (callback) callback(obj);
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

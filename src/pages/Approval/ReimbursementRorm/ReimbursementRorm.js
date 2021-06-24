import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Popover,
  Form,
  Input,
  DatePicker,
  Divider ,
  Button,
  Card,
  Checkbox,
  Icon,
  Upload,
  Tabs,
  Table,
  Modal,
  Select,
  message,
  Popconfirm,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RAdd from './ReimbursementRormAdd';
import RUpdate from './ReimbursementRormUpdate';
import ChildAdd from './ReimbursementRormChildAdd'
import ChildUpdate from './ReimbursementRormChildUpdate'
import styles from '../../System/UserAdmin.less';
import './tableBg.less'
import storage from '@/utils/storage';
import api from '@/pages/tool/api/api';
import { roleListName,setEngineering } from '@/pages/tool/dept/dept';
import ExportJsonExcel from 'js-export-excel';
import RoleUser from '@/pages/tool/RoleUser';
const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@connect(({ RR, loading }) => ({
  RR,
  loading: loading.models.RR,
  uploadLoading:loading.effects['RR/uploadFile'],
  uploadListLoading:loading.effects['RR/uploadFileList'],
  loadingSubmit:loading.effects['RR/submit'],
}))
@Form.create()
class ReimbursementRorm extends PureComponent {
  state = {
    expandForm:false,
    updateBillCode:'',
    fileList: [],
    billcode:null,
    uploading: false,
    childTable:{},
    superId:null, //主表id
    childId:null,
    childVisible: false,
    childUpdateVisible:false,
    childRecord:{},

    pageIndexUpload:0,
    agreeStatus:false,
    refuseStatus:false,
    returnStatus:false,

    rVisible:false,
    uVisible:false,
    uData:{},
    rowId:null,
    id:null,
    name:'',

    modalUpLoad:false,

    conditions:[],
    findStatus:'',

    NextRole:"",

    SubmitStatus:true,

    select:false,

    storage:[],

    page:{
      pageIndex:0,
      pageSize:10
    },

    userId:null,

    selectUser:false,

    resColumns:[
      {
        title: '单据号',
        dataIndex: 'billcode',
      },
      {
        title: '所属项目',
        dataIndex: 'projectname',
      },
      {
        title: '报销人',
        dataIndex: 'psnname',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '单据日期',
        dataIndex: 'billdate',
      },
      {
        title: '部门',
        dataIndex: 'deptname',
      },
      {
        title: '交通费',
        dataIndex: 'travelfee',
      },
      {
        title: '税率',
        dataIndex: 'taxrate',
      },
      {
        title: '税额',
        dataIndex: 'tax',
      },
      {
        title: '补贴',
        dataIndex: 'subsidy',
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: '',
        dataIndex: 'caozuo',
      },
    ]
  };

  componentDidMount(){

    const { dispatch } = this.props;
    if(this.props.location.state && this.props.location.state.id){
      const { id } = this.props.location.state;
      this.onRecord(id)
    }else{
      dispatch({
        type:'RR/fetch',
        payload:{
          pageIndex:0,
          pageSize:10,
        }
      })
    }

    const userinfo = storage.get("userinfo");

    if(userinfo.psndoc){
      if(userinfo.psndoc.id){
        this.setState({
          userId:userinfo.psndoc.id
        })
      }
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.location.state && nextProps.location.state.id){
      if(this.props.location.state !== nextProps.location.state){
        const { id } = nextProps.location.state;
        this.onRecord(id)
      }
    }
  };

  onRecord = (id)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'RR/fetch',
      payload:{
        conditions:[{
          code:'id',
          exp:'=',
          value:id
        }]
      }
    })
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const { dispatch} = this.props;
    const formData = new FormData();
    this.setState({
      uploading: true,
    });
    fileList.forEach(file => {
      formData.append('files[]', file);
      formData.append('bill_id', this.state.superId);
      formData.append('parentpath', 'wfclaimform');
    });
    dispatch({
      type:'RR/uploadFile',
      payload:formData,
      callback:(res)=>{

        message.success('上传成功',1,()=>{
          this.setState({
            fileList:[],
            uploading: false,
          });
        })
        dispatch({
          type:'RR/uploadFileList',
          payload:{
            pageIndex:0,
            pageSize:10,
            reqData:{
              id:this.state.superId,
              type:'wfclaimform'
            }
          },
          callback:(res)=>{
          }
        })
      }

    })

  }

  sureUpload =()=>{

    const { dispatch} = this.props;
    const arrayList = this.state.fileList
    const formData = new FormData();
    if(arrayList.length>0){
      arrayList.forEach((file) => {
        formData.append('files[]', file);
        formData.append('bill_id', this.state.superId);
        formData.append('parentpath', 'wfclaimform');
      })
    }else{
      return
    }
    dispatch({
      type:'RR/uploadFile',
      payload:formData,
      callback:(res)=>{

        this.setState({fileList:[]})
      }

    })

  }

  handleCorpAdd = () => {
    const userinfo = storage.get("userinfo");

    let id = null;
    let name = "";
    /*if(userinfo && userinfo.psndoc){
      id = userinfo.psndoc.id;
      name = userinfo.psndoc.name;
      if(!id || !name){
        message.error("关联人不存在，不能新建")
        return
      }
    }else{
      message.error("关联人不存在，不能新建")
    }*/
    this.setState({
      rVisible:true,
      id,
      name
    })
  };

  updataRoute = (e,record) => {
    e.preventDefault()
    this.setState({
      uData:record,
      uVisible:true
    })
  };

  childClick = () =>{
    this.setState({
      childVisible: true,
    })
  };
  //附件删除
  uploadFileDelete =(record)=>{

    const { id } = record;
    const { dispatch } = this.props;
    const obj = {
      pageIndex: 0,
      pageSize: 10,
      reqData:{
        id:this.state.superId,
        type:'wfclaimform'
      }
    };
    dispatch({
      type:'RR/uploadDelete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'RR/uploadFileList',
              payload:obj
            })
          })
        }
      }
    })

  }
  //附件列表分页
  handleStandardTableChangeUpload = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,
      reqData:{
        id:this.state.superId,
        type:'wfclaimform'
      }
    };
    dispatch({
      type:'RR/uploadFileList',
      payload: obj,
    });
  };
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type:'RR/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'RR/fetch',
              payload:{
                reqData:{
                  pageIndex:0,
                  pageSize:10
                }
              }
            })
          })
        }
      }
    })
  }

  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const { billcode, status,closeoutdate } = values;
      if(billcode || status || closeoutdate){
        let conditions = [];
        let billcodeObj = {};
        let statusObj = {};
        let startObj = {};
        let endObj = {};

        if(billcode){
          billcodeObj = {
            code:'billcode',
            exp:'like',
            value:billcode
          };
          conditions.push(billcodeObj)
        }
        if(status){
          statusObj = {
            code:'status',
            exp:'like',
            value:status
          };
          conditions.push(statusObj)
        }
        if(closeoutdate){
          startObj = {
            code:'billdate',
            exp:'>=',
            value:closeoutdate[0].format('YYYY-MM-DD')
          };
          conditions.push(startObj)
        }
        if(closeoutdate){
          endObj = {
            code:'billdate',
            exp:'<=',
            value:closeoutdate[1].format('YYYY-MM-DD')
          };
          conditions.push(endObj)
        }
        this.setState({
          conditions
        });
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
         dispatch({
           type:'RR/fetch',
           payload:obj,
         })
      }else{
        this.setState({conditions:[]})
        dispatch({
          type:'RR/fetch',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
        })
      }
    })

  }

  //取消
  handleFormReset = ()=>{
    const { dispatch,form } = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[],
      page:{
        pageIndex:0,
        pageSize:10,
      }
    })
    //清空后获取列表
    dispatch({
      type:'RR/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
      }
    })
  }

  handleSubmit = ()=>{
    this.setState({
      SubmitStatus:true
    });
    const data = setEngineering(0);

    if(!data.length){
      return message.error("该角色不能发起审批")
    }
    let status = false
    for(let i=0;i<roleListName.length;i++){
      if(roleListName[i] === "财务"){
        status = true
      }
    }
    if(status){
      this.setState({
        selectUser:true
      })
    }else{
      this.setState({
        select:true,
        storage:data
      });
    }
  };

  sendMessage = ({res,submitId,billcode,userDefineStr1})=>{
    if(res.length){
      const { dispatch } = this.props;
      const user = storage.get("userinfo");
      if(res[0].type === "USER"){

        res.map(item =>{
          let message = {
            reqData:{
              checkman:item.id,
              senderman:user.id,
              title:'待审批',
              content:billcode,
              state:0,
              type:8,
              corp_id:user.corpId,
              bussiness_id:Number(submitId),
              processid:userDefineStr1,
              jump:2
            }
          };
          dispatch({
            type:'papproval/addmsg',
            payload:message,
          })
        })
      }else{

        dispatch({
          type:'RR/sendMessage',
          payload:{
            reqData:{
              name:res[0].name
            }
          },
          callback:(res2)=>{

            if(res2 && res2.resData && res2.resData.length){
              res2.resData.map(item =>{
                let message = {
                  reqData:{
                    checkman:item.id,
                    senderman:user.id,
                    title:'待审批',
                    content:billcode,
                    state:0,
                    type:8,
                    corp_id:user.corpId,
                    bussiness_id:Number(submitId),
                    processid:userDefineStr1,
                  }
                };
                dispatch({
                  type:'papproval/addmsg',
                  payload:message,
                })
              })
            }
          }
        })
      }
    }
  }

  TongJi = (dataList) =>{
    this.ChildDaoChu(dataList);
  };

  ChildDaoChu = (daoChu)=>{
    console.log("daochu",daoChu)
    if(!daoChu.list.length){
      return message.error("没有人员数据可以导出")
    }
    const { resColumns } = this.state;
    let option={};
    let dataTable = [];
    let arr = []; //保存key
    daoChu.list.map((item)=>{
      let obj = {}
      resColumns.map(ite => {
        const title = ite.title;
        const dataIndex = ite.dataIndex;
        for(let key in item){
          if(key === dataIndex){
            obj[title] = item[key]
          }
        }
      });
      dataTable.push(obj);
    });
    if(dataTable.length){
      for(let key in dataTable[0]){
        arr.push(key)
      }
    }
    option.fileName = '绩效报表';
    option.datas=[
      {
        sheetData:dataTable,
        sheetName:'sheet',
        sheetFilter:arr,
        sheetHeader:arr,
      }
    ];

    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  //展开-收起
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  renderForm() {
    const {
      form: { getFieldDecorator },
      loadingSubmit,
      RR:{fetchData},
    } = this.props;
    const { expandForm } = this.state
    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='单据号'>
              {getFieldDecorator('billcode')(<Input placeholder='请输入单据号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='单据日期'>
              {getFieldDecorator('closeoutdate')( <RangePicker />)}
            </FormItem>

          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
              {
                expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起
                  <Icon type="up" />
                </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开
                  <Icon type="down" />
                </a>
              }
            </span>
          </Col>

        </Row>
        {expandForm? <Row>
          <Col md={8} sm={16}>
            <FormItem label='状态'>
              {getFieldDecorator('status')( <Select placeholder="请选择状态" style={{ width: 226,marginLeft:'14px' }}>
                <Option value="初始状态">初始状态</Option>
                <Option value="审批进行中">审批进行中</Option>
                <Option value="审批通过">审批通过</Option>
                <Option value="审批不通过">审批不通过</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>:''}
        <div style={{margin:'12px 0'}}>
          <Button icon="plus"  size='default' onClick={this.handleCorpAdd} type="primary" >
            新建
          </Button>
          <Button style={{marginLeft:20}}  loading={loadingSubmit} onClick={this.handleSubmit} type="primary" disabled={this.state.SubmitStatus}>
            提交审核
          </Button>
          <Button style={{marginLeft:20}}   onClick={()=>this.TongJi(fetchData)} type="primary">
            导出
          </Button>

        </div>
      </Form>
    );
  }

  childupdataRoute = (e,record)=>{
    e.preventDefault();
    this.setState({
      childUpdateVisible:true,
      childRecord:record
    })
  }

  childHandleDelete = async (record) => {
    const { id } = record;
    const { superId } = this.state;
    const res2 = await api(this.props,'RR/deleteChild',{reqData:{id}});
    if(!res2){
      return
    }
    message.success("删除成功",1,async ()=>{
      const conditions = [{
        code:'CLAIMFORM_H_ID',
        exp:'=',
        value:superId + ''
      }];
      const res3 = await api(this.props,'RR/findId',{
        pageSize:10,
        pageIndex:0,
        conditions
      });
      this.setState({
        childTable:res3
      });
    })
  }

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  handleStandardTableChange = (pagination)=>{
    const { dispatch } = this.props;
    const { conditions} = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };

    this.setState({
      page:obj
    });

    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'RR/fetch',
        payload: param,
      });
      return
    }
    dispatch({
      type:'RR/fetch',
      payload: obj,
    });
  };

  callback = (key) => {

  };

  onQueryUpLoad = (e,record)=>{
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type:'RR/uploadFileList',
      payload:{
        pageIndex:0,
        pageSize:10,
        reqData:{
          id:record.id,
          type:'wfclaimform'
        }
      },
      callback:(res)=>{

      }
    })
    this.setState({
      modalUpLoad:true,
      superId:record.id,
      findStatus:record.status
    })
  };

  handleCancel = ()=>{
    this.setState({
      modalUpLoad:false
    })
  }

  findRoleUser = (NextRole)=>{
    let arr = [];
    for(let i = 0; i< NextRole.length; i++){
      arr.push(api(this.props,'RR/queryNameRole',{reqData:{name:NextRole[i]}}))
    }
    return Promise.all(arr).then((result) => {

      let resultArr = [];
      result.map(item=>{
        if(item && item.resData && item.resData.length){
          item.resData.map(it=>{
            resultArr.push({
              id:it.id,
              name:it.name,
              type:'GROUP'
            })
          })
        }
      })
      return resultArr
    }).catch((error) => {
      message.error("错误",error)
    });
  }

  onClickColumns = (res)=>{
    res = res.filter(item=>item.title !== "操作")
    this.setState({
      resColumns:res
    })
  }

  render() {
    const {
      loading,
      RR:{fetchData,uploadData},
      dispatch,
      uploadLoading,
      uploadListLoading
    } = this.props;

    const { uploading, fileList } = this.state;
    const { childTable,superId,agreeStatus,refuseStatus,returnStatus,rVisible,uVisible,uData,submitId } = this.state;

    const columns = [
      {
        title: '单据号',
        dataIndex: 'billcode',
      },
      {
        title: '所属项目',
        dataIndex: 'projectname',
      },
      {
        title: '报销人',
        dataIndex: 'psnname',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '单据日期',
        dataIndex: 'billdate',
      },
      {
        title: '部门',
        dataIndex: 'deptname',
      },
      {
        title: '交通费',
        dataIndex: 'travelfee',
      },
      {
        title: '税率',
        dataIndex: 'taxrate',
      },
      {
        title: '税额',
        dataIndex: 'tax',
      },
      {
        title: '补贴',
        dataIndex: 'subsidy',
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'operation',
        width:160,
        fixed:'right',
        render: (text, record) => (
          <Fragment>
            {
              record.status === '审批通过' || record.status === '审批进行中' ?<span style={{cursor:'not-allowed',color:'#d9d9d9'}}>删除</span>:
                <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
                <a href="#javascript:;">删除</a>
              </Popconfirm>
            }
            <Divider type="vertical" />
            {
              record.status === '初始状态' || record.status === '审批不通过' || (record.status === '审批通过' && record.projectmanagerId === this.state.userId)?<a href="#javascript:;" onClick={(e)=>this.updataRoute(e,record)}>编辑</a>:<span style={{cursor:'not-allowed',color:'#d9d9d9'}}>编辑</span>
            }
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e)=>this.onQueryUpLoad(e,record)}>附件</a>
          </Fragment>
        ),
      },
    ];

    const AddData = {
      visible:rVisible,
      submitId,
      id:this.state.id,
      name:this.state.name
    };
    const AddOn = {
     /* onOk:()=>{
        if(roleListName.indexOf("一般员工") !== -1){
          const NextRole = setEngineering(0);
          if(!NextRole){
            return message.error("该角色不能发起审批")
          }else if(NextRole){
            this.setState({
              NextRole
            })
          }
        }else{
          const NextRole = setEngineering(0);
          console.log("NextRole",NextRole)
          if(NextRole.length){
            this.findRoleUser(NextRole).then((res)=>{
              console.log("resultArr2",res)
              const user = storage.get("userinfo");
              const { submitId,billcode} = this.state;
              console.log("submitId",submitId)
              console.log("billcode",billcode)
              dispatch({
                type:'RR/submit',
                payload:{
                  reqData:{
                    billcode:billcode+'',
                    billid:submitId+'',
                    billtype:'WF_CLAIMFORM_H',
                    auditors:res,
                    audittype:'WF_CLAIMFORM_H'
                  }
                },
                callback:(res)=>{
                  if(res.errMsg === '提交成功'){
                    message.success("提交成功",1,()=>{
                      this.setState({
                        rVisible:false
                      })
                      // 添加消息
                      let c = {
                        reqData:{
                          checkman:94,
                          senderman:user.id,
                          title:'待审批',
                          content:billcode,
                          state:0,
                          type:8,
                          corp_id:user.corpId,
                          bussiness_id:Number(submitId),
                          processid:res.userDefineStr1,
                        }
                      }
                      dispatch({
                        type:'papproval/addmsg',
                        payload:c,
                      })
                      dispatch({
                        type:'RR/fetch',
                        payload:{
                          ...this.state.page
                        }
                      })
                    })
                  }
                }
              })
            })
          }
        }
      },*/
      onCancel:(clear)=>{
        clear();
        this.setState({
          rVisible:false
        })
      },
      onSave:(res,clear)=>{

        dispatch({
          type:'RR/add',
          payload: {
            reqData:{
              ...res
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success("保存成功",1,()=>{

                clear();
                this.setState({
                  submitId:res.id,
                  rVisible:false
                });
                dispatch({
                  type:'RR/fetch',
                  payload:{
                    ...this.state.page
                  }
                })
              })
            }
          }
        })
      }
    };

    const UpdateData = {
      visible:uVisible,
      record:uData
    };
    const UpdateOn = {
      /*onOk:(record)=>{
        if(roleListName.indexOf("一般员工") !== -1){
          console.log("roleListName",roleListName)
          const NextRole = setEngineering(0);
          console.log("NextRole",NextRole)
          if(!NextRole){
            return message.error("不能发起审批")
          }else if(NextRole){
            this.setState({
              NextRole,
              billcode:record.billcode,
              submitId:record.id
            })
          }
        }else{
          const NextRole = setEngineering(0);
          console.log("NextRole",NextRole)
          if(NextRole.length){
            this.findRoleUser(NextRole).then((res)=>{
              console.log("resultArr2",res)
              dispatch({
                type:'RR/submit',
                payload:{
                  reqData:{
                    billcode:record.billcode+'',
                    billid:record.id+'',
                    billtype:'WF_CLAIMFORM_H',
                    auditors:res,
                    audittype:'WF_CLAIMFORM_H'
                  }
                },
                callback:(res)=>{
                  console.log("审批",res)
                  if(res.errMsg === '提交成功'){
                    message.success("提交成功",1,()=>{
                      this.setState({
                        uVisible:false
                      })
                      const user = storage.get("userinfo");
                      const { uData } = this.state;
                      // 添加消息
                      dispatch({
                        type:'papproval/addmsg',
                        payload:{
                          reqData:{
                            checkman:94,
                            senderman:user.id,
                            title:'待审批',
                            content:record.projectname,
                            state:0,
                            type:8,
                            corp_id:user.corpId,
                            bussiness_id:Number(uData.id),
                            processid:res.userDefineStr1,
                          }
                        },
                      })
                      dispatch({
                        type:'RR/fetch',
                        payload:{
                          pageIndex:0,
                          pageSize:10
                        }
                      })
                    })
                  }
                }
              })
            })
          }
        }
      },*/
      onCancel:(clear)=>{
        clear();
        this.setState({
          uVisible:false,
          uData:{},
        })
      },
      onSave:(res,clear)=>{

        const { uData } = this.state;
        dispatch({
          type:'RR/add',
          payload: {
            reqData:{
              id:uData.id,
              ...res
            }
          },
          callback:(res)=>{

            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                clear();
                this.setState({
                  uVisible:false,
                  record:{}
                });
                dispatch({
                  type:'RR/fetch',
                  payload:{
                    ...this.state.page
                  }
                })
              })
            }else{
              message.error("失败")
            }
          }
        })
      }
    };
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    const childColumns = [
      {
        title: '收支项目',
        dataIndex: 'costsubjname',
      },
      {
        title: '报销金额',
        dataIndex: 'claimingamount',
      },
      {
        title: '税率',
        dataIndex: 'taxrate',
      },
      {
        title: '税金',
        dataIndex: 'taxamount',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'operation',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.childHandleDelete(record)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={(e)=>this.childupdataRoute(e,record)}>编辑</a>
          </Fragment>
        ),
      },
    ];
    const childUploadColumns = [
      {
        title: '文件名称',
        dataIndex: 'name',
      },
      {
        title: '上传人',
        dataIndex: 'upuser',
      },
      {
        title: '上传时间',
        dataIndex: 'uptime',
      },

      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'operation',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.uploadFileDelete(record)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    const ChildAddData = {
      visible:this.state.childVisible,
    };

    const onAddChild = {
      onOk:(obj)=>{

        const { superId } = this.state;
        const { dispatch } = this.props;
        if(!superId) return;
        dispatch({
          type:'RR/childadd',
          payload: {
            reqData:{
              claimformHId:superId,
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success("创建成功",1,()=>{
                this.setState({
                  childVisible:false
                });
                const conditions = [{
                  code:'CLAIMFORM_H_ID',
                  exp:'=',
                  value:superId + ''
                }];
                dispatch({
                  type:'RR/findId',
                  payload:{
                    pageSize:10,
                    pageIndex:0,
                    conditions
                  },
                  callback:(res)=>{
                    this.setState({
                      childTable:res
                    })
                  }
                })
              })
            }else{
              message.error("创建有问题")
            }
          }
        })
      },
      handleCancel:()=>{
        this.setState({
          childVisible:false
        })
      }
    };

    const ChildUpdateData = {
      visible:this.state.childUpdateVisible,
      record:this.state.childRecord
    };

    const onUpdateChild = {
      onOk:(obj)=>{
        const { superId,childRecord } = this.state;
        const { dispatch } = this.props;
        console.log({
          reqData:{
            id:childRecord.id,
            claimformHId:superId,
            ...obj
          }
        })
        if(!superId) return;
        dispatch({
          type:'RR/childadd',
          payload: {
            reqData:{
              id:childRecord.id,
              claimformHId:superId,
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success("编辑成功",1,()=>{
                this.setState({
                  childUpdateVisible:false
                });
                const conditions = [{
                  code:'CLAIMFORM_H_ID',
                  exp:'=',
                  value:superId + ''
                }];
                dispatch({
                  type:'RR/findId',
                  payload:{
                    pageSize:10,
                    pageIndex:0,
                    conditions
                  },
                  callback:(res)=>{
                    this.setState({
                      childTable:res
                    })
                  }
                })
              })
            }else{
              message.error("更新有问题")
            }
          }
        })
      },
      handleCancel:()=>{
        this.setState({
          childUpdateVisible:false
        })
      }
    };

    const dataUser = {
      visible:this.state.select,
      title:"请选择审批人",
      agree:"加签",
      cancel:"不加签"
    };

    const onUser = {
      onOk:(arr,qinChu,changeStatus)=>{
        if(!arr.length){
          return message.error("请选择审批人",1.3,()=>{
            changeStatus()
          })
        }
        const { storage } = this.state;
        this.findRoleUser(storage).then((res)=>{
          const { billcode,submitId } = this.state;
          dispatch({
            type:'RR/submit',
            payload:{
              reqData:{
                billcode:billcode+'',
                billid:submitId+'',
                billtype:'WF_CLAIMFORM_H',
                auditors:arr.concat(res),
                audittype:'WF_CLAIMFORM_H'
              }
            },
            callback:(res2)=>{
              if(res2.errMsg === '提交成功'){
                message.success("提交成功",1,()=>{
                  //提交成功后清除框数据
                  qinChu();
                  changeStatus();
                  this.setState({
                    select:false,
                    SubmitStatus:true
                  });
                  this.sendMessage({res:arr,submitId,billcode,userDefineStr1:res2.userDefineStr1})
                  dispatch({
                    type:'RR/fetch',
                    payload:{
                      ...this.state.page
                    }
                  })
                })
              }else{
                changeStatus();
                message.error("提交失败")
              }
            }
          })
        })
      },
      onCancel:(qinChu,changeStatus)=>{
        const { storage } = this.state;
        this.findRoleUser(storage).then((res)=>{
          const { billcode,submitId } = this.state;
          dispatch({
            type:'RR/submit',
            payload:{
              reqData:{
                billcode:billcode+'',
                billid:submitId+'',
                billtype:'WF_CLAIMFORM_H',
                auditors:res,
                audittype:'WF_CLAIMFORM_H'
              }
            },
            callback:(res2)=>{
              if(res2.errMsg === '提交成功'){
                message.success("提交成功",1,()=>{
                  //提交成功后清除框数据
                  qinChu();
                  changeStatus();
                  this.setState({
                    select:false,
                    SubmitStatus:true
                  });
                  this.sendMessage({res,submitId,billcode,userDefineStr1:res2.userDefineStr1})
                  dispatch({
                    type:'RR/fetch',
                    payload:{
                      ...this.state.page
                    }
                  })
                })
              }else{
                changeStatus();
                message.error("提交失败")
              }
            }
          })
        })
      },
      onShadow:()=>{
        this.setState({
          select:false
        })
      }
    };

    const dataUserC = {
      visible:this.state.selectUser,
      agree:"加签",
      is:1
    };

    const onUserC = {
      onOk:(arr,qinChu,changeStatus)=>{
        if(arr.length){ // selectUser框选中的数据 如果没有就不能提交
          const { billcode,submitId } = this.state;
          dispatch({
            type:'RR/submit',
            payload:{
              reqData:{
                billcode:billcode+'',
                billid:submitId+'',
                billtype:'WF_CLAIMFORM_H',
                auditors:arr,
                audittype:'WF_CLAIMFORM_H'
              }
            },
            callback:(res2)=>{
              if(res2.errMsg === "提交成功"){
                message.success("提交成功",1.3,()=>{

                  qinChu(); // 成功后会清空SelectUser框中的数据

                  changeStatus();

                  this.setState({
                    selectUser:false, //关闭selectUser框
                    SubmitStatus:true
                  })

                  //  添加消息
                  this.sendMessage({res:arr,submitId,billcode,userDefineStr1:res2.userDefineStr1})

                  dispatch({
                    type:'RR/fetch',
                    payload:{
                      ...this.state.page
                    }
                  })
                })
              }else{
                changeStatus();
                message.error("提交失败")
              }
            }
          })
        }else{
          changeStatus();
          return message.error("请选择审批人")
        }
      },
      onShadow:()=>{
        this.setState({
          selectUser:false,
        })
      }
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <NormalTable
              style={{marginTop:'10px'}}
              data={fetchData}
              columns={columns}
              onRow={(record )=>{
                return {
                  onClick:()=>{
                    this.setState({
                      rowId: record.id,
                      submitId:record.id,
                      billcode:record.billcode,
                      uData:record,
                    })
                    if(record.status === "初始状态" || record.status === "审批不通过"){
                      this.setState({
                        SubmitStatus:false
                      })
                    }else{
                      this.setState({
                        SubmitStatus:true
                      })
                    }
                  },
                  rowKey:record.id
                }
              }}
              onChange={this.handleStandardTableChange}
              rowClassName={this.setRowClassName}
              onClickColumns={this.onClickColumns}
            />
          </div>
        </Card>

        <Modal
          title={"附件列表"}
          width={"70%"}
          visible={this.state.modalUpLoad}
          onCancel={this.handleCancel}
          footer={[<Button onClick={this.handleCancel}>取消</Button>]}
        >
          <div style={{marginBottom:'15px'}}>
            <Upload {...props}>
              <Button disabled={this.state.findStatus==="初始状态"?0:1}>
                <Icon type="upload"/>上传附件
              </Button>
            </Upload>
            <Button
              type="primary"
              onClick={this.handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
              style={{ marginTop: 16 }}
            >
              {uploading ? '上传中' : '开始上传'}
            </Button>
          </div>
          <NormalTable
            loading={uploadListLoading}
            data={uploadData}
            columns={childUploadColumns}
            onChange={this.handleStandardTableChangeUpload}
          />
        </Modal>

        <RAdd on={AddOn} data={AddData}/>

        <RUpdate on={UpdateOn} data={UpdateData}/>

        <ChildAdd on={onAddChild} data={ChildAddData}/>

        <ChildUpdate on={onUpdateChild} data={ChildUpdateData}/>

        <RoleUser on={ onUser } data={ dataUser }/>

        <RoleUser on={onUserC} data={dataUserC}/>

      </PageHeaderWrapper>
    );
  }
}

export default ReimbursementRorm;


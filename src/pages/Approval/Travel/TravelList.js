import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  Upload,
  DatePicker,
  Select,
  Button,
  Card,
  Popconfirm,
  Divider,
  Icon,
  Table,
  Row,
  Modal,
  Spin,
  Col,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
import './tableSureBg.less'
import TravelAdd from '@/pages/Approval/Travel/TravelAdd';
import TravelUpdate from '@/pages/Approval/Travel/TravelUpdate';
import storage from '@/utils/storage';
import TravelChildAdd from '@/pages/Approval/Travel/TravelChildAdd';
import TravelChildUpdate from '@/pages/Approval/Travel/TravelChildUpdate';
import api from '@/pages/tool/api/api';
import { roleListName,setEngineering } from '@/pages/tool/dept/dept';
import RoleUser from '@/pages/tool/RoleUser';
import ExportJsonExcel from 'js-export-excel';
const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@connect(({ TL,papproval, loading }) => ({
  TL,
  papproval,
  loading: loading.models.TL,
  loadingSuper:loading.effects['TL/fetch'],
  loadingList:loading.effects['TL/fetchList'],
  loadingSubmit:loading.effects['TL/submit'],
  loadingChild:loading.effects['TL/childFetch'],
}))
@Form.create()
class TravelList extends PureComponent {
  state ={
    expandForm:false,
    superId:null,
    rowId:null,

    rVisible:false,
    uVisible:false,
    uData:{},

    childAddVisible: false,
    childUpdateVisible:false,

    billcode:'',
    submitId:'',

    page:{
      pageIndex:0,
      pageSize:10
    },
    conditions:[],


    childData:[], //存储子表数据
    childRecord:{},

    SubmitStatus:true,
    superData:{},

    childStatus:true, //主表为初始状态或者审批不通过时才能编辑
    lookFileTicket:[],
    lookFile:[],
    lookTicketShow:false,
    lookShow:false,

    previewVisible: false,
    previewImage: '',

    select:false,
    selectUser:false,

    storage:[],

    resColumns:[
      {
        title: '单据号',
        dataIndex: 'billcode',
      },
      {
        title: '单据日期',
        dataIndex: 'billdate',
      },
      {
        title: '所属项目',
        dataIndex: 'projectName',
      },
      {
        title: '部门',
        dataIndex: 'deptName',
      },
      {
        title: '报销人',
        dataIndex: 'psnName',
      },
      {
        title: '单据状态',
        dataIndex: 'status',
      },
      {
        title: '报销金额',
        dataIndex: 'mny',
      },
      {
        title: '出差天数',
        dataIndex: 'travaldays',
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: '操作',
        fixed:'right',
        dataIndex: 'operating',
        render: (text, record) => (
          <Fragment>
            {
              record.status === '审批进行中' || record.status === '审批通过'?<span style={{cursor:'not-allowed',color:'#d9d9d9'}}>删除</span>:
                <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
                  <a href="#javascript:;">删除</a>
                </Popconfirm>
            }
            <Divider type="vertical" />
            {
              record.status === '审批进行中' || record.status === '审批通过'?<span style={{cursor:'not-allowed',color:'#d9d9d9'}}>编辑</span>:
                <a href="#javascript:;" onClick={(e)=> this.handleUpdate(e,record)}>编辑</a>
            }
          </Fragment>
        ),
      },
    ]
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if(this.props.location.state && this.props.location.state.id){
      const { id } = this.props.location.state;
      this.onRecord(id)
    }else{
      dispatch({
        type:'TL/fetch',
        payload:{
          reqData:{
            pageIndex:0,
            pageSize:10
          }
        }
      })
    }
  }
  componentWillReceiveProps = (nextProps) => {
    if(nextProps.location.state && nextProps.location.state.id){
      if(this.props.location.state !== nextProps.location.state){
        const { id } = nextProps.location.state;
        console.log("id",id)
        this.onRecord(id)
      }
    }
  };
  onRecord = (id)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'TL/fetch',
      payload:{
        conditions:[{
          code:'id',
          exp:'=',
          value:id
        }]
      }
    })
  }

  handleAdd = () => {
    //router.push('/approval/travel/add');
    this.setState({
      rVisible:true,
    })
  };
  handleUpdate = (e,record) => {
    e.preventDefault();
    this.setState({
      uVisible:true,
      uData:record
    })
  };
  handleDelete = (record)=>{
    console.log("record",record)
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type:'TL/superDelete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        console.log("删除",res)
        if(res && res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'TL/fetch',
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

  childAdd = () => {
    //router.push('/internet/travel/add');
    this.setState({
      childAddVisible:true
    })
  };
  childUpdate = (e,record)=>{
    e.preventDefault();
    this.setState({
      childUpdateVisible:true,
      childRecord:record
    })
  };
  childDelete = (record)=>{
    console.log("record",record)
    const { superId } = this.state;
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type:'TL/childDelete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        console.log("删除",res)
        if(res && res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            const conditions = [{
              code:'CLAIMFORM_H_ID',
              exp:'=',
              value:superId + ''
            }];
            dispatch({
              type:'TL/childFetch',
              payload:{
                conditions
              },
              callback:(res)=>{
                if(res && res.resData){
                  this.setState({
                    childData:res.resData
                  })
                }else{
                  this.setState({
                    childData:[]
                  })
                }
              }
            })
            dispatch({
              type:'TL/fetch',
              payload:{
                reqData:{
                  ...this.state.page
                }
              }
            })
          })
        }
      }
    })
  }

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
          type:'TL/fetch',
          payload:obj,
        })
      }else{
        this.setState({conditions:[]})
        dispatch({
          type:'TL/fetch',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
        })
      }
    })

  }

  handleFormReset = ()=>{
    const { dispatch,form } = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[]
    })
    //清空后获取列表
    dispatch({
      type:'TL/fetch',
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
    const data = setEngineering(1);
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
  }

  sendMessage = ({res,submitId,billcode,userDefineStr1})=>{
    if(res.length){
      const { dispatch } = this.props;
      const user = storage.get("userinfo");
      if(res[0].type === "USER"){
        console.log("用户")
        res.map(item =>{
          let message = {
            reqData:{
              checkman:item.id,
              senderman:user.id,
              title:'待审批',
              content:billcode,
              state:0,
              type:9,
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
        console.log("角色")
        dispatch({
          type:'TL/sendMessage',
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
                    type:9,
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
    option.fileName = '差率费报表';
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
      TL:{data}
    } = this.props;
    const { expandForm } = this.state
    return (
    <div>
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='单据号'>
              {getFieldDecorator('billcode')(<Input placeholder='单据号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='单据日期'>
              {getFieldDecorator('closeoutdate')( <RangePicker/>)}
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
      </Form>
       <div style={{margin:'12px 0'}}>
            <Button icon="plus"  size='default' onClick={this.handleAdd} type="primary" >
                新建
            </Button>
            <Button style={{marginLeft:20}}  loading={loadingSubmit} onClick={this.handleSubmit} type="primary" disabled={this.state.SubmitStatus}>
             提交审核
           </Button>
           <Button style={{marginLeft:20}}   onClick={()=>this.TongJi(data)} type="primary">
           导出
         </Button>
        </div>
    </div>
    );
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
    })
    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'TL/fetch',
        payload: param,
      });
      return
    }
    dispatch({
      type:'TL/fetch',
      payload: obj,
    });
  };
  //查看附件
  lookTicket = (e,record)=>{
    e.preventDefault();
    const { dispatch } = this.props
    this.setState({lookTicketShow:true})
    dispatch({
      type:'TL/fetchList',
      payload:{
        reqData:{
          bill_id:record.id,
          type:'invoice'
        }
      },
      callback:(response)=>{
        this.setState({lookFileTicket:response})
      }
    });
  }
  lookFileThing = (e,record)=>{
    e.preventDefault();
    const { dispatch } = this.props
    this.setState({lookShow:true})
    dispatch({
      type:'TL/fetchList',
      payload:{
        reqData:{
          bill_id:record.id,
          type:'wmtravelclaimform'
        }
      },
      callback:(response)=>{
        this.setState({lookFile:response})
      }
    });
  }
  noTicketShow = ()=>{
    this.setState({
      lookTicketShow:false,
      lookFileTicket:[]
    })
  }
  noShow = ()=>{
    this.setState({
      lookShow:false,
      lookFile:[]
    })
  }
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

  findRoleUser = (NextRole)=>{
    let arr = [];
    for(let i = 0; i< NextRole.length; i++){
      arr.push(api(this.props,'TL/queryNameRole',{reqData:{name:NextRole[i]}}))
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
      loadingSuper,
      loadingChild,
      loading,
      loadingList,
      dispatch,
      TL:{data}
    } = this.props;
    const columns = [
      {
        title: '单据号',
        dataIndex: 'billcode',
      },
      {
        title: '单据日期',
        dataIndex: 'billdate',
      },
      {
        title: '所属项目',
        dataIndex: 'projectName',
      },
      {
        title: '部门',
        dataIndex: 'deptName',
      },
      {
        title: '报销人',
        dataIndex: 'psnName',
      },
      {
        title: '单据状态',
        dataIndex: 'status',
      },
      {
        title: '报销金额',
        dataIndex: 'mny',
      },
      {
        title: '出差天数',
        dataIndex: 'travaldays',
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: '操作',
        fixed:'right',
        dataIndex: 'operating',
        render: (text, record) => (
          <Fragment>
            {
              record.status === '审批进行中' || record.status === '审批通过'?<span style={{cursor:'not-allowed',color:'#d9d9d9'}}>删除</span>:
                <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
                  <a href="#javascript:;">删除</a>
                </Popconfirm>
            }
            <Divider type="vertical" />
            {
              record.status === '审批进行中' || record.status === '审批通过'?<span style={{cursor:'not-allowed',color:'#d9d9d9'}}>编辑</span>:
                <a href="#javascript:;" onClick={(e)=> this.handleUpdate(e,record)}>编辑</a>
            }
          </Fragment>
        ),
      },
    ];
    const childColumns = [
        {
            title: '收支项目',
            dataIndex: 'costsubjName',
        },
        {
            title: '报销金额',
            dataIndex: 'claimingamount',
            width:100
        },
        {
          title: '税率',
          dataIndex: 'taxrate',
          width:100
        },
        {
            title: '税金',
            dataIndex: 'taxamount',
            width:100
        },
        {
            title: '附件',
            dataIndex: 'file',
            width:100,
            render: (text, record) => (
              <Fragment>
                <a href="#javascript:;"  onClick={(e)=> this.lookFileThing(e,record)}>查看附件</a>
              </Fragment>
          ),
        },
        {
            title: '发票',
            dataIndex: 'invoiceId',
          width:100,
          render: (text, record) => (
            <Fragment>
              <a href="#javascript:;"   onClick={(e)=> this.lookTicket(e,record)}>查看发票</a>
            </Fragment>
          ),

        },
        {
            title: '操作',
            dataIndex: 'operating',
            render: (text, record) => (
              <Fragment>
                <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.childDelete(record)}>
                  <a href="#javascript:;" disabled={this.state.superId && this.state.childStatus?0:1}>{formatMessage({ id: 'validation.delete' })}</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a href="#javascript:;" disabled={this.state.superId && this.state.childStatus?0:1}  onClick={(e)=> this.childUpdate(e,record)}>编辑</a>
              </Fragment>
            ),
          },
    ];

    const { superId,submitId,rVisible,uVisible,uData,childAddVisible,childUpdateVisible,childRecord,childData } = this.state;
    const { previewVisible, previewImage } = this.state
    const AddData = {
      visible:rVisible,
      submitId,
    };
    const AddOn = {
      onOk:(obj)=>{
        const NextRole = setEngineering(1);

        this.findRoleUser(NextRole).then((res)=>{

          const user = storage.get("userinfo");
          const { submitId,billcode} = this.state;
          dispatch({
            type:'TL/submit',
            payload:{
              reqData:{
                billcode:billcode+'',
                billid:submitId+'',
                billtype:'WF_TRAVELCLAIMFORM_H',
                auditors:res,
                audittype:'WF_TRAVELCLAIMFORM_H'
              }
            },
            callback:(res)=>{
              if(res.errMsg === '提交成功'){
                message.success("提交成功",1,()=>{
                  this.setState({
                    rVisible:false
                  })
                  // 添加消息
                  dispatch({
                    type:'papproval/addmsg',
                    payload:{
                      reqData:{
                        checkman:94,
                        senderman:user.id,
                        title:'待审批',
                        content:billcode,
                        state:0,
                        type:9,
                        corp_id:user.corpId,
                        bussiness_id:Number(submitId),
                        processid:res.userDefineStr1,
                      }
                    },
                  })
                  dispatch({
                    type:'TL/fetch',
                    payload:{
                      ...this.state.page
                    }
                  })
                })
              }
            }
          })
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          rVisible:false
        })
      },
      onSave:(res,clear)=>{
        this.setState({
          billcode:res.billcode,
        })
        dispatch({
          type:'TL/superAdd',
          payload:{
            reqData:{
              ...res
            }
          },
          callback:(response)=>{

            if(response && response.errMsg === "成功"){
              message.success("添加成功",1,()=>{
                clear()
                dispatch({
                  type:'TL/fetch',
                  payload:{
                    reqData:{
                      ...this.state.page
                    }
                  }
                })
                this.setState({
                  submitId:response.id,
                  rVisible:false
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
      onOk:(record)=>{
        const NextRole = setEngineering(1);
        this.findRoleUser(NextRole).then((res)=>{
          console.log("resultArr2",res)
          dispatch({
            type:'TL/submit',
            payload:{
              reqData:{
                billcode:record.billcode+'',
                billid:record.id+'',
                billtype:'WF_TRAVELCLAIMFORM_H',
                auditors:res,
                audittype:'WF_TRAVELCLAIMFORM_H'
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
                        type:9,
                        corp_id:user.corpId,
                        bussiness_id:Number(uData.id),
                        processid:res.userDefineStr1,
                      }
                    },
                  })
                  dispatch({
                    type:'TL/fetch',
                    payload:{
                      ...this.state.page
                    }
                  })
                })
              }
            }
          })
        })



      },
      onCancel:()=>{
        this.setState({
          uVisible:false,
          uData:{},
        })
      },
      onSave:(res)=>{
        console.log("obj",res)
        dispatch({
          type:'TL/superAdd',
          payload:{
            reqData:{
              ...res
            }
          },
          callback:(response)=>{
            console.log("response",response)
            if(response && response.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                this.setState({
                  uVisible: false
                })
                dispatch({
                  type:'TL/fetch',
                  payload:{
                    reqData:{
                      ...this.state.page
                    }
                  }
                })
              })
            }
          }
        })
      }
    };

    const ChildAddData = {
      visible:childAddVisible,
    };
    const onAddChild = {
      onOk:(obj,type,func)=>{
        const { superId } = this.state;
        if(!superId) return;
        dispatch({
          type:'TL/childAdd',
          payload: {
            reqData:{
              claimformHId:superId,
              ...obj
            }
          },
          callback:(res)=>{
            console.log("子表新建",res)
            console.log('打印的obj',obj)
            if(res.errMsg === '成功'){
              message.success("新建成功",1,()=>{
                if(type !== "再记一笔"){
                  this.setState({
                    childAddVisible:false
                  });
                }
                //附件上传
                if(obj.addticket){
                  const formData = new FormData();
                  if(obj.addticket.fileList){
                    obj.addticket.fileList.forEach((file)=>{
                      formData.append('files[]', file.originFileObj?file.originFileObj:file);
                      formData.append('project_id', res.id);
                      formData.append('type', 'business');
                      formData.append('parentpath', 'invoice');
                    })
                  }
                  dispatch({
                    type:'TL/submitProjectAddForm',
                    payload:formData,
                    callback:(res)=>{
                      console.log('上传附件结果',res)
                    }
                  })
                }
                if(obj.annex){
                  const formData = new FormData();
                  if(obj.annex.fileList){
                    obj.annex.fileList.forEach((file)=>{
                      formData.append('files[]', file.originFileObj?file.originFileObj:file);
                      formData.append('project_id', res.id);
                      formData.append('type', 'business');
                      formData.append('parentpath', 'wmtravelclaimform');
                    })
                  }
                  dispatch({
                    type:'TL/submitProjectAddForm',
                    payload:formData,
                    callback:(res)=>{
                      console.log('上传附件结果',res)
                    }
                  })
                }

                const conditions = [{
                  code:'CLAIMFORM_H_ID',
                  exp:'=',
                  value:superId + ''
                }];
                dispatch({
                  type:'TL/childFetch',
                  payload:{
                    conditions
                  },
                  callback:(res)=>{
                    if(res && res.resData){
                      this.setState({
                        childData:res.resData
                      })
                    }
                  }
                })
                dispatch({
                  type:'TL/fetch',
                  payload:{
                      ...this.state.page
                  }
                })
                func();
              })
            }else{
              message.error("新建失败")
            }
          }
        })
      },
      handleCancel:()=>{
        console.log("执行成功")
        this.setState({
          childAddVisible:false
        })
      },
    };

    const ChildUpdateData = {
      visible:childUpdateVisible,
      record:childRecord
    };
    const onUpdateChild = {
      onOk:(obj,deleteFileTicket,deleteFile,handleCancel)=>{
        const { superId,childRecord } = this.state;
        const { dispatch } = this.props;
        if(!superId) return;
        //掉删除
        if(deleteFileTicket.length){
          for(let i=0;i<deleteFileTicket.length;i++){
            dispatch({
             type:'TL/deleteend',
             payload:{
               reqData:{
                 id:deleteFileTicket[i].id
               }
             },
             callback:(res)=>{

             }
           })
          }
        }
        if(deleteFile.length){
          for(let i=0;i<deleteFile.length;i++){
            dispatch({
              type:'TL/deleteend',
              payload:{
                reqData:{
                  id:deleteFile[i].id
                }
              },
              callback:(res)=>{

              }
            })
          }
        }
        //掉上传

        //return; //测试好把这个return去了
        dispatch({
          type:'TL/childAdd',
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
                //附件上传
                if(obj.addticket && obj.addticket.length>0){
                  const formData = new FormData();
                  obj.addticket.forEach((file)=>{
                    formData.append('files[]', file);
                    formData.append('project_id', childRecord.id);
                    formData.append('type', 'business');
                    formData.append('parentpath', 'invoice');
                  })

                  dispatch({
                    type:'TL/submitProjectAddForm',
                    payload:formData,
                    callback:(res)=>{
                      console.log('编辑上传附件结果',res)
                    }
                  })
                }
                if(obj.annex && obj.annex.length>0){
                  const formData = new FormData();
                  obj.annex.forEach((file)=>{
                    formData.append('files[]', file);
                    formData.append('project_id', childRecord.id);
                    formData.append('type', 'business');
                    formData.append('parentpath', 'wmtravelclaimform');
                  })
                  dispatch({
                    type:'TL/submitProjectAddForm',
                    payload:formData,
                    callback:(res)=>{
                      console.log('编辑上传附件结果',res)
                    }
                  })
                }

                this.setState({
                  childUpdateVisible:false,
                  childRecord: {}
                });
                const conditions = [{
                  code:'CLAIMFORM_H_ID',
                  exp:'=',
                  value:superId + ''
                }];
                dispatch({
                  type:'TL/childFetch',
                  payload:{
                    conditions
                  },
                  callback:(res)=>{
                    if(res && res.resData){
                      this.setState({
                        childData:res.resData
                      })
                    }else{
                      this.setState({
                        childData:[]
                      })
                    }
                  }
                })
                dispatch({
                  type:'TL/fetch',
                  payload:{
                      ...this.state.page
                  }
                })

                handleCancel();
              })
            }else{
              message.error("编辑出错")
            }
          }
        })
      },
      handleCancel:()=>{
        this.setState({
          childUpdateVisible:false,
          childRecord: {}
        })
      },
    };
    const ticketprops = {
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      listType: 'picture-card',
      fileList: this.state.lookFileTicket

    }

    const dataUser = {
      visible:this.state.select,
      title:"请选择审批人",
      agree:"加签",
      cancel:"不加签"
    };

    const onUser = {
      onOk:(arr,qinChu,changeStatus)=>{
        console.log("确定",arr)
        if(!arr.length){
          return message.error("请选择审批人")
        }
        const { storage } = this.state;
        this.findRoleUser(storage).then((res)=>{
          const { superData } = this.state;
          dispatch({
            type:'TL/submit',
            payload:{
              reqData:{
                billcode:superData.billcode+'',
                billid:superData.id+'',
                billtype:'WF_TRAVELCLAIMFORM_H',
                auditors:arr.concat(res),
                audittype:'WF_TRAVELCLAIMFORM_H'
              }
            },
            callback:(res2)=>{
              console.log("提交结果",res2)
              if(res2.errMsg === '提交成功'){
                message.success("提交成功",1,()=>{
                  qinChu();
                  changeStatus();
                  this.setState({
                    select:false,
                    SubmitStatus:true
                  })
                  // 添加消息
                  this.sendMessage({res:arr,submitId:superData.id,billcode:superData.billcode,userDefineStr1:res2.userDefineStr1})
                  dispatch({
                    type:'TL/fetch',
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
          const { superData } = this.state;
          dispatch({
            type:'TL/submit',
            payload:{
              reqData:{
                billcode:superData.billcode+'',
                billid:superData.id+'',
                billtype:'WF_TRAVELCLAIMFORM_H',
                auditors:res,
                audittype:'WF_TRAVELCLAIMFORM_H'
              }
            },
            callback:(res2)=>{
              console.log("提交结果",res2)
              if(res2.errMsg === '提交成功'){
                message.success("提交成功",1,()=>{
                  qinChu();
                  changeStatus();
                  this.setState({
                    select:false,
                    SubmitStatus:true
                  })
                  // 添加消息
                  this.sendMessage({res,submitId:superData.id,billcode:superData.billcode,userDefineStr1:res2.userDefineStr1})
                  dispatch({
                    type:'TL/fetch',
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
          select:false,
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
          const { superData } = this.state;
          dispatch({
            type:'TL/submit',
            payload:{
              reqData:{
                billcode:superData.billcode+'',
                billid:superData.id+'',
                billtype:'WF_TRAVELCLAIMFORM_H',
                auditors:arr,
                audittype:'WF_TRAVELCLAIMFORM_H'
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
                  this.sendMessage({res:arr,submitId:superData.id,billcode:superData.billcode,userDefineStr1:res2.userDefineStr1})

                  dispatch({
                    type:'TL/fetch',
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
          selectUser:false
        })
      }
    };

    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} style={{marginBottom:'20px'}}>{this.renderForm()}</div>
            <NormalTable
             loading={loadingSuper}
             columns={columns}
             data={data}
             onRow={(record )=>{
               return {
                 onClick:()=>{
                   const { dispatch } = this.props;
                   if(record.status === "初始状态" || record.status === "审批不通过"){
                     this.setState({
                       childStatus:true
                     })
                   }else{
                     this.setState({
                       childStatus:false
                     })
                   }
                   dispatch({
                     type:'TL/childFetch',
                     payload:{
                       conditions:[{
                         code:'CLAIMFORM_H_ID',
                         exp:'=',
                         value:record.id
                       }]
                     },
                     callback:(res)=>{
                        console.log("子表",res);
                        if(res && res.resData && res.resData.length){
                          //发票和附件

                          dispatch({
                            type:'TL/fetchList',
                            payload:{
                              reqData:{
                                bill_id:record.id,
                                type:'wmtravelclaimform'
                              }
                            },
                            callback:(response)=>{

                            }
                          });
                          this.setState({
                            childData:res.resData
                          })
                          if(record.status === "初始状态" || record.status === "审批不通过"){
                            this.setState({
                              SubmitStatus:false
                            })
                          }else{
                            this.setState({
                              SubmitStatus:true,
                            })
                          }
                        }else{
                          this.setState({
                            childData:[],
                            SubmitStatus:true
                          })
                        }
                     }
                   })
                   this.setState({
                     superId:record.id,
                     rowId: record.id,
                     superData:record
                   })
                 },
                 rowKey:record.id
               }
             }}
             rowClassName={this.setRowClassName}
             onChange={this.handleStandardTableChange}
             onClickColumns={this.onClickColumns}
              />
          </div>
          <Modal
            title="查看发票"
            visible={this.state.lookTicketShow}
            destroyOnClose
            onCancel={this.noTicketShow}
            footer={[
              // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
              <Button  type="primary"  onClick={this.noTicketShow}>
                确定
              </Button>,
            ]}
          >
            <Spin spinning={loadingList}>
              <Upload
                loading={loading}
                {...ticketprops}
                onPreview={this.handlePreview}
              >
              </Upload>
            </Spin>
            {/*{ this.state.lookFileTicket.length ?
              this.state.lookFileTicket.map((item,index)=>{
                return <p key={index}>
                  <a download target="_blank" href={item.url} >{item.name}</a>
                </p>
              }) : '暂无附件'
            }*/}

          </Modal>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
          <Modal
            title="查看附件"
            visible={this.state.lookShow}
            destroyOnClose
            onCancel={this.noShow}
            footer={[
              // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
              <Button  type="primary"  onClick={this.noShow}>
                确定
              </Button>,
            ]}
          ><Spin spinning={loadingList}>
            { this.state.lookFile.length ?
              this.state.lookFile.map((item,index)=>{
                return  <p key={index}>
                  <a download target="_blank" href={item.url} >{item.name}</a>
                </p>
              }) : '暂无附件'
            }
          </Spin>
          </Modal>
        </Card>

        <Card bordered={false} style={{marginTop:'26px'}}>
          <div style={{marginBottom:'15px'}}>
            <Button type='primary' icon="plus" disabled={superId && this.state.childStatus?0:1}  size='default' onClick={this.childAdd}>新建</Button>
          </div>
          <NormalTable
            loading={loadingChild}
            data={{list:childData}}
            columns={childColumns}
            pagination={false}
          />
        </Card>

        <TravelAdd on={AddOn} data={AddData}/>

        <TravelUpdate on={UpdateOn} data={UpdateData}/>

        <TravelChildAdd on={onAddChild} data={ChildAddData}/>

        <TravelChildUpdate on={onUpdateChild} data={ChildUpdateData}/>

        <RoleUser on={ onUser } data={ dataUser }/>

        <RoleUser on={onUserC} data={dataUserC}/>
      </PageHeaderWrapper>
    );
  }
}

export default TravelList;

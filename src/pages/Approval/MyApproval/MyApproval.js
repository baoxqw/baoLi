import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Icon,
  Tabs,
  Tooltip,
  Modal,
  message,
} from 'antd';
import moment from 'moment';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ApproveCheckad from '@/pages/Approval/MyApproval/ApproveCheckad'
import router from 'umi/router';
import styles from '../../System/UserAdmin.less';
import ExportJsonExcel from 'js-export-excel';

const FormItem = Form.Item;

const { Option } = Select;
@connect(({ statustable, loading }) => ({
  statustable,
  loading: loading.models.statustable,
}))
@Form.create()
class MyApproval extends PureComponent {
  state = {
    expandForm: false,
    Application:true,
    color1:true,
    color2:false,
    dataapply:[],
    applystart:false,
    examine:false,
    pageIndex:0,
    selectValue:0,
    statusValue:false,
    userFind:{},
    appContion:{},
    selectCondition:{},
    dataValue:[],
    Applall:false,
    ApplStatus:null,
    Apprall:false,
    ApprStatus:null,
    pageAppl:{},
    pageAppr:{},
    userConditions:{},
    approvestatus:false,
    approveState:'待审批',
    selectedRowKeys:[],
    selectedRows:[],
    approveDis:false,
    approvalVisible:false,
  };

  columns2 = [
    {
      title: '单据号',
      dataIndex: 'billCode',
    },
    {
      title: '申请人',
      dataIndex: 'fromUserName',
    },
    {
      title: '申请时间',
      dataIndex: 'startTime',
      render:(text,record)=>{
        return <span>{moment(text).format("YYYY-MM-DD")}</span>
      }
    },

    {
      title: '审批人',
      dataIndex: 'toUserName',
    },
    {
      title:'状态',
      dataIndex:'auditStatus',
      render:(text,item)=>{
        if(text === 'WAIT_AUDIT'){
          return <span>待审批</span>
        }else if(text === 'AGREE_AUDIT'){
          return <span>已同意申请</span>
        }else if(text === 'REJECT_AUDIT'){
          return <span> 已拒绝申请</span>
        }else if(text === 'CANCEL'){
          return <span>已取消</span>
        }
      }
    },
    {
      title: '操作',
      // fixed:'right',
      render: (text, record) =>
      {
        if(record.auditStatus == 'AGREE_AUDIT' || record.auditStatus == 'CANCEL' || record.auditStatus == 'REJECT_AUDIT'){
          return   <Fragment>
            <a onClick={(e) => this.handleApproval(e,record)}>查看</a>
          </Fragment>
        }else{
          return  <Fragment>
            <a onClick={(e) => this.handleApprovalCheck(e,record)}>审核</a>
          </Fragment>
        }

      }


    },
  ];

  //初始数据
  componentDidMount() {
    const { dispatch } = this.props;
    if(this.props.location.defaultPage){
      this.setState({defaultPage:this.props.location.defaultPage+''})
    }
    //申请
    /*dispatch({
      type: 'statustable/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
        reqData:{
          audittype:'WF_CLAIMFORM_H'
        }
      }
    });*/
    //已审批
    /* dispatch({
       type: 'statustable/readyfetched',
       payload:{
         pageSize:10,
         pageIndex:0,
         reqData:{
           audittype:'WF_CLAIMFORM_H'
         }
       },
     });*/
    //待审批
    dispatch({
      type: 'statustable/readyfetch',
      payload:{
        pageSize:10,
        pageIndex:0,
        reqData:{
          audittype:'WF_CLAIMFORM_H'
        }
      },
    });

  }

  //我的审批待审批分页
  handleStandard= (pagination) => {
    const { dispatch } = this.props;
    const { appContion,approvestatus } = this.state;
    if(!pagination.pageSize){
      pagination.pageSize = pagination.total;
    }
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
      reqData:{
        audittype:'WF_CLAIMFORM_H'
      }
    };
    //审批完成列表
    if(approvestatus){
      if(appContion){
        const find = {
          reqData:{
            ...appContion,
            audittype:'WF_CLAIMFORM_H'
          },
          ...obj
        }
        dispatch({
          type: 'statustable/readyfetched',
          payload: find,
        });
        return
      }
      dispatch({
        type: 'statustable/readyfetched',
        payload: obj,
      });
    }else{
      if(appContion){
        const find = {
          reqData:{
            ...appContion,
            audittype:'WF_CLAIMFORM_H'
          },
          ...obj
        }
        dispatch({
          type: 'statustable/readyfetch',
          payload: find,
        });
        return
      }
      dispatch({
        type: 'statustable/readyfetch',
        payload: obj,
      });
    }

  };
  //我的审批
  handlesearch = (e) =>{
    const { dispatch, form } = this.props;
    const { selectValue } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const { appcode,approvestatus,timeapprove } = values;
      let appContion = {}
      if(appcode || timeapprove){
        appContion = {
          billcode:appcode,
          starttime:timeapprove?timeapprove.format('YYYY-MM-DD'):''
        }
        this.setState({appContion})
      }
      if(approvestatus === '审批完成'){
        this.setState({
          approvestatus:true,
          selectedRowKeys:[],
          selectedRows:[],
          approveDis:false,
        })
        dispatch({
          type: 'statustable/readyfetched',
          payload:{
            pageSize:10,
            pageIndex:0,
            reqData:{
              ...appContion,
              audittype:'WF_CLAIMFORM_H'
            }
          },
        });
      }else{
        this.setState({
          approvestatus:false,
          selectedRowKeys:[],
          selectedRows:[],
          approveDis:false,
        })
        dispatch({
          type: 'statustable/readyfetch',
          payload:{
            pageSize:10,
            pageIndex:0,
            reqData:{
              ...appContion,
              audittype:'WF_CLAIMFORM_H'
            }
          },
        });
      }

    })
  }
  //跳转到审核
  handleApproval = (e,record)=>{
    e.preventDefault();
    router.push('/approval/myapproval/approvalcheck',{record});

  };

  handleApprovalCheck = (e,record)=>{
    e.preventDefault();
    router.push('/approval/myapproval/approvalcheck',{record});
  }
  //展开-收起
  toggleExame = () =>{
    const { examine } = this.state;
    this.setState({
      examine: !examine,
    });
  }
  //重置方法
  handleFormReset = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    this.setState({
      userFind:{},
    })
    dispatch({
      type: 'statustable/fetch',
      payload: {
        pageSize:10,
        reqData:{
          audittype:'WF_CLAIMFORM_H'
        },
      }
    });
    form.resetFields();
  };

  handleFormResetA = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    this.setState({
      appContion:{},
    })
    dispatch({
      type: 'statustable/readyfetch',
      payload:{
        pageSize:10,
        pageIndex:0,
        reqData:{
          audittype:'WF_CLAIMFORM_H'
        }
      },
    });
    form.resetFields();
  };

  handeChange = (value)=>{
    this.setState({approveState:value})
  }

  approvalAll = ()=>{
    this.setState({
      approvalVisible:true,
    })
  }

  onSelectChange = (selectedRowKeys,selectedRows) => {
    const { approvestatus } = this.state
    if(approvestatus){
      return
    }
    this.setState({ selectedRowKeys,selectedRows });
    if(selectedRowKeys.length){
      this.setState({
        approveDis:true
      })
    }else{
      this.setState({
        approveDis:false,

      })
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      statustable: { data,dataList }
    } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const onApprove = {
      onOk:(res)=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'statustable/readyfetch',
          payload:{
            pageSize:10,
            pageIndex:0,
            reqData:{
              audittype:'WF_CLAIMFORM_H'
            }
          },
        });
        this.setState({
          approvalVisible:false,
          approveDis:false,
          selectedRowKeys:[],
          selectedRows:[]
        })
      },
      onCancel:()=>{
        this.setState({
          approvalVisible:false,
          approveDis:false,
          selectedRowKeys:[],
          selectedRows:[]
        })
      }
    }
    const approveData = {
      record:this.state.selectedRows,
      visible:this.state.approvalVisible
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
            <Form onSubmit={this.handlesearch} layout="inline">
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  {/* <FormItem label={formatMessage({id:'valid.applicant'})}>
                        {
                          getFieldDecorator('code')(
                            <AutoComplete
                              dataSource={options}
                              style={{width:'200px',marginLeft:'13px'}}
                              onFocus={()=>{
                                const { dispatch } = this.props;
                                dispatch({
                                  type:'statustable/findManager',
                                  payload: {
                                    pageSize:1000
                                  },
                                  callback:(res)=>{
                                    if (res){
                                      this.setState({
                                        dataValue: res
                                      });
                                    }
                                  }
                                })
                              }}
                               onSelect={async (value,option)=>{
                                 await this.setState({
                                   lp_id: Number(option.key)
                                 });
                               }}
                              filterOption={(inputValue, option) =>
                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                              }
                              placeholder='请选择申请人' />)
                        }
                      </FormItem>*/}
                  <Form.Item label='单据号'>
                    {getFieldDecorator('appcode', {
                    })(
                      <Input placeholder={'单据号'} style={{marginLeft:'14px',width:'200px'}}/>
                    )}
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
                  <Form.Item label='状态'>
                    {getFieldDecorator('approvestatus', {
                      initialValue:this.state.approveState
                    })(
                      <Select  style={{width:'200px'}} defaultValue='待审批' onChange={this.handeChange}>
                        <Option value="待审批">待审批</Option>
                        <Option value="审批完成">审批完成</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                {/*查询*/}
                {formatMessage({id:'validation.query'})}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormResetA}>
                {/*重置*/}
                取消
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleExame}>
                 {this.state.examine?<span>
                   {/*收起*/}
                   {formatMessage({id:'valid.Pack.up'})}
                   <Icon type="up" /></span>:<span>
                   {/*展开*/}
                   {formatMessage({id:'valid.Pack.open'})}
                   <Icon type="down" /></span>}
              </a>
            </span>
                </Col>
              </Row>
              {
                this.state.examine?
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    {/* <Col md={8} sm={24}>
                          <Form.Item label='申请状态'>
                            {getFieldDecorator('statecode', {
                            })(
                              <Select placeholder={formatMessage({id:'validation.state'})}  style={{width:'200px'}} onChange={this.onSelectValue}>
                                <Option value={0}>{formatMessage({id:'valid.pending'})}</Option>
                                <Option value={1}>{formatMessage({id:'valid.approvaled'})}</Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>*/}
                    <Col>
                      {/*申请时间*/}
                      <FormItem label={formatMessage({id:'valid.Application.time'})}>
                        {getFieldDecorator('timeapprove')(<DatePicker style={{width:'200px'}}/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  :''
              }
            </Form>
            <div style={{margin:'20px 0'}}>
              <Button  disabled={!this.state.approveDis} onClick={this.approvalAll} size='default' type="primary" >
                批量审批
              </Button>
            </div>
            <ApproveCheckad on={onApprove} data={approveData}/>
            <NormalTable
              rowSelection={rowSelection}
              data={ dataList }
              loading={loading}
              columns={this.columns2}
              // pageStatus={ApprStatus}
              // scroll={Apprall?{ y: 540 }:{}}
              onChange={this.handleStandard}
              style={{marginTop:'20px'}}
            />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default MyApproval;

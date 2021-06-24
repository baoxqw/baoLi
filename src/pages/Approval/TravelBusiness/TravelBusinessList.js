import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import storage from '@/utils/storage'
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
  Divider,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
  message,
  Switch,
  Popconfirm,
  Transfer,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ApproveCheck from '@/pages/Approval/TravelBusiness/ApproveCheck'

import router from 'umi/router';
import moment from 'moment';
import styles from '../../System/UserAdmin.less';
const { Option } = Select;
const FormItem = Form.Item;

@connect(({ TBL, loading }) => ({
  TBL,
  loading: loading.models.TBL,

}))
@Form.create()

class TravelBusinessList extends PureComponent {
  state = {
    conditions:[],
    examine:false,
    approveState:'待审批',
    approvestatus:false,
    appContion:{},
    selectedRowKeys:[],
    selectedRows:[],
    approveDis:false,
    approvalVisible:false,
  };

  columns = [
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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'TBL/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
        reqData:{
          audittype:'WF_TRAVELCLAIMFORM_H',
          //version:1,
        }
      }
    })
  }

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
        audittype:'WF_TRAVELCLAIMFORM_H'
      }
    };
    //审批完成列表
    if(approvestatus){
      if(appContion){
        const find = {
          reqData:{
            ...appContion,
            audittype:'WF_TRAVELCLAIMFORM_H'
          },
          ...obj
        }
        dispatch({
          type: 'TBL/fetched',
          payload: find,
        });
        return
      }
      dispatch({
        type: 'TBL/fetched',
        payload: obj,
      });
    }else{
      if(appContion){
        const find = {
          reqData:{
            ...appContion,
            audittype:'WF_TRAVELCLAIMFORM_H'
          },
          ...obj
        }
        dispatch({
          type: 'TBL/fetch',
          payload: find,
        });
        return
      }
      dispatch({
        type: 'TBL/fetch',
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
          type: 'TBL/fetched',
          payload:{
            pageSize:10,
            pageIndex:0,
            reqData:{
              ...appContion,
              audittype:'WF_TRAVELCLAIMFORM_H'
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
          type: 'TBL/fetch',
          payload:{
            pageSize:10,
            pageIndex:0,
            reqData:{
              ...appContion,
              audittype:'WF_TRAVELCLAIMFORM_H'
            }
          },
        });
      }

    })
  }
  //跳转到审核
  handleApproval = (e,record)=>{
    e.preventDefault();
    router.push('/approval/travelbusiness/check',{record});
  };
  handleApprovalCheck = (e,record)=>{
    e.preventDefault();
    router.push('/approval/travelbusiness/check',{record});
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
  //取消
  handleFormResetA = () => {
    const { dispatch, form } = this.props;
    dispatch({
      type:'TBL/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
        reqData:{
          audittype:'WF_TRAVELCLAIMFORM_H',
          //version:1,
        }
      }
    })
    form.resetFields();
  };

  //展开-收起
  toggleExame = () =>{
    const { examine } = this.state;
    this.setState({
      examine: !examine,
    });
  }

  handeChange = (value)=>{
    this.setState({approveState:value})
  }

  approvalAll = ()=>{
    this.setState({
      approvalVisible:true,
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
      loading,
      TBL:{fetchData}
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
          type:'TBL/fetch',
          payload:{
            pageIndex:0,
            pageSize:10,
            reqData:{
              audittype:'WF_TRAVELCLAIMFORM_H',
              //version:1,
            }
          }
        })
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
                      <Select  style={{width:'200px'}} onChange={this.handeChange}>
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
          <ApproveCheck on={onApprove} data={approveData}/>
            <NormalTable
              rowSelection={rowSelection}
              loading={loading}
              data={fetchData}
              columns={this.columns}
              onChange={this.handleStandard}
            />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TravelBusinessList;

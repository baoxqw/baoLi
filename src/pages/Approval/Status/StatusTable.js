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
  Divider,
  InputNumber,
  Radio,
  Icon,
  Tabs,
  Tooltip,
  Modal,
  message,
  Transfer, Badge, Popconfirm, AutoComplete,
} from 'antd';
import moment from 'moment';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import WorkApproval from '@/pages/Approval/Status/WorkApproval';
import router from 'umi/router';
import styles from '../../System/UserAdmin.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['没审批', '审批中', '已通过', '未通过'];
const { Option } = Select;
@connect(({ statustable, loading }) => ({
  statustable,
  loading: loading.models.statustable,
}))
@Form.create()
class statusTable extends PureComponent {
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
    approveState:'待审批'
  };
  columns = [
    {
      // title: '单据号',
      title: formatMessage({ id: 'valid.Document' }),
      dataIndex: 'billCode',
    },
    {
      // title: '当前审批人',
      title: formatMessage({ id: 'valid.Current.approver' }),
      dataIndex: 'toUserName',
    },
    {
      // title: '申请时间',
      title: formatMessage({ id: 'valid.Application.time' }),
      dataIndex: 'startTime',
    },
    {
      // title: '完成时间',
      title: formatMessage({ id: 'valid.finish.time' }),
      dataIndex: 'completeTime',
    },
    {
      // title: '状态',
      title: formatMessage({ id: 'validation.state' }),
      dataIndex: 'auditStatus',
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
      // title: '操作',
      title: formatMessage({ id: 'validation.operation' }),
      dataIndex: 'caozuo',
      // fixed:'right',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title='撤销之后，将变为初始状态，确定撤销吗？' onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">撤销</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleApplication(record)}>{formatMessage({ id: 'valid.look' })}</a>
        </Fragment>
      ),
    },
  ];


  //初始数据
  componentDidMount() {
    const { dispatch } = this.props;
    //申请
    dispatch({
      type: 'statustable/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
        reqData:{
          audittype:'WF_CLAIMFORM_H'
        }
      }
    });
  }
  //撤销
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const { userFind } = this.state;
    const obj = {
      reqData:{
        billid:record.billId,
        audittype:record.type,
        processinstanceid:record.processInstanceId,
      }
    }
    dispatch({
      type: 'statustable/remove',
      payload: obj,
      callback:(res)=>{
        dispatch({
          type: 'statustable/fetch',
          payload:{
            pageIndex:0,
            pageSize:10,
            reqData:{
              audittype:'WF_CLAIMFORM_H',
              ...userFind
            }
          }
        });
      }
    })
  };
  //我的申请 查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const { billcode,state,time } = values;
      //let starttime;
      //let endtime;
      const userFind = {
        billcode:billcode,
        auditstatus:state,
        starttime:time?time.format('YYYY-MM-DD'):'',
        //endtime
      }
      this.setState({
        userFind
      })
      const obj = {
        pageIndex:0,
        pageSize:10,
        reqData:{
          ...userFind,
          audittype:'WF_CLAIMFORM_H'
        }
      }
      dispatch({
        type:'statustable/fetch',
        payload:obj
      })
    })
  }
  //分页
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { userFind } = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    if(userFind){
      const find = {
        reqData:{
          ...userFind,
          audittype:'WF_CLAIMFORM_H'
        },
        ...obj
      }
      dispatch({
        type: 'statustable/fetch',
        payload: find,
      });
      return
    }
    dispatch({
      type: 'statustable/fetch',
      payload: {
        ...obj,
        reqData:{
          audittype:'WF_CLAIMFORM_H'
        },
      },
    });
  };
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

  // 跳转到我的查看申请
  handleApplication = (record)=>{
    this.props.history.push('/approval/statustable/application',{
      query:record
    });
  };
  //展开-收起

  toggleStart = () =>{
    const { applystart } = this.state;
    this.setState({
      applystart: !applystart,
    });
  }
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
        pageIndex:0,
        pageSize:10,
        reqData:{
          audittype:'WF_CLAIMFORM_H'
        },
      }
    });
    form.resetFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      statustable: { data,dataList }
    } = this.props;
    const options = this.state.dataValue.map(group => (
      <Option key={group.id}>{group.name}</Option>
    ));
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="绩效申请" key="1">
              <Form onSubmit={this.findList} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:'10px'}}>
                  <Col md={8} sm={24}>
                    {/*申请类型*/}
                    <Form.Item label='单据号'>
                      {getFieldDecorator('billcode', {
                      })(
                        <Input placeholder={'单据号'} style={{marginLeft:'14px',width:'200px'}}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={24}>
                    {/*状态*/}
                    <Form.Item label={formatMessage({id:'validation.state'})}>
                      {getFieldDecorator('state', {
                      })(
                        <Select placeholder={formatMessage({id:'validation.state'})} style={{width:'200px'}}>
                          {/*   <Option value="WAIT_AUDIT">待审批</Option>
                    <Option value="AGREE_AUDIT">已同意申请</Option>
                    <Option value="REJECT_AUDIT">已拒绝申请 </Option>
                    <Option value="CANCEL">已取消 </Option>*/}
                          <Option value="WAIT_AUDIT">{formatMessage({id:'valid.pending'})}</Option>
                          <Option value="AGREE_AUDIT">{formatMessage({id:'valid.Approved.application'})}</Option>
                          <Option value="REJECT_AUDIT">{formatMessage({id:'valid.Rejected.application'})} </Option>
                          <Option value="CANCEL">{formatMessage({id:'valid.cancelled'})} </Option>
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
              <Button style={{ marginLeft: 8 }} onClick={(e)=>this.handleFormReset(e)}>
                {/*重置*/}
                取消
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleStart}>
                {this.state.applystart?<span>
                  {/*收起*/}
                  {formatMessage({id:'valid.Pack.up'})}
                  <Icon type="up" /></span>:<span>
                  {/*展开 */}
                  {formatMessage({id:'valid.Pack.open'})}
                  <Icon type="down" /></span>}
              </a>
            </span>
                  </Col>
                  {this.state.applystart?
                    <Col  xl={{ span: 12, offset: 0 }} md={12} sm={24}>
                      {/*申请时间*/}
                      <FormItem label={formatMessage({id:'valid.Application.time'})}>
                        {getFieldDecorator('time')(<DatePicker style={{width:'200px'}} />)}
                      </FormItem>
                    </Col>
                    :''}
                </Row>
              </Form>
              <NormalTable
                data={data}
                loading={loading}
                columns={this.columns}
                // pageStatus={ApplStatus}
                // scroll={Applall?{ y: 540 }:{}}
                onChange={this.handleStandardTableChange}
                style={{marginTop:'20px'}}
              />
            </TabPane>
            <TabPane tab="差旅费申请" key="2">
             <WorkApproval />
            </TabPane>
          </Tabs>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default statusTable;

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Divider ,
  Button,
  Card,
  Checkbox,
  InputNumber,
  Tree,
  Icon,
  Table,
  Modal,
  Select,
  message,
  Popconfirm,
} from 'antd';

import moment from 'moment';

const { TextArea } =  Input;

@connect(({ RR, loading }) => ({
  RR,
  loading: loading.models.RR,
}))
@Form.create()
class ModalReview extends PureComponent {
  state = {

  };

  aggree = (onAggree)=>{
    const { form ,data:{record} } = this.props;
    form.validateFields((err, fieldsValue)=>{
      const obj = {
        userDefineStrGroup:[record.taskId,fieldsValue.opinion]
      };
      if(typeof onAggree === "function"){
        onAggree(obj)
      }
      /*dispatch({
        type:'MR/check',
        payload:obj,
        callback:(res)=>{

          message.success('审核同意',1,()=>{
            this.setState({
              reviewVisible: false,
              agreeStatus:false
            });
            dispatch({
              type:'MR/fetch',
              payload:{
                reqData:{
                  pageIndex:0,
                  pageSize:10
                }
              }
            })
          })
        }
      })*/
    })
  }

  refuse = (onRefuse)=>{
    const { form ,data:{record} } = this.props;
    form.validateFields((err, fieldsValue)=>{
      const obj = {
        userDefineStrGroup:[record.taskId,fieldsValue.opinion]
      };
      if(typeof onRefuse === "function"){
        onRefuse(obj)
      }
      /*dispatch({
        type:'MR/refuse',
        payload:obj,
        callback:(res)=>{

          message.success('审核拒绝',1,()=>{
            this.setState({
              reviewVisible: false,
              refuseStatus: false,
            });
            dispatch({
              type:'MR/fetch',
              payload:{
                reqData:{
                  pageIndex:0,
                  pageSize:10
                }
              }
            })
          })
        }
      })*/
    })
  }

  return = (onReturn)=>{
    const { form ,data:{record} } = this.props;
    form.validateFields((err, fieldsValue)=>{
      const obj = {
        userDefineStrGroup:[record.taskId,fieldsValue.opinion]
      };
      if(typeof onReturn === "function"){
        onReturn(obj)
      }
      /*dispatch({
        type:'MR/return',
        payload:obj,
        callback:(res)=>{
          console.log("退回",res);
          message.success('审核退回',1,()=>{
            this.setState({
              reviewVisible: false,
              returnStatus: false,
            });
            dispatch({
              type:'MR/fetch',
              payload:{
                reqData:{
                  pageIndex:0,
                  pageSize:10
                }
              }
            })
          })
        }
      })*/
    })
  };

  reviewHandleCancel = (onReviewHandleCancel)=>{
    if(typeof onReviewHandleCancel === "function"){
      onReviewHandleCancel()
    }
  }

  render() {
    const {
      form:{getFieldDecorator},
      data,
      on
    } = this.props;

    const {
      record,
      agreeStatus,
      refuseStatus,
      returnStatus,
      visible
    } = data;
    const { onReviewHandleCancel,onAggree,onRefuse,onReturn } = on;
    return (
      <div>
        <Modal
          title="审批项目里程碑节点填报"
          destroyOnClose
          visible={visible}
          //onOk={this.reviewHandleOk}
          width="70%"
          onCancel={()=>this.reviewHandleCancel(onReviewHandleCancel)}
          footer={[
            <Button type="primary" loading={ agreeStatus } key={1} onClick={()=>this.aggree(onAggree)}>同意</Button>,
            <Button  style={{backgroundColor:'red',color:'#fff'}} key={2} loading={ refuseStatus }  onClick={()=>this.refuse(onRefuse)}>拒绝</Button>,
            <Button type="primary" loading={ returnStatus } key={3}  onClick={()=>this.return(onReturn)}>退回</Button>
          ]}
        >
          <Card bordered={false}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="单据号">
                  {getFieldDecorator('billcode',{
                    initialValue:record.billcode?record.billcode:''
                  })(<Input placeholder="请填写单据号" disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="单据日期">
                  {getFieldDecorator('billdate',{
                    initialValue:record.billdate?moment(record.billdate):null
                  })(
                    <DatePicker  placeholder="请选择单据日期" style={{ width: '100%' }} disabled/>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="部门">
                  {getFieldDecorator('deptname', {
                    initialValue:record.deptname?record.deptname:''
                  })(<Input disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="报销人">
                  {getFieldDecorator('psnId',{
                    initialValue:record.name
                  })(
                    <Input disabled/>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="所属项目">
                  {getFieldDecorator('ownproject',{
                    initialValue: record.ownprojectname?record.ownprojectname:''
                  })(<Input disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="状态">
                  {getFieldDecorator('status',{
                    initialValue:record.status?record.status:''
                  })(
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('memo',{
                    initialValue:record.memo?record.memo:''
                  })(
                    <TextArea rows={3} disabled/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label="部门领导审核意见">
                  {getFieldDecorator('opinion',{
                  })(
                    <TextArea rows={3}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Modal>
      </div>
    );
  }
}

export default ModalReview;


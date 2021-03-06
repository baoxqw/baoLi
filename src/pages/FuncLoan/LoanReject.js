import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Modal,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  TreeSelect,
} from 'antd';

import moment from 'moment';
import  { getDaysBetween }  from '@/pages/tool/DateTimeTool'
import  { getFloat }  from '@/pages/tool/FormatNumber'
import moneyToNumValue from '@/pages/tool/stringToMoney';
const { TextArea } = Input;
const { Option } = Select;

@connect(({ Cre,loading }) => ({
  Cre,
  loading:loading.models.Cre
}))
@Form.create()
class LoanReject extends PureComponent {
  state = {
    BStatus:false,
    dataStatus:true
  };

  onSave = (onSave)=>{
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      form,
    } = this.props;
    const { visible,record } = data;
    console.log('---record',record)
    const { BStatus, } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }

      const en = {
        fee:values.fee?Number(moneyToNumValue(values.fee)):null
      }
      const obj = {
        reqData:{
          ...values,
          eventTime:(values.eventTime).format('YYYY-MM-DD HH:mm:ss'),
          failReasonCode:values.code?values.code:null,
          failReasonMessage:values.message?values.message:null,
          loanAmount:values.loanAmount?moneyToNumValue(values.loanAmount):null,
          extendInfo:values.fee?JSON.stringify(en):null,
          loanId:record.id,
          channel:'SHNF',
        }

      };
      console.log("obj",obj)
      this.setState({
        BStatus:true
      })
      if(typeof onSave === 'function'){
        onSave(obj,this.clear);
      }
    })
  };

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.clear)
    }
  };

  clear = (status)=> {
    if(status){
      this.setState({
        BStatus:false
      })
      return
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      BStatus:false,
      dataStatus:true
    })
  }

  changeAmount = (value)=>{
    const { form } = this.props;
    const loanAmountApple = form.getFieldValue("loanAmountApple")
    const fee = Number(loanAmountApple) - Number(value)
    form.setFieldsValue({
      fee
    })
  }

  onChangeDate = (date,dateString)=>{
    const { form } = this.props;
    const eventTime = date.format("YYYY-MM-DD");
    const statementPaymentTime = form.getFieldValue("statementPaymentTime").format("YYYY-MM-DD");
    const day = getDaysBetween(eventTime, statementPaymentTime); //????????????
    let loanAmountApple = form.getFieldValue("loanAmountApple"); //??????????????????
    loanAmountApple = moneyToNumValue(loanAmountApple.toString());
    const rate = form.getFieldValue("rate"); //?????????
    const jieguo = (Number(loanAmountApple || 0) * Number(rate || 0) * day) / 360;
    const fee = getFloat(jieguo, 2);
    const loanAmount = Number(loanAmountApple) - fee;

    form.setFieldsValue({
      fee:fee.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,'),
      loanAmount:loanAmount.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,'),
      loanAmountApple:Number(loanAmountApple).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
    })
  }

  onSelectStatus = (value)=>{
    if(value === 'FAILED'){
      this.setState({
        dataStatus:false
      })
    }else{
      const { form } = this.props;
      form.setFieldsValue({
        code:null,
        message:null
      })
      this.setState({
        dataStatus:true
      })
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      on
    } = this.props;

    const { visible,record } = data;
    const { onSave,onCancel } = on;

    const { dataStatus } = this.state;

    return (
      <Modal
        title={"??????"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='???????????????'>
              {getFieldDecorator('institutionLoanNo',{
                rules: [{
                  required: true,
                  message:'???????????????'
                }]
              })(
                <Input placeholder="????????????????????????"/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="??????????????????">
              {getFieldDecorator('status',{
                rules: [{
                  required: true,
                  message:'??????????????????'
                }]
              })( <Select  style={{ width: '100%' }} placeholder={'???????????????'} onSelect={this.onSelectStatus}>
                {/*<Option value="FAILED">????????????</Option>*/}
                <Option value="SUCCESS">????????????</Option>
                <Option value="FAILED">????????????</Option>
              </Select>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="??????????????????">
              {getFieldDecorator('eventTime',{
                rules: [{
                  required: true,
                  message:'??????????????????'
                }]
              })( <DatePicker placeholder="???????????????????????????" showTime style={{width:'100%'}} onChange={this.onChangeDate}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='?????????????????????'>
              {getFieldDecorator('statementPaymentTime',{
                initialValue:record.statementPaymentTime?moment(record.statementPaymentTime,"YYYY-MM-DD HH:mm:ss"):[]
              })(
                <DatePicker showTime placeholder="???????????????????????????" style={{width:'100%'}} disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="??????????????????">
              {getFieldDecorator('rate',{
                rules: [{
                  required: true,
                  message:'??????????????????'
                }],
                initialValue:record.rate
              })( <Input placeholder={'????????????????????????'} disabled/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='??????????????????'>
              {getFieldDecorator('loanAmountApple',{
                initialValue: record.loanAmount?Number(record.loanAmount).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,'):null
              })(
                <Input placeholder="???????????????????????????" disabled/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('fee',{
              })(<Input placeholder="?????????????????????" disabled/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="????????????(????????????)">
              {getFieldDecorator('loanAmount',{
                rules: [{
                  required: true,
                  message:'????????????'
                }]
              })( <Input placeholder={'?????????????????????'} type={Number} disabled/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="????????????????????????">
              {getFieldDecorator('loanApplyId',{
                initialValue:record.loanApplyNo,
                rules: [{
                  required: true,
                  message:'????????????????????????'
                }]
              })(<Input placeholder="?????????????????????????????????" disabled/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='????????????'>
              {getFieldDecorator('channel',{
                initialValue:'????????????????????????'
                // rules: [{
                //   required: true,
                //   message:'????????????'
                // }]
              })(
                <Input placeholder="?????????????????????" disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('code',{
              })(<Input placeholder="???????????????(????????????:64???)" maxLength={64} disabled={dataStatus}/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>

          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={24} md={24} sm={24}>
            <Form.Item label="??????????????????">
              {getFieldDecorator('message', {
              })(<TextArea rows={4} placeholder={'??????????????????(????????????:256???)'} maxLength={256} disabled={dataStatus}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default LoanReject;


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
    const day = getDaysBetween(eventTime, statementPaymentTime); //相差天数
    let loanAmountApple = form.getFieldValue("loanAmountApple"); //申请放款金额
    loanAmountApple = moneyToNumValue(loanAmountApple.toString());
    const rate = form.getFieldValue("rate"); //年收益
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
        title={"支用"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='机构借据号'>
              {getFieldDecorator('institutionLoanNo',{
                rules: [{
                  required: true,
                  message:'机构借据号'
                }]
              })(
                <Input placeholder="请输入机构借据号"/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="支用放款状态">
              {getFieldDecorator('status',{
                rules: [{
                  required: true,
                  message:'支用放款状态'
                }]
              })( <Select  style={{ width: '100%' }} placeholder={'请选择状态'} onSelect={this.onSelectStatus}>
                {/*<Option value="FAILED">放款拒绝</Option>*/}
                <Option value="SUCCESS">放款成功</Option>
                <Option value="FAILED">放款失败</Option>
              </Select>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="实际放款日期">
              {getFieldDecorator('eventTime',{
                rules: [{
                  required: true,
                  message:'实际放款日期'
                }]
              })( <DatePicker placeholder="请输入实际放款日期" showTime style={{width:'100%'}} onChange={this.onChangeDate}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='结算单付款日期'>
              {getFieldDecorator('statementPaymentTime',{
                initialValue:record.statementPaymentTime?moment(record.statementPaymentTime,"YYYY-MM-DD HH:mm:ss"):[]
              })(
                <DatePicker showTime placeholder="带入结算单付款日期" style={{width:'100%'}} disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="执行年化费率">
              {getFieldDecorator('rate',{
                rules: [{
                  required: true,
                  message:'执行年化费率'
                }],
                initialValue:record.rate
              })( <Input placeholder={'带入执行年化费率'} disabled/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='申请放款金额'>
              {getFieldDecorator('loanAmountApple',{
                initialValue: record.loanAmount?Number(record.loanAmount).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,'):null
              })(
                <Input placeholder="请输入申请放款金额" disabled/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label="服务费用">
              {getFieldDecorator('fee',{
              })(<Input placeholder="请输入服务费用" disabled/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="放款金额(单位：元)">
              {getFieldDecorator('loanAmount',{
                rules: [{
                  required: true,
                  message:'放款金额'
                }]
              })( <Input placeholder={'请输入放款金额'} type={Number} disabled/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="阿里支用申请单号">
              {getFieldDecorator('loanApplyId',{
                initialValue:record.loanApplyNo,
                rules: [{
                  required: true,
                  message:'阿里支用申请单号'
                }]
              })(<Input placeholder="请输入阿里支用申请单号" disabled/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='对接渠道'>
              {getFieldDecorator('channel',{
                initialValue:'上海国立商业保理'
                // rules: [{
                //   required: true,
                //   message:'对接渠道'
                // }]
              })(
                <Input placeholder="请输入对接渠道" disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="拒绝原因码">
              {getFieldDecorator('code',{
              })(<Input placeholder="拒绝原因码(字数限制:64位)" maxLength={64} disabled={dataStatus}/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>

          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={24} md={24} sm={24}>
            <Form.Item label="拒绝原因描述">
              {getFieldDecorator('message', {
              })(<TextArea rows={4} placeholder={'拒绝原因描述(字数限制:256位)'} maxLength={256} disabled={dataStatus}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default LoanReject;


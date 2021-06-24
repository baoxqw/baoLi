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
  Checkbox,
  TreeSelect,
} from 'antd';

import moneyToNumValue from '@/pages/tool/stringToMoney';
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
@connect(({ Cre,loading }) => ({
  Cre,
  loading:loading.models.Cre
}))
@Form.create()
class CreditReject extends PureComponent {
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
        customerId:values.customerId,
        loanLimitQuota:values.loanLimitQuota?moneyToNumValue(values.loanLimitQuota):null,
      }

      if(values.quotaChangeReason){
        en.quotaChangeReason = values.quotaChangeReason
      }

      const obj = {
        reqData:{
          ...values,
          endDate:values.endDate?(values.endDate).format('YYYY-MM-DD HH:mm:ss'):null,
          startDate:values.startDate?(values.startDate).format('YYYY-MM-DD HH:mm:ss'):null,
          eventTime:values.eventTime?(values.eventTime).format('YYYY-MM-DD HH:mm:ss'):null,
          quotaAmount:values.quotaAmount?moneyToNumValue(values.quotaAmount):null,
          failReasonCode:values.code?values.code:null,
          failReasonMessage:values.message?values.message:null,
          creditTermUnit:values.creditTermUnit && values.creditTermUnit.length?values.creditTermUnit:null,
          extendInfo:JSON.stringify(en),
          creditId:record.id,
          channel:'SHNF',
          amountRatio:values.amountRatio?values.amountRatio.toString():"",
          loanLimitQuota:values.loanLimitQuota?moneyToNumValue(values.loanLimitQuota):null
        }
      };

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

  onSelectStatus = (value)=>{
    if(value === 'REJECTED'){
      const { form } = this.props;
      form.setFieldsValue({
        quotaAmount:null,
        creditTerm:null,
        creditTermUnit:[],
        startDate:null,
        endDate:null,
        customerId:null,
        loanLimitQuota:null,
        quotaChangeReason:null
      })
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

  onFocusQuotaAmount = ()=>{
    const { form } = this.props;
    form.setFieldsValue({
      quotaAmount:null
    })
  }

  onBlurQuotaAmount = ()=>{
    const { form } = this.props;
    const quotaAmount = form.getFieldValue("quotaAmount");
    if(isNaN(Number(quotaAmount)) || quotaAmount === null){
      form.setFieldsValue({
        quotaAmount:null
      })
    }else{
      form.setFieldsValue({
        quotaAmount:Number(quotaAmount).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
      })
    }
  }

  onFocusLoanLimitQuota = ()=>{
    const { form } = this.props;
    form.setFieldsValue({
      loanLimitQuota:null
    })
  }

  onBlurLoanLimitQuota = ()=>{
    const { form } = this.props;
    const loanLimitQuota = form.getFieldValue("loanLimitQuota");
    if(isNaN(Number(loanLimitQuota)) || loanLimitQuota === null){
      form.setFieldsValue({
        loanLimitQuota:null
      })
    }else{
      form.setFieldsValue({
        loanLimitQuota:Number(loanLimitQuota).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
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

    const { dataStatus } = this.state;

    const { visible,record } = data;
    const { onSave,onCancel } = on;

    let amountRatio = null;

    if(record && record.platformPaymentCollectionAmountWithCoreCompany1Year && record.platformTotalSettlementAmountWithCoreCompany1Year ){
      amountRatio = record.platformPaymentCollectionAmountWithCoreCompany1Year / record.platformTotalSettlementAmountWithCoreCompany1Year * 100
    }

    return (
      <Modal
        title={"审核"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='机构授信编号'>
              {getFieldDecorator('institutionCreditNo',{
                rules: [{
                  required: true,
                  message:'机构授信编号'
                }]
              })(
                <Input placeholder="请输入机构授信编号"/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="授信状态">
              {getFieldDecorator('status',{
                rules: [{
                  required: true,
                  message:'授信状态'
                }]
              })(<Select  style={{ width: '100%' }} placeholder={'请选择状态'} onSelect={this.onSelectStatus}>
                  <Option value="QUALIFIED">授信成功</Option>
                  <Option value="REJECTED">授信拒绝</Option>
              </Select >)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="实际授信时间">
              {getFieldDecorator('eventTime',{
                rules: [{
                  required: true,
                  message:'实际授信时间'
                }]
              })( <DatePicker showTime style={{width:'100%'}} />)}
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
            <Form.Item label="授信额度金额(单位：元)">
              {getFieldDecorator('quotaAmount',{
                rules: [{
                  required: dataStatus,
                  message:'授信额度金额'
                }]
              })( <Input placeholder="请输入授信额度金额" onFocus={this.onFocusQuotaAmount} onBlur={this.onBlurQuotaAmount} disabled={!dataStatus}/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="授信期限">
              {getFieldDecorator('creditTerm',{
              })( <Input placeholder="请输入授信期限" type={'number'} disabled={!dataStatus}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='授信期限单位'>
              {getFieldDecorator('creditTermUnit',{
              })(
                <Select  style={{ width: '100%' }} placeholder={'请选择授信期限单位'} disabled={!dataStatus}>
                <Option value="Y">年</Option>
                <Option value="M">月</Option>
                <Option value="D">日</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="授信有效期开始日">
              {getFieldDecorator('startDate',{
              })( <DatePicker showTime style={{width:'100%'}} disabled={!dataStatus}/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="授信有效期结束日">
              {getFieldDecorator('endDate',{
              })(<DatePicker showTime  style={{width:'100%'}} disabled={!dataStatus}/>)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='阿里客户'>
              {getFieldDecorator('customerId',{
                initialValue:record.customerId
              })(
                <Input placeholder="请输入阿里客户" disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='单笔支用限额（单位：元）'>
              {getFieldDecorator('loanLimitQuota',{
                rules: [{
                  required: dataStatus,
                  message:'单笔支用限额'
                }]
              })(
                <Input placeholder="请输入单笔支用限额" onFocus={this.onFocusLoanLimitQuota} onBlur={this.onBlurLoanLimitQuota} disabled={!dataStatus}/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='额度修改原因'>
              {getFieldDecorator('quotaChangeReason',{

              })(
                <Input placeholder="请输入额度修改原因"  disabled={!dataStatus}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='阿里授信申请单号'>
              {getFieldDecorator('creditApplyNo',{
                initialValue:record.creditApplyNo,
                rules: [{
                  required: true,
                  message:'阿里授信申请单号'
                }]
              })(
                <Input placeholder="请输入阿里授信申请单号" disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='线上年回款比例(%)'>
              {getFieldDecorator('amountRatio',{
                initialValue:amountRatio?amountRatio.toFixed(2):null
              })(
                <Input placeholder="线上年回款比例" type={Number} disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='拒绝原因码'>
              {getFieldDecorator('code',{
              })(
                <Input placeholder="拒绝原因码(字数限制:64位)" maxLength={64} disabled={dataStatus}/>
              )}
            </Form.Item>
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

export default CreditReject;


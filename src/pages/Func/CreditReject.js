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
            <Form.Item label='??????????????????'>
              {getFieldDecorator('institutionCreditNo',{
                rules: [{
                  required: true,
                  message:'??????????????????'
                }]
              })(
                <Input placeholder="???????????????????????????"/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('status',{
                rules: [{
                  required: true,
                  message:'????????????'
                }]
              })(<Select  style={{ width: '100%' }} placeholder={'???????????????'} onSelect={this.onSelectStatus}>
                  <Option value="QUALIFIED">????????????</Option>
                  <Option value="REJECTED">????????????</Option>
              </Select >)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="??????????????????">
              {getFieldDecorator('eventTime',{
                rules: [{
                  required: true,
                  message:'??????????????????'
                }]
              })( <DatePicker showTime style={{width:'100%'}} />)}
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
            <Form.Item label="??????????????????(????????????)">
              {getFieldDecorator('quotaAmount',{
                rules: [{
                  required: dataStatus,
                  message:'??????????????????'
                }]
              })( <Input placeholder="???????????????????????????" onFocus={this.onFocusQuotaAmount} onBlur={this.onBlurQuotaAmount} disabled={!dataStatus}/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('creditTerm',{
              })( <Input placeholder="?????????????????????" type={'number'} disabled={!dataStatus}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='??????????????????'>
              {getFieldDecorator('creditTermUnit',{
              })(
                <Select  style={{ width: '100%' }} placeholder={'???????????????????????????'} disabled={!dataStatus}>
                <Option value="Y">???</Option>
                <Option value="M">???</Option>
                <Option value="D">???</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="????????????????????????">
              {getFieldDecorator('startDate',{
              })( <DatePicker showTime style={{width:'100%'}} disabled={!dataStatus}/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="????????????????????????">
              {getFieldDecorator('endDate',{
              })(<DatePicker showTime  style={{width:'100%'}} disabled={!dataStatus}/>)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='????????????'>
              {getFieldDecorator('customerId',{
                initialValue:record.customerId
              })(
                <Input placeholder="?????????????????????" disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='????????????????????????????????????'>
              {getFieldDecorator('loanLimitQuota',{
                rules: [{
                  required: dataStatus,
                  message:'??????????????????'
                }]
              })(
                <Input placeholder="???????????????????????????" onFocus={this.onFocusLoanLimitQuota} onBlur={this.onBlurLoanLimitQuota} disabled={!dataStatus}/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='??????????????????'>
              {getFieldDecorator('quotaChangeReason',{

              })(
                <Input placeholder="???????????????????????????"  disabled={!dataStatus}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='????????????????????????'>
              {getFieldDecorator('creditApplyNo',{
                initialValue:record.creditApplyNo,
                rules: [{
                  required: true,
                  message:'????????????????????????'
                }]
              })(
                <Input placeholder="?????????????????????????????????" disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='?????????????????????(%)'>
              {getFieldDecorator('amountRatio',{
                initialValue:amountRatio?amountRatio.toFixed(2):null
              })(
                <Input placeholder="?????????????????????" type={Number} disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label='???????????????'>
              {getFieldDecorator('code',{
              })(
                <Input placeholder="???????????????(????????????:64???)" maxLength={64} disabled={dataStatus}/>
              )}
            </Form.Item>
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

export default CreditReject;


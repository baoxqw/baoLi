import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Modal,
  Form,
} from 'antd';

import NormalTable from '@/components/NormalTable';

@connect(({ Cre,loading }) => ({
  Cre,
  loading:loading.models.Cre
}))
@Form.create()
class LoanAgree extends PureComponent {
  state = {
    BStatus:false,
    pageStore:{},
  };

  onSave = (onSave)=>{
    if(typeof onSave === 'function'){
      onSave(this.clear);
    }
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
    })
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

    const columns = [
      {
        title: '接收时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '机构借据号',
        dataIndex: 'institutionLoanNo',
        key: 'institutionLoanNo',
      },
      {
        title: '支用放款状态',
        dataIndex: 'status',
        key: 'status',
        render:((text,record)=>{
          if(text === 'SUCCESS'){
            return '放款成功'
          }else if(text === 'REJECTED'){
            return '放款拒绝'
          }else if(text === 'FAILED'){
            return '放款失败'
          }
        })
      },
      {
        title: '实际放款时间',
        dataIndex: 'eventTime',
        key: 'eventTime',
      },
      {
        title: '对接渠道',
        dataIndex: 'channel',
        key: 'channel',
      },
      {
        title: '放款金额(单位：元)',
        dataIndex: 'loanAmount',
        key: 'loanAmount',
        render:((text,record)=>{
          if(text){
            return Number(text).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
          }else{
            return null
          }
        })
      },
      {
        title: '服务费用',
        dataIndex: 'fee',
        key: 'fee',
        render:((text,record)=>{
          if(text){
            return Number(text).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
          }else{
            return null
          }
        })
      },
      {
        title: '阿里支用申请单号',
        dataIndex: 'loanApplyId',
        key: 'loanApplyId',
      },
      {
        title: '拒绝原因码',
        dataIndex: 'failReasonCode',
        key: 'failReasonCode',
      },
      {
        title: '拒绝原因描述',
        dataIndex: 'failReasonMessage',
        key: 'failReasonMessage',
      },
      {
        title: '审批人',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '审批时间',
        dataIndex: 'userDate',
        key: 'userDate',
      },
      {
        title: '结果',
        dataIndex: 'resBody',
        key: 'resBody',
      },
      {
        title:'',
        dataIndex:'caozuo',
        width:1
      },
    ];
    return (
      <Modal
        title={"查看"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
       // onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
        footer={null}
      >
        <NormalTable
          columns={columns}
          dataSource={record}
          pagination={false}
        />
      </Modal>
    );
  }
}

export default LoanAgree;


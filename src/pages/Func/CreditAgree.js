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
  Icon,
  Button,
  Upload,
  TreeSelect,
} from 'antd';
import NormalTable from '@/components/NormalTable';


@connect(({ Cre,loading }) => ({
  Cre,
  loading:loading.models.Cre
}))
@Form.create()
class CreditAgree extends PureComponent {
  state = {
    BStatus:false,
    pageStore:{},
    deleteFile:[],
    fileList:[],
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
    const { deleteFile,fileList } = this.state
    const { visible,record } = data;
    console.log('---record',record)
    const { onSave,onCancel } = on;
    const props = {
      onRemove: file => {
        if(file.id){
          this.setState({
            deleteFile:[...this.state.deleteFile,file]
          })
        }
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    const columns = [
      {
        title: '接收时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '机构授信编号',
        dataIndex: 'institutionCreditNo',
        key: 'institutionCreditNo',
      },
      {
        title: '授信状态',
        dataIndex: 'status',
        key: 'status',
        render:((text,record)=>{
          if(text === 'QUALIFIED'){
            return '授信成功'
          }else if(text === 'REJECTED'){
            return '授信拒绝'
          }else if(text === 'QUALIFIED'){
            return '默认值'
          }
        })
      },
      {
        title: '实际授信时间',
        dataIndex: 'eventTime',
        key: 'eventTime',
      },
      {
        title: '对接渠道',
        dataIndex: 'channel',
        key: 'channel',
      },
      {
        title: '授信额度金额(单位：元)',
        dataIndex: 'quotaAmount',
        key: 'quotaAmount',
        render:((text,record)=>{
          if(text){
            return Number(text).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
          }else{
            return null
          }
        })
      },
      {
        title: '授信期限',
        dataIndex: 'creditTerm',
        key: 'creditTerm',
      },
      {
        title: '授信期限单位',
        dataIndex: 'creditTermUnit',
        key: 'creditTermUnit',
      },
      {
        title: '授信有效期开始日',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: '授信有效期结束日',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: '单笔支用限额（单位：元）',
        dataIndex: 'loanLimitQuota',
        key: 'loanLimitQuota',
        render:((text,record)=>{
          if(text){
            return Number(text).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
          }else{
            return null
          }
        })
      },
      {
        title: '额度修改原因',
        dataIndex: 'quotaChangeReason',
        key: 'quotaChangeReason',
      },
      {
        title: '阿里授信申请单号',
        dataIndex: 'creditApplyNo',
        key: 'creditApplyNo',
      },
      {
        title: '阿里客户',
        dataIndex: 'customerId',
        key: 'customerId',
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
        title: '线上年回款比例(%)',
        dataIndex: 'amountRatio',
        key: 'amountRatio',
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
        //onOk={()=>this.onSave(onSave)}
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

export default CreditAgree;


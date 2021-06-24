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
  loading:loading.effects['Cre/findLeagl']
}))
@Form.create()
class CreditLeagl extends PureComponent {
  state = {
    BStatus:false,
    pageStore:{},
    dataList:{},
    conditions:[],
    rowId:null
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      const { record:{legalPersonLicenseNo,legalPersonMateLicenseNo},type } = nextProps.data
      const { dispatch } = this.props;
      const conditions = [
        {
          code:'legal_person_license_no',
          exp:'=',
          value: type === "法人证件号码"? legalPersonLicenseNo: legalPersonMateLicenseNo
        },{
          code:'legal_person_mate_license_no',
          exp:'=',
          value: type === "法人证件号码"? legalPersonLicenseNo: legalPersonMateLicenseNo
        },
      ]
      dispatch({
        type:'Cre/findLeagl',
        payload:{
          conditions
        },
        callback:(res)=>{
          console.log('0000res',res)
          this.setState({
            dataList:res,
            conditions,
            rowId:nextProps.data.record.id
          })
        }
      })
    }
  }

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
      dataList:{},
      conditions:[]
    })
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions } = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type:'Cre/findLeagl',
      payload:{
        conditions,
        ...obj
      },
      callback:(res)=>{
        console.log('0000res',res)
        this.setState({
          dataList:res,
          conditions
        })
      }
    })
  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  render() {
    const {
      loading,
      data,
      on
    } = this.props;
    const { dataList } = this.state
    const { visible,record,type } = data;
    console.log('---record',record)
    const { onSave,onCancel } = on;
    const columns = [
      {
        title: '接收时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '产品编号',
        dataIndex: 'productCode',
        key: 'productCode',
      },
      {
        title: '授信申请单号',
        dataIndex: 'creditApplyNo',
        key: 'creditApplyNo',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render:((text,record)=>{
          if(text === 'QUALIFIED'){
            return '授信成功'
          }else if(text === 'REJECTED'){
            return '授信拒绝'
          }
        })
      },
      {
        title: '阿里客户',
        dataIndex: 'customerId',
        key: 'customerId',
      },
      {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '公司证件类型',
        dataIndex: 'companyLicenseType',
        key: 'companyLicenseType',
      },
      {
        title: '法人姓名',
        dataIndex: 'legalPersonName',
        key: 'legalPersonName',
      },
      {
        title: '企业身份标识号码',
        dataIndex: 'companyLicenseNo',
        key: 'companyLicenseNo',
      },
      {
        title: '法人证件类型',
        dataIndex: 'legalPersonLicenseType',
        key: 'legalPersonLicenseType',
        render:((text,record)=>{
          if(text === 'IDENTITY_CARD'){
            return '身份证'
          }else {
            return '其他'
          }
        })
      },
      {
        title: '法人证件号码',
        dataIndex: 'legalPersonLicenseNo',
        key: 'legalPersonLicenseNo',
      },
      {
        title: '法人手机号',
        dataIndex: 'legalPersonPhoneNo',
        key: 'legalPersonPhoneNo',
      },
      {
        title: '法人婚姻状态',
        dataIndex: 'legalPersonMaritalStatus',
        key: 'legalPersonMaritalStatus',
        render:((text,record)=>{
          if(text === 'UNMARRIED'){
            return '未婚'
          }else if(text === 'MARRIED'){
            return '已婚'
          }else if(text === 'DIVORCED'){
            return '离异'
          }else if(text === 'WIDOWED'){
            return '丧偶'
          }
        })
      },
      {
        title: '法人配偶姓名',
        dataIndex: 'legalPersonMateName',
        key: 'legalPersonMateName',
      },
      {
        title: '法人配偶证件号',
        dataIndex: 'legalPersonMateLicenseNo',
        key: 'legalPersonMateLicenseNo',
      },
      {
        title: '审批人员',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '审批时间',
        dataIndex: 'userDate',
        key: 'userDate',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width:1
      },
    ];
    return (
      <Modal
        title={`查看${type}相关信息`}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        //onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
        footer={null}
      >
        <NormalTable
          loading={loading}
          columns={columns}
          data={dataList}
          rowClassName={this.setRowClassName}
          onChange={this.handleStandardTableChange}
        />
      </Modal>
    );
  }
}

export default CreditLeagl;


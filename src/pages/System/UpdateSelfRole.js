import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  DatePicker,
  Divider,
  Button,
  Card,
  Tabs,
  Icon,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';


const FormItem = Form.Item;
@connect(({ sysuser, loading }) => ({
  sysuser,
  loading: loading.models.sysuser,
}))
@Form.create()
class UpdateSelfRole extends PureComponent {
  state = {
    initData:{},
    BStatus:false
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      this.setState({
        initData:nextProps.data.record
      })
    }
  }

  handleOk = (onOk) =>{
    const { form } = this.props;
    const { BStatus,initData } = this.state;
    if(BStatus){
      return
    }
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      this.setState({
        BStatus:true
      })
      const obj = {
        ...values,
        id:initData.id
      };
      onOk(obj,this.clear)
    })
  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

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
      initData:{},
      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data
    } = this.props;
    const { visible } = data;
    const { onOk,onCancel } = on;
    const { initData } = this.state;
    return (
      <Modal
        title="编辑角色"
        Modal
        destroyOnClose
        visible={visible}
        centered
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.rolecode' })}>
          {getFieldDecorator('code', {
            initialValue:initData.code?initData.code:'',
            rules: [{ required: true, message: '请输入角色编码！' }],
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.rolename' })}>
          {getFieldDecorator('name', {
            initialValue:initData.name?initData.name:'',
            rules: [{ required: true, message: '请输入角色名称！' }],
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default UpdateSelfRole;

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
} from 'antd';

const FormItem = Form.Item;

@connect(({ sysuser, loading }) => ({
  sysuser,
  loading: loading.models.sysuser,
}))
@Form.create()
class AddSelfRole extends PureComponent {
  state = {
    BStatus:false
  };

  handleOk = (onOk) =>{
    const { form } = this.props;
    const { BStatus } = this.state;
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
      onOk(values,this.clear)
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
    return (
      <Modal
        title="新建角色"
        destroyOnClose
        centered
        visible={visible}
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.rolecode' })}>
          {getFieldDecorator('code', {
            rules: [{
              required: true,
              message: '请输入角色编码！',
            }],
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.rolename' })}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入角色名称！' }],
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default AddSelfRole;

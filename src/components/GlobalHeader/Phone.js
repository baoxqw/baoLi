import React, { PureComponent, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Modal,
  Input
} from 'antd';

const FormItem = Form.Item;

@Form.create()
class Phone extends PureComponent {
  state = {
    record:{},
    BStatus:false
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.visible !== this.props.data.visible){
      this.setState({
        record:nextProps.data.record,
      })
    }
  }

  okHandle = (onOk)=>{
    const { form } = this.props;
    const { BStatus } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err, fieldsValue) => {
      if(err){return}
      let obj = {
        phonenumber:fieldsValue.phone
      }
      this.setState({
        BStatus:true
      })
      if(typeof onOk === 'function'){
        onOk(obj,this.clear)
      }
    });
  }

  handleCancel = (handleCancel)=>{
    if(typeof handleCancel === 'function'){
      handleCancel(this.clear)
    }
  }

  clear = (status)=>{
    if(status){
      this.setState({
        BStatus:false
      })
      return
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      record:{},
      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      loading,
      on
    } = this.props;

    const { visible } = data;
    const { onOk,handleCancel } = on;

    const { record } = this.state;
    return (
      <Modal
        destroyOnClose
        title={formatMessage({ id: 'validation.setPhone' })}
        visible={visible}
        onOk={()=>this.okHandle(onOk)}
        onCancel={() => this.handleCancel(handleCancel)}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.phoneNumber' })}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入手机号',pattern: /^[1]([3-9])[0-9]{9}$/ }],
            initialValue:record.phone?record.phone:''
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} type={'Number'}/>)}
        </FormItem>
      </Modal>
    );
  }
}

export default Phone;

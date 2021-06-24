import React, { PureComponent, Fragment } from 'react';

import {
  Select,
  Row,
  Modal,
  Col,
  DatePicker,
  Form,
  Input,
  Checkbox
} from 'antd';

import moment from 'moment';

@Form.create()
class UpdateOrgan extends PureComponent {
  state = {
    BStatus:false,
  };

  onSave = (onSave)=>{
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      form,
    } = this.props;
    const { record } = data;
    console.log('---record',record)
    const { BStatus } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        reqData:{
          id:record.id,
          passWord:values.passWord
        }
      };
      this.setState({
        BStatus:true
      });
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

    return (
      <Modal
        title={"编辑用户"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label='用户名'>
              {getFieldDecorator('userName',{
                initialValue:record.userName
              })(
                <Input placeholder="请输入用户名" disabled/>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label="用户密码">
              {getFieldDecorator('passWord',{
                rules: [{
                  required: true,
                }]
              })(<Input placeholder="请输入密码"/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default UpdateOrgan;


import React, { PureComponent, Fragment } from 'react';

import {
  Select,
  Row,
  Modal,
  Col,
  Transfer,
  Form,
  Input,
  Checkbox
} from 'antd';

import storage from '@/utils/storage';

@Form.create()
class Auth extends PureComponent {
  state = {
    BStatus:false,
    mockData:[{
      key:'creditQuery',
      title:'授信查看'
    },{
      key:'loanQuery',
      title:'支用查看'
    },{
      key:'creditAudit',
      title:'授信审核'
    },{
      key:'loanAudit',
      title:'支用审核'
    },{
      key:'dataSync',
      title:'文件同步'
    }],
    targetKeys: [],
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      const { authority  } = nextProps.data.record;
      if(authority){
        const arr = authority.split(',');
        this.setState({
          targetKeys:arr
        })
      }
    }
  }

  onSave = (onSave)=>{
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      form,
    } = this.props;
    const { record } = data;
    const { BStatus,targetKeys } = this.state;
    if(BStatus){
      return
    }
    const obj = {
      reqData:{
        id:record.id,
        authority:targetKeys.join(",")
      }
    };
    this.setState({
      BStatus:true
    });
    if(typeof onSave === 'function'){
      onSave(obj,this.clear);
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
      targetKeys: [],
    })
  }

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

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
        title={"分配权限"}
        visible={visible}
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <div style={{display:'flex',justifyContent:'center' }}>
          <Transfer
            dataSource={this.state.mockData}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            render={item => item.title}
          />
        </div>

      </Modal>
    );
  }
}

export default Auth;


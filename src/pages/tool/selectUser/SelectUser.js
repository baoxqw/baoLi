import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Transfer ,
  Modal,
  message
} from 'antd';

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.RR,
}))
@Form.create()
class SelectUser extends PureComponent {
  state = {
    mockData:[],
    targetKeys:[],
  };


  componentWillReceiveProps(nextProps){
    if(nextProps.data.visible !== this.props.data.visible){
        const { dispatch } = this.props;
        dispatch({
          type:'user/queryUser',
          payload:{
            reqData:{}
          },
          callback:(res)=>{
            console.log("res",res)
            if(res.resData && res.resData.length){
              res.resData = res.resData.map(item =>{
                item.key = item.id;
                item.disabled = 0;
                return item
              });
              this.setState({
                mockData:res.resData,
              })
            }
          }
        })
    }
  }

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel()
    }
    this.qinChu()
  };

  onSubmit = (onOk)=>{
    const { targetKeys,mockData } = this.state;
    const arr = [];
    mockData.map(item =>{
      targetKeys.map(it =>{
        if(item.key === it){
          arr.push({
            id:item.id,
            name:item.name
          })
        }
      })
    });
    if(typeof onOk === 'function'){
      onOk(arr).then(()=>{
        this.qinChu()
      },(res)=>{
        if(res === 0){
          return  message.error("请选择审批人")
        }else if(res === 1){
          return  message.error("提交失败")
        }
      })
    }
  }

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  handleChange = (targetKeys) => {
    const { mockData } = this.state;
    let arr = [];
    if(targetKeys.length){
      arr = arr = this.retArr(targetKeys)
    }else{
      arr = mockData.map(item =>{
        item.disabled = 0
        return item
      });
    }
    this.setState({ targetKeys,mockData:arr });
  };

  qinChu = ()=> {
    this.setState({
      mockData: [],
      targetKeys: [],
    })
  }

  retArr = (dataKeys)=>{
    const { mockData } = this.state;
    return mockData.map(item =>{
      if(item.key === dataKeys[0]){
        item.disabled = 0
      }else{
        item.disabled = 1
      }
      return item
    });
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    const { mockData,targetKeys } = this.state;
    let arr = [];

    if(sourceSelectedKeys.length){
      arr = this.retArr(sourceSelectedKeys)
    }

    if(targetSelectedKeys.length){
      arr = this.retArr(targetSelectedKeys)
    }
    if(targetKeys.length){
      if(!sourceSelectedKeys.length && !targetSelectedKeys.length){
        arr = this.retArr(targetKeys)
      }
    }else{
      if(!sourceSelectedKeys.length && !targetSelectedKeys.length){
        arr = mockData.map(item =>{
          item.disabled = 0;
          return item
        });
      }
    }

    this.setState({
      mockData: arr
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data
    } = this.props;
    const { visible } = data;
    const { onOk,onCancel } = on;

    return (
      <Modal
        title={"选择"}
        visible={visible}
        destroyOnClose
        centered
        onOk={()=>this.onSubmit(onOk)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Transfer
          titles={["未分配","已分配"]}
          dataSource={this.state.mockData}
          filterOption={this.filterOption}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          onSelectChange={this.handleSelectChange}
          render={item => item.name}
          showSelectAll={false}
        />
      </Modal>
    );
  }
}

export default SelectUser;


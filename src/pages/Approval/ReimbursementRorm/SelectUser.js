import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Transfer ,
  Modal,
} from 'antd';

@connect(({ RR, loading }) => ({
  RR,
  loading: loading.models.RR,
}))
@Form.create()
class SelectUser extends PureComponent {
  state = {
    mockData:[],
    targetKeys:[],
    visible:[]
  };


  componentWillReceiveProps(nextProps){
    if(nextProps.data.visible !== this.props.data.visible){
        console.log("nextProps.data.visible",nextProps.data.visible)
        const { dispatch } = this.props;
        const { visible } = nextProps.data;
        dispatch({
          type:'RR/queryRole',
          payload:{
            reqData:{
              name:visible[0]
            }
          },
          callback:(res)=>{
            if(res.resData && res.resData.length){
              res.resData = res.resData.map(item =>{
                item.key = item.id;
                return item
              })
              this.setState({
                mockData:res.resData,
                visible
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
    this.qingChu()
  };

  onSubmit = (onOk)=>{
    const { targetKeys,mockData,visible } = this.state;
    const arr = [];
    mockData.map(item =>{
      targetKeys.map(it =>{
        if(item.key === it){
          arr.push(item)
        }
      })
    });
    if(typeof onOk === 'function'){
      onOk(arr,visible.slice(1))
    }
    this.qingChu()
  }

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  };

  qingChu = ()=> {
    this.setState({
      mockData: [],
      targetKeys: [],
      visible: []
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
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
          render={item => item.name}
        />
      </Modal>
    );
  }
}

export default SelectUser;


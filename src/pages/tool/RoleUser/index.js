import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Transfer ,
  Modal,
  message,
  Popconfirm,
  Tabs,
  Button
} from 'antd';

const { TabPane } = Tabs;

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.RR,
}))
@Form.create()
class index extends PureComponent {
  state = {
    mockData:[],
    targetKeys:[],

    mockData2:[],
    targetKeys2:[],

    status:false
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

  changeStatus = ()=>{
    this.setState({
      status:false
    })
  }

  handleCancel = (onCancel)=>{
    console.log("执行")
    if(this.state.status){
      return
    }
    this.setState({
      status:true
    });
    if(typeof onCancel === 'function'){
      onCancel(this.qinChu,this.changeStatus)
    }
  };

  onSubmit = (onOk)=>{
    const { targetKeys,mockData,targetKeys2,mockData2 } = this.state;
    if(this.state.status){
      return
    }
    this.setState({
      status:true
    });

    let arr = [];
    if(targetKeys.length){
      mockData.map(item =>{
        targetKeys.map(it =>{
          if(item.key === it){
            arr.push({
              id:item.id,
              name:item.name,
              type:"USER"
            })
          }
        })
      });
    }

    if(targetKeys2.length){
      mockData2.map(item =>{
        targetKeys2.map(it =>{
          if(item.key === it){
            arr.push({
              id:item.id,
              name:item.name,
              type:"GROUP"
            })
          }
        })
      });
    }

    if(typeof onOk === 'function'){
      onOk(arr,this.qinChu,this.changeStatus)
    }
  }

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  qinChu = ()=> {
    this.setState({
      mockData: [],
      targetKeys: [],
      mockData2:[],
      targetKeys2:[]
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

  handleChange = (targetKeys) => {
    const { mockData } = this.state;
    let arr = [];
    if(targetKeys.length){
      arr = this.retArr(targetKeys)
    }else{
      arr = mockData.map(item =>{
        item.disabled = 0
        return item
      });
    }
    this.setState({ targetKeys,mockData:arr });
  };

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

  callback = (key)=>{
    const { dispatch } = this.props;
    if(key === '1'){
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
              mockData2:[],
              targetKeys2:[]
            })
          }
        }
      })
    }
    if(key === '2'){
      console.log("执行")
      dispatch({
        type:'user/queryRole',
        payload: {
          pageIndex:0,
          pageSize:100000
        },
        callback:(res)=>{
          console.log("角色",res)
          if(res.resData && res.resData.length){
            res.resData = res.resData.map(item =>{
              item.key = item.id;
              item.disabled = 0;
              return item
            });
            this.setState({
              mockData2:res.resData,
              mockData:[],
              targetKeys:[]
            })
          }
        }
      })
    }
  }

  retArr2 = (dataKeys)=>{
    const { mockData2 } = this.state;
    return mockData2.map(item =>{
      if(item.key === dataKeys[0]){
        item.disabled = 0
      }else{
        item.disabled = 1
      }
      return item
    });
  }

  handleChange2 = (targetKeys) => {
    const { mockData2 } = this.state;
    let arr = [];
    if(targetKeys.length){
      arr = this.retArr2(targetKeys)
    }else{
      arr = mockData2.map(item =>{
        item.disabled = 0;
        return item
      });
    }
    this.setState({ targetKeys2:targetKeys,mockData2:arr });
  };

  handleSelectChange2 = (sourceSelectedKeys, targetSelectedKeys) => {
    const { mockData2,targetKeys2 } = this.state;
    let arr = [];

    if(sourceSelectedKeys.length){
      arr = this.retArr2(sourceSelectedKeys)
    }

    if(targetSelectedKeys.length){
      arr = this.retArr2(targetSelectedKeys)
    }
    if(targetKeys2.length){
      if(!sourceSelectedKeys.length && !targetSelectedKeys.length){
        arr = this.retArr2(targetKeys2)
      }
    }else{
      if(!sourceSelectedKeys.length && !targetSelectedKeys.length){
        arr = mockData2.map(item =>{
          item.disabled = 0;
          return item
        });
      }
    }

    this.setState({
      mockData: arr
    })
  };

  shadow = (onShadow)=>{
    this.qinChu();
    this.changeStatus();
    if(typeof onShadow === 'function'){
      onShadow()
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data
    } = this.props;
    const { visible,title,agree = "同意",cancel = "取消",is = 2 } = data;
    const { onOk,onCancel,onShadow = onCancel } = on;

    let button = <Button onClick={()=>this.shadow(onShadow)}>{cancel}</Button>

    if(is === 2){
      button = <Popconfirm title="确定不加签吗?"  onConfirm={()=>this.handleCancel(onCancel)}>
        <Button >{cancel}</Button>
      </Popconfirm>
    }

    return (
      <Modal
        title={title}
        visible={visible}
        destroyOnClose
        centered
        bodyStyle={{paddingTop:0}}
        //okText={agree}
        //cancelText={cancel}
        //onOk={()=>this.onSubmit(onOk)}
        onCancel={()=>this.shadow(onShadow)}
        footer={[
          button
         ,
          <Popconfirm title="确定加签吗?"  onConfirm={()=>this.onSubmit(onOk)}>
            <Button type="primary" >{agree}</Button>
          </Popconfirm>
        ]}
      >
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="按用户选" key="1">
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
          </TabPane>
          <TabPane tab="按角色选" key="2">
            <Transfer
              titles={["未分配","已分配"]}
              dataSource={this.state.mockData2}
              filterOption={this.filterOption}
              targetKeys={this.state.targetKeys2}
              onChange={this.handleChange2}
              onSelectChange={this.handleSelectChange2}
              render={item => item.name}
              showSelectAll={false}
            />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default index;


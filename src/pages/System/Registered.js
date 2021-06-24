import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  TreeSelect,
  Button,
  Card,
  TextArea,
  Checkbox,
  InputNumber,
  Tree,
  Icon,
  Tooltip,
  Modal,
  message, Popconfirm,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { TreeNode } = Tree;

function toTree(data) {
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item) {
    delete item.routes;
  });
  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  let map = {};
  data.forEach((item) =>{
    map[item.id] = item;
  });
  let val = [];
  data.forEach((item)=>{
    //item.key = item.id;
    // 以当前遍历项的pid,去map对象中找到索引的id
    let parent = map[item.pid];
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || ( parent.children = [] )).push(item);
    } else {
      //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item);
    }
  });
  return val;
}

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
class Registered extends PureComponent {
  state = {
    value: undefined,
    treeData:'',
    isdisabled:true,
    valueList:[],
    changedstate:false,
    allvalue:[],
    dataList:[], //原始数据
    pid:null,
    id:null,
    initData:[],
    addtreeData:null,
    adddata:false,
    checked:false,
    hideChildrenInMenu:0,
    addid:null,
    node:{},
    status:'',


    addStatus:false,
    updateStatus:false,
    deleteStatus:false,
  }

  onSelect = (selectedKeys, info) => {

    const { dispatch,form} = this.props;
    if(info.selectedNodes[0]){
      const node = info.selectedNodes[0].props.dataRef;
      this.setState({
        node,
        addid:node.id,
        isdisabled:true,
        hideChildrenInMenu:node.hideChildrenInMenu
      })
    }else{
      form.resetFields();
      this.setState({
        node:{},
        addid:null,
        isdisabled:true,
        hideChildrenInMenu:0
      })
    }
  };

  componentDidMount(){
    const { dispatch} = this.props;
    dispatch({
      type: 'role/fetchAntu',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if (res.resData){
          const a = toTree(res.resData)

          this.setState({
            dataList:res.resData,
            valueList: a,
            allvalue:a
          })
        }
      }
    })

  }

  onChanged = value => {

    this.setState({
      changedstate:true,
      addid:value,
      changedPid:value,
      node:{
        ...this.state.node,
        pid:value,
      }
    });
  };

  onChange = value => {

    this.setState({ value });
  };

  handleSubmit = e => {
    const { dispatch,form} = this.props;
    const { status,node,addid,hideChildrenInMenu } = this.state;
    e.preventDefault();
    if(!status){
      message.error("请选择操作方式")
      return
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(status === '新建'){
          const obj = {
            ...values,
            hideChildrenInMenu,
            icon:values['icon']?values['icon']:null,
            pid:addid,
          }
          dispatch({
            type: 'role/register',
            payload: {
              reqData:obj
            },
            callback:(res)=>{
              dispatch({
                // type: 'role/newdata',
                type: 'role/fetchAntu',
                payload: {
                  reqData:{}
                },
                callback:(res)=>{
                  if (res.resData){
                    message.success('新建成功')
                    const a = toTree(res.resData)
                    this.setState({
                      dataList:res.resData,
                      valueList: a,
                      hideChildrenInMenu:0,
                      node:{},
                      isdisabled:true,
                      addStatus:false,
                      updateStatus:false,
                      deleteStatus:false,
                    })
                    form.resetFields();
                  }
                }
              })
            }
          })
        }else if(status === '编辑'){

          const obj = {
            ...values,
            hideChildrenInMenu,
            icon:values['icon']?values['icon']:null,
            pid:node.pid,
            id:node.id,
          }

          dispatch({
            type: 'role/register',
            payload: {
              reqData:obj
            },
            callback:(res)=>{

              message.success("提交成功",1,()=>{
                dispatch({
                  type: 'role/fetchAntu',
                  payload: {
                    reqData:{}
                  },
                  callback:(res)=>{
                    if (res.resData){
                      const a = toTree(res.resData)
                      this.setState({
                        dataList:res.resData,
                        valueList: a,
                        node:{},
                        hideChildrenInMenu:0,
                        isdisabled:true,
                        addStatus:false,
                        updateStatus:false,
                        deleteStatus:false,
                      })
                      form.resetFields();
                    }
                  }
                })
              })
            }
          })

        }
      }
    });
  };
  //编辑
  handleUpdate = e =>{
    const { node } = this.state;
    if(!node.id){
      message.error("请选择节点");
      return
    }
    this.setState({
      status:'编辑',
      isdisabled:false,
      addStatus:true,
      deleteStatus:true
    })
  }
  //新建
  handleModalVisible = () =>{
    this.setState({
      isdisabled:false,
      hideChildrenInMenu:0,
      status:'新建',
      node:{
        id:this.state.node.id,
        pname:this.state.node.name,
        pid:this.state.node.pid,
      },
      deleteStatus:true,
      updateStatus:true
    })
  }
  //取消
  cancled = ()=>{

    const { form} = this.props;
    this.setState({
      node:{},
      isdisabled:true,
      addStatus:false,
      updateStatus:false,
      deleteStatus:false,
      hideChildrenInMenu:0,
    })
    form.resetFields();
  }

  handleRemove = e =>{
    const { dispatch,form} = this.props;
    const { node } = this.state;
    if(!node.id){
      message.error("请先选择节点")
      return
    }

    dispatch({
      type: 'role/removenewdatamenu',
      payload: {
        reqData:{
          id:node.id,
        }
      },
      callback:(res)=>{
        message.success("删除成功",1,()=>{
          dispatch({
            type: 'role/fetchAntu',
            payload: {
              reqData:{}
            },
            callback:(res)=>{
              if (res.resData){
                const a = toTree(res.resData)
                this.setState({
                  dataList:res.resData,
                  valueList: a,
                  allvalue:a,
                  node:{},
                  hideChildrenInMenu:0,
                })
                form.resetFields();
              }
            }
          })
        })
      }
    })
  }

  onChangeBox = (e)=>{

    const checked = e.target.checked;
    if(checked){
      this.setState({
        hideChildrenInMenu:1
      })
    }else{
      this.setState({
        hideChildrenInMenu:0
      })
    }

  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} dataRef={item} />;
    });

  yy = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} value ={item.id} dataRef={item}>
            {this.yy(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} value ={item.id} dataRef={item} />;
    });

  render() {
    const {
      form: { getFieldDecorator },
      role:{data},
      loading,
      form
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span:6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset:12,
        },
        sm: {
          span: 16,
          offset:14,
        },
      },
    };
    const {initData,isdisabled,checked,node,hideChildrenInMenu} = this.state;
    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card title={'功能分类'} bodyStyle={{paddingTop:12}} style={{ flex:'1',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <div>
              <Popconfirm title={node.id?"是否创建当前项子节点":"新建节点"} onConfirm={() => this.handleModalVisible()}>
                <Button  size='default' disabled={this.state.addStatus}  icon="plus" type="primary" >
                  新建
                </Button>
              </Popconfirm>

              <Button   size='default' style={{marginLeft:'20px'}} disabled={this.state.updateStatus}  onClick={() => this.handleUpdate(true)}>
                编辑
              </Button>
              <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })}  onConfirm={() => this.handleRemove()}>
                <Button   size='default' disabled={this.state.deleteStatus} style={{marginLeft:'20px'}}  >
                  刪除
                </Button>
              </Popconfirm>
            </div>
            <div style={{paddingTop:12}}>
              <Tree
                defaultExpandAll={true}
                onSelect={this.onSelect}
                //onCheck={this.onCheck}
                //checkable
              >
                {this.renderTreeNodes(this.state.valueList)}
              </Tree>
            </div>

          </Card>
          <Card title="菜单明细" style={{ flex:'1',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Form {...formItemLayout} layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
              <Form.Item label="菜单编码：">
                {getFieldDecorator('code', {
                  initialValue:node.code?node.code:'',
                  rules: [
                    {
                      required: true,
                      message: '请填写菜单编码',
                    },
                  ],
                })(<Input  disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="菜单名称：">
                {getFieldDecorator('name', {
                  initialValue:node.name?node.name:'',
                  rules: [
                    {
                      required: true,
                      message: '请填写菜单名称',
                    },
                  ],
                })(<Input  disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="图标：">
                {getFieldDecorator('icon', {
                  initialValue:node.icon?node.icon:'',
                })(<Input  disabled={isdisabled}/>)}
              </Form.Item>
              {/*        <Form.Item label="上级菜单：">
                {getFieldDecorator('pid', {
                  // initialValue:data.pname,

                })(<Input placeholder={this.state.adddata?this.state.addtreeData:this.state.treeData}  disabled/>)}
              </Form.Item>*/}
              <Form.Item label="上级菜单：">
                {getFieldDecorator('pid', {
                  initialValue:node.pname?node.pname:''
                })(
                  <TreeSelect
                    style={{ width: 300 }}
                    disabled={isdisabled}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeDefaultExpandAll
                    onChange={this.onChanged}
                  >
                    {this.yy(this.state.allvalue)}
                  </TreeSelect>
                )}
              </Form.Item>
              <Form.Item label="显示顺序：">
                {getFieldDecorator('sn', {
                  initialValue:node.sn?node.sn:'',
                  rules: [
                    {
                      required: true,
                      message: '显示顺序',
                    },
                  ],
                })(<Input  disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="资源地址：">
                {getFieldDecorator('url', {
                  initialValue:node.url?node.url:'',
                  rules: [
                    {
                      required: true,
                      message: '资源地址',
                    },
                  ],
                })(<Input  disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="组件地址：">
                {getFieldDecorator('component', {
                  initialValue:node.component?node.component:'',
                })(<Input  disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="备注：">
                {getFieldDecorator('memo', {
                  initialValue:node.memo?node.memo:'',
                })(<Input  disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Checkbox
                  checked={hideChildrenInMenu === 1 ?true:false}
                  onChange={this.onChangeBox}
                  disabled={isdisabled}
                >
                  是否隐藏子菜单
                </Checkbox>
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button onClick={this.cancled} style={{marginRight:'20px'}}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit"  loading={loading}>
                  确定
                </Button>

              </Form.Item>
            </Form>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Registered;


import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  TreeSelect ,
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
import styles from "./TreeSelectTransfer.less"
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { TreeNode } = Tree;
import storage from '@/utils/storage'
// test git
const fieldLabels = {
  name: 'LP名称',
  shortname: 'LP简称',
  type: '性质',
  contactperson: '联系人',
  contactinfo: '联系方式',
  email: '电子邮件',
  subscribed: '认缴投资额',
  payin: '实缴投资额',
  paydate: '缴纳时间',
  memo: '备注',
};
const newtreeData = []
const treeData = [
  {
    title: '系统管理',
    value: '0-0',
    // key: '0-0',
    children: [
      {
        title: '角色管理',
        value: '0-0-1',
        // key: '0-0-1',
      },
      {
        title: '用户管理',
        value: '0-0-2',
        // key: '0-0-2',
      },
      {
        title: '功能注册',
        value: '0-0-3',
        key: '0-0-3',
      },
    ],
  },
  {
    title: '基础数据',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'LP管理',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: '基金管理',
        value: '0-1-2',
        key: '0-1-2',
      },
      {
        title: '合作伙伴管理',
        value: '0-1-3',
        key: '0-1-3',
      },
    ],
  },
  {
    title: '项目管理',
    value: '0-2',
    key: '0-2',
    children: [
      {
        title: '项目分配',
        value: '0-2-1',
        key: '0-2-1',
      },
      {
        title: '任务分配',
        value: '0-2-2',
        key: '0-2-2',
      },
    ],
  },
  {
    title: '投后管理',
    value: '0-3',
    key: '0-3',
    children: [
      {
        title: '投后管理',
        value: '0-3-1',
        key: '0-3-1',
      },
    ],
  },
  {
    title: '工作管理',
    value: '0-4',
    key: '0-4',
    children: [
      {
        title: '工作日报',
        value: '0-4-1',
        key: '0-4-1',
      },
      {
        title: '投资决策',
        value: '0-4-2',
        key: '0-4-2',
      },
    ],
  },
  {
    title: '日常审批',
    value: '0-5',
    key: '0-5',
    children: [
      {
        title: '我的申请',
        value: '0-5-1',
        key: '0-5-1',
      },
      {
        title: '财务',
        value: '0-5-2',
        key: '0-5-2',
      },
      {
        title: '请假/出差',
        value: '0-5-3',
        key: '0-5-3',
      },
    ],
  },
  {
    title: '分析统计',
    value: '0-6',
    key: '0-6',
    children: [
      {
        title: '基金净值查询',
        value: '0-6-1',
        key: '0-6-1',
      },
      {
        title: '项目风险预警',
        value: '0-6-2',
        key: '0-6-2',
      },
      {
        title: '项目漏斗图',
        value: '0-6-3',
        key: '0-6-3',
      },
      {
        title: '项目地区分布',
        value: '0-6-4',
        key: '0-6-4',
      },
      {
        title: '基金项目分析',
        value: '0-6-5',
        key: '0-6-5',
      },
    ],
  },
];
const DirectoryTree = Tree.DirectoryTree;

function toTree(data) {
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item) {
    delete item.routes;
  });
  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  /*
  {
    1:{
        id:1,
        pid:1,
         children:{}
    }
  }
  */
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
    allvalue:[],
    dataList:[], //原始数据
    pid:null,
    id:null,
    initData:[],
    addtreeData:null,
    adddata:false,
  }
  onSelect = (selectedKeys, info) => {
    console.log('infor',info)
    const { dispatch} = this.props;
    if(info.selectedNodes){
      dispatch({
        type: 'role/findnewdata',
        payload: {
          reqData:{
            id:info.selectedNodes[0].props.dataRef.id
          }
        },
        callback:(res)=>{
          console.log('查询结果：',res)
        }
      })
      this.setState({
        addtreeData:info.selectedNodes[0].props.dataRef.name,
        addpid:info.selectedNodes[0].props.dataRef.id,
        initData:info.selectedNodes[0].props.dataRef,
        treeData:info.selectedNodes[0].props.dataRef.pname,
        pid:info.selectedNodes[0].props.dataRef.pid,
        id:info.selectedNodes[0].props.dataRef.id,
      })
    }

  };

  onCheck = (checkedKeys, info) => {

  };

  componentDidMount(){
    const { dispatch} = this.props;
    dispatch({
      type: 'role/newdata',
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
    console.log(value);
    this.setState({ addid:value });
  };
  onChange = value => {
    console.log(value);
    this.setState({ value });
  };
  handleSubmit = e => {
    const { dispatch,form} = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        const obj = {
          ...values,
          agreement:values['agreement']?1:0,
          pid:this.state.adddata?this.state.addpid:this.state.id,
        }
        dispatch({
          type: 'role/register',
          payload: {
            reqData:obj
          },
          callback:(res)=>{
            dispatch({
              type: 'role/newdata',
              payload: {
                reqData:{}
              },
              callback:(res)=>{
                if (res.resData){
                  const a = toTree(res.resData)
                  this.setState({
                    dataList:res.resData,
                    valueList: a
                  })
                }
              }
            })
            form.resetFields();
            this.setState({isdisabled:true})
          }
        })
      }
    });
  };
  //编辑
  handleUpdate = e =>{
    this.setState({
      isdisabled:false,
      adddata:false,
    })
  }
  //新建
  handleModalVisible = (e,form) =>{
    this.setState({
      isdisabled:false,
      initData:[],
      adddata:true,
    })
  }
  handleRemove = e =>{
    const { dispatch} = this.props;
    dispatch({
      type: 'role/removenewdata',
      payload: {
        reqData:{
          id:this.state.id,
        }
      },
      callback:(res)=>{
        console.log('刪除结果：',res)
        dispatch({
          type: 'role/newdata',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            if (res.resData){
              const a = toTree(res.resData)
              this.setState({
                dataList:res.resData,
                valueList: a
              })
            }
          }
        })
      }
    })
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
    const {initData,isdisabled} = this.state;
    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card style={{ flex:'1',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <div>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true,form)}>
                新建
              </Button>
              <Button style={{marginLeft:'20px'}} onClick={() => this.handleUpdate(true)}>
                编辑
              </Button>
              <Button style={{marginLeft:'20px'}} onClick={() => this.handleRemove(true)}>
                刪除
              </Button>
            </div>
            <h3 style={{borderBottom:'1px solid #f5f5f5',height:'50px',lineHeight:'50px'}}>所有数据</h3>
            <div >
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
                  // initialValue:data.code,
                  rules: [
                    {
                      required: true,
                      message: '请填写菜单编码',
                    },
                  ],
                })(<Input placeholder={initData?initData.code:'请填写菜单编码'} disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="菜单名称：">
                {getFieldDecorator('name', {
                  // initialValue:data.name,
                  rules: [
                    {
                      required: true,
                      message: '请填写菜单名称',
                    },
                  ],
                })(<Input placeholder={initData?initData.name:'请填写菜单名称'} disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="图标：">
                {getFieldDecorator('icon', {
                  // initialValue:data.icon,
                })(<Input placeholder={initData?initData.icon:'图标'} disabled={isdisabled}/>)}
              </Form.Item>
      {/*        <Form.Item label="上级菜单：">
                {getFieldDecorator('pid', {
                  // initialValue:data.pname,

                })(<Input placeholder={this.state.adddata?this.state.addtreeData:this.state.treeData}  disabled/>)}
              </Form.Item>*/}
              <Form.Item label="上级菜单：">
                {getFieldDecorator('pid', {
                  // initialValue:data.pname,
                })(
                  <TreeSelect
                    style={{ width: 300 }}
                    // value='0-0'
                    // value={this.state.id}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    // treeData={treeData}
                    placeholder={this.state.adddata?this.state.addtreeData:this.state.treeData}
                    treeDefaultExpandAll
                    onChange={this.onChanged}
                  >
                {this.yy(this.state.allvalue)}
                  </TreeSelect>
                  )}
              </Form.Item>
              <Form.Item label="显示顺序：">
                {getFieldDecorator('sn', {
                  // initialValue:data.sn,
                  rules: [
                    {
                      required: true,
                      message: '显示顺序',
                    },
                  ],
                })(<Input placeholder={initData?initData.sn:'显示顺序'} disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="资源地址：">
                {getFieldDecorator('url', {
                  // initialValue:data.url,
                  rules: [
                    {
                      required: true,
                      message: '资源地址',
                    },
                  ],
                })(<Input placeholder={initData?initData.url:'资源地址'} disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="组件地址：">
                {getFieldDecorator('comurl', {
                  // initialValue:data.comurl?data.comurl:'',
                })(<Input placeholder={initData?initData.comurl:'组件地址'} disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="备注：">
                {getFieldDecorator('memo', {
                  // initialValue:data.memo,
                })(<Input placeholder={initData?initData.memo:'备注'} disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                {getFieldDecorator('agreement', {
                  // initialValue:data.agreement?data.agreement:'',
                  valuePropName: 'checked',
                })(
                  <Checkbox disabled={isdisabled}>
                    是否显示子菜单
                  </Checkbox>,
                )}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" style={{marginRight:'20px'}}>
                  提交
                </Button>
                <Button>
                  取消
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
;

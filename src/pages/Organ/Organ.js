import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Divider,
  Button,
  Card,
  Row,
  Col,
  Checkbox,
  message,
  Popconfirm
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../System/UserAdmin.less';
import NormalTable from '@/components/NormalTable';
import './tableBg.less'
import AddOrgan from '@/pages/Organ/AddOrgan';
import UpdateOrgan from '@/pages/Organ/UpdateOrgan';
import Auth from '@/pages/Organ/Auth';

const FormItem = Form.Item;
@connect(({ organ, loading }) => ({
  organ,
  loadingQueryUser: loading.effects['organ/fetch'],
}))
@Form.create()
class Organ extends PureComponent {
  state = {
    conditions:[],
    page:{
      pageIndex:0,
      pageSize:10
    },
    addVisible:false,
    updateVisible:false,
    record:{},
    authRecord:{},

  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'organ/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }
  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const { userName } = values;
      if(userName) {
        let conditions = [];
        let userNameObj = {};

        if (userName) {
          userNameObj = {
            code: 'user_name',
            exp: 'like',
            value: userName
          };
          conditions.push(userNameObj)
        }

        this.setState({conditions})
        console.log("conditions",conditions)
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type:'organ/fetch',
          payload: obj
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'organ/fetch',
          payload: {
            pageIndex:0,
            pageSize:10
          }
        })
      }
    })
  }
//取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[],
    })
    //清空后获取列表
    dispatch({
      type:'organ/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='用户名'>
              {getFieldDecorator('userName')(<Input placeholder='请输入用户名' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>

          </Col>
          <Col md={8} sm={16}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  //分页
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { conditions} = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };

    this.setState({
      page:obj
    });

    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'organ/fetch',
        payload: param,
      });
      return
    }

    dispatch({
      type:'organ/fetch',
      payload: obj,
    });
  };


  handleCorpAdd = ()=>{
    this.setState({
      addVisible:true,
    })
  }

  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type:'organ/deleteUser',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errCode === 200){
          message.success("删除成功","1.2",()=>{
            const { page } = this.state;
            dispatch({
              type:'organ/fetch',
              payload:{
                ...page
              }
            })
          })
        }else{
          message.error("删除失败")
        }
      }
    })
  }

  updateRoute = (e,record)=>{
    e.preventDefault();
    this.setState({
      record,
      updateVisible:true
    })
  }

  updateIsAdmin = (record)=>{
    const { id,isAdmin = 0 } = record;
    const { dispatch } = this.props;
    dispatch({
      type:'organ/updateIsAdmin',
      payload:{
        reqData:{
          id,
          isAdmin:isAdmin?0:1
        }
      },
      callback:(res)=>{
        if(res.errCode === 200){
          message.success("设置成功","1.2",()=>{
            const { page } = this.state;
            dispatch({
              type:'organ/fetch',
              payload:{
                ...page
              }
            })
          })
        }else{
          message.error("设置失败")
        }
      }
    })
  }

  updateAuthority = (e,record)=>{
    e.preventDefault();
    this.setState({
      authVisible:true,
      authRecord:record
    })
  }

  render() {
    const {
      form:{getFieldDecorator},
      organ:{fetchData},
      loadingQueryUser
    } = this.props;

    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '管理员',
        dataIndex: 'isAdmin',
        key: 'isAdmin',
        render: (text, record) =>{
          return <Popconfirm title="确定修改吗?" onConfirm={() => this.updateIsAdmin(record)}>
            <Checkbox checked={text}/>
          </Popconfirm>
        }
      },
      {
        title: '权限',
        dataIndex: 'authority2',
        key: 'authority2',
      },
      {
        title: '注册时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: '操作',
        fixed:'right',
        dataIndex: 'operation',
        width:170,
        render: (text, record) => {
          return <Fragment>
            {
              record.userName === 'admin' && record.isAdmin === 1?<span style={{color:'#ccc'}}>删除</span>:<Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
                <a href="#javascript:;">删除</a>
              </Popconfirm>
            }

            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updateRoute(e,record)}>改密</a>
            <Divider type="vertical" />
            {
              record.isAdmin?<span style={{color:'#ccc'}}>权限</span>:<a href="#javascript:;"  onClick={(e)=>this.updateAuthority(e,record)}>权限</a>
            }
          </Fragment>
        },
      },
    ];

    const onAddUser = {
      onSave:(data,clear)=>{
        console.log("data",data)
        const { dispatch } = this.props;
        dispatch({
          type:'organ/addUser',
          payload:{
            ...data
          },
          callback:(res)=>{
            if(res.errCode === 200){
              message.success("新建成功","1.2",()=>{
                this.setState({
                  addVisible:false
                })
                clear();
                const { page } = this.state;
                dispatch({
                  type:'organ/fetch',
                  payload:{
                   ...page
                  }
                })
              })
            }else{
              message.error(`新建失败-${res.errMsg}`,"1.2",()=>{
                clear(1);
              })
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addVisible:false
        })
      }
    }

    const userData = {
      visible:this.state.addVisible,
    }

    const onUpdateUser = {
      onSave:(data,clear)=>{
        console.log("data",data)
        const { dispatch } = this.props;
        dispatch({
          type:'organ/updatePassWord',
          payload:{
            ...data
          },
          callback:(res)=>{
            if(res.errCode === 200){
              message.success("修改成功","1.2",()=>{
                this.setState({
                  updateVisible:false
                })
                clear();
                const { page } = this.state;
                dispatch({
                  type:'organ/fetch',
                  payload:{
                    ...page
                  }
                })
              })
            }else{
              message.error("修改失败","1.2",()=>{
                clear(1);
              })
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateVisible:false
        })
      }
    }

    const updateUser = {
      visible:this.state.updateVisible,
      record: this.state.record
    }

    const onUpdateAuth = {
      onSave:(data,clear)=>{
        console.log("data",data);
        const { dispatch } = this.props;
        dispatch({
          type:'organ/updateAuthority',
          payload:{
            ...data
          },
          callback:(res)=>{
            if(res.errCode === 200){
              message.success("分配成功","1.2",()=>{
                this.setState({
                  authVisible:false,
                  authRecord:{}
                })
                clear();
                const { page } = this.state;
                dispatch({
                  type:'organ/fetch',
                  payload:{
                    ...page
                  }
                })
              })
            }else{
              message.error("修改失败","1.2",()=>{
                clear(1);
              })
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          authVisible:false,
          authRecord:{}
        })
      }
    }

    const authData = {
      visible:this.state.authVisible,
      record: this.state.authRecord
    }

    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} >{this.renderForm()}</div>
            <div style={{margin:'12px 0'}}>
              <Button icon="plus" onClick={ this.handleCorpAdd } type="primary" >
                新建
              </Button>
            </div>
            <div style={{marginTop:'20px'}}>
              <NormalTable
                columns={columns}
                loading={loadingQueryUser}
                data={fetchData}
                onChange={this.handleStandardTableChange}
              />
            </div>
            <AddOrgan on={onAddUser} data={userData}/>
            <UpdateOrgan on={onUpdateUser} data={updateUser}/>
            <Auth on={onUpdateAuth} data={authData}/>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Organ;

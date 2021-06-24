import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import NormalTable from '@/components/NormalTable';
import TreeSelectTransfer from './TreeSelectTransfer'
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Divider,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
  message, Popconfirm, Transfer,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './UserAdmin.less';
import AddSelfRole from '@/pages/System/AddSelfRole';
import UpdateSelfRole from '@/pages/System/UpdateSelfRole';

const FormItem = Form.Item;

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
class RoleAdmins extends PureComponent {
  state = {
    modalVisible: false,
    editVisible: false,
    distribution:false,
    selectedRows: [],
    formValues: {},
    fields: {},
    pageIndex:0,
    mockData: [], //左边框数据
    targetKeys: [], //右边框数据
    selectedKeys:[], //存放选中的数据
    dataList:[],
    valueLiset:[],
    arrList:[],
    roleId:null,
    roleData:[],
    visibleIndex:false,
    inputValue:'',
    rId:null,
    page:{},
    conditions:[],
    addVisible:false,
    updateVisible:false,
    updateSource:{},
  };
  columns = [
    {
      title: `${formatMessage({ id: 'validation.code' })}`,
      dataIndex: 'code',
    },
    {
      title: `${formatMessage({ id: 'validation.name' })}`,
      dataIndex: 'name',
    },

    {
      title: `${formatMessage({ id: 'validation.operation' })}`,
      render: (text, record) => (
        <Fragment>
          <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">{formatMessage({ id: 'validation.delete' })}</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="#javascript:;" onClick={(e) => this.handleEditVisible(e,record)}>{formatMessage({ id: 'validation.update' })}</a>
          <Divider type="vertical" />
          <a href="#javascript:;" onClick={(e) => this.handleDistribution(e,record)}>分配权限</a>
          <Divider type="vertical" />
          <a href="#javascript:;" onClick={(e) => this.showModal(e,record)}>选择</a>
        </Fragment>
      ),
    }
  ];

  showModal = (e,record)=>{
    e.preventDefault();
    this.setState({
        visibleIndex:true,
        rId:record.id,
        inputValue:record.indexpage
      })
  };


  handleIndex = e => {
    const { inputValue,rId } = this.state;
    const { dispatch } = this.props;

    if(!inputValue){
      message.error("请输入首页路径");
      return
    }
    dispatch({
      type:'role/index',
      payload:{
        reqData:{
          role_id:rId,
          indexpage:inputValue
        }
      },
      callback:(res)=>{
        if(res.errMsg ===  "成功"){
          message.success("设置成功",1,()=>{
            this.setState({
              visibleIndex: false,
              inputValue:'',
              rId:null
            });
            dispatch({
              type: 'role/fetch',
              payload: {
                ...this.state.page
              }
            });
          })
        }
      }
    })
  };

  cancelIndex = e => {
    this.setState({
      visibleIndex: false,
      inputValue:'',
      rId:null
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const obj = {
      pageIndex:0,
      pageSize:10
    };
    dispatch({
      type: 'role/fetch',
      payload: obj
    });
  }

  //删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const obj = {
      reqData:{
        id:record.id
      }
    };
    dispatch({
      type: 'role/remove',
      payload: obj,
      callback:(res)=>{
        if(res && res.errMsg === "成功"){
          dispatch({
            type: 'role/fetch',
            payload: {
              ...this.state.page
            }
          });
        }
      }
    })
  };

  handleEditVisible = (e,record) => {
    e.preventDefault();
    this.setState({
      updateVisible: true,
      updateSource:record
    });
  };

  handleDistribution = (e,record) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.setState({
      distribution: true,
      roleId:record.id
    });
    if(!this.state.editVisible){
      this.setState({
        fields: record
      })
    }
    dispatch({
      type:'role/fetchAntu',
      payload: {
        reqData:{}
      },
      callback:(res)=>{

        if(!res.resData){
          this.setState({
            roleData:[],
            valueLiset:[]
          })
          return
        }
        const a = toTree(res.resData)
        this.setState({
          dataList:res.resData,
          valueList: a,
          roleId:record.id
        })
        dispatch({
          type:'role/roleIdAntu',
          payload:{
            id:record.id
          },
          callback:(ress)=>{
            if(!ress.resData){
              this.setState({
                roleData:[]
              })
              return
            }
            this.setState({
              roleData:ress.resData
            })
          }
        })
      }
    })
  };

  handleModalVisible = () => {
    this.setState({
      addVisible: true,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions} = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };

    this.setState({
      page:obj
    })

    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'role/fetch',
        payload: param,
      });
      return
    }
    dispatch({
      type:'role/fetch',
      payload: obj,
    });
  };

  //查询按钮
  handleSearch = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const {code,name} = values;
      if(code || name){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if(code){
          codeObj = {
            code:'code',
            exp:'=',
            value:code
          };
          conditions.push(codeObj)
        }
        if(name){
          nameObj = {
            code:'name',
            exp:'=',
            value:name
          };
          conditions.push(nameObj)
        }
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions
        };
        this.setState({
          conditions
        });
        dispatch({
          type:'role/fetch',
          payload: obj
        })
      }else{
        this.setState({
          conditions:[]
        });
        dispatch({
          type:'role/fetch',
          payload: {
            pageIndex:0,
            pageSize:10
          }
        })
      }
    })
  };

  handleReset = () => {
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[],
      page:{
        pageIndex:0,
        pageSize:10
      }
    });
    //清空后获取
    dispatch({
      type:'role/fetch',
      payload: {
        pageIndex:0,
        pageSize:10
      }
    })

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'validation.rolecode' })}>
              {getFieldDecorator('code')(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'validation.rolename' })}>
              {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'validation.query' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                {formatMessage({ id: 'validation.cancle' })}
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  handleCancel = ()=>{
    this.setState({
      distribution:false,
    })
  }


  getTheTree = (obj)=>{
    let arr = [];
    Object.keys(obj).forEach(function(key){
      arr.push(obj[key])
    });

    this.setState({
      arrList:arr
    })
  }

  handleOk = ()=>{
    const { dispatch } = this.props;
    const { arrList,roleId } = this.state;
    if(arrList.length){
      dispatch({
        type:'role/distribution',
        payload:{
          userDefineStrGroup:arrList,
          id:roleId
        },
        callback:(res)=>{

          message.success("分配成功",1.5,()=>{
            this.setState({
              distribution:false,
            })
          })
        }
      })
    }
  }


  chanValue = (e)=>{
    this.setState({
      inputValue:e.target.value
    })
  }

  render() {
    const {
      role: { data },
      loading,
      dispatch
    } = this.props;
    const {valueList} = this.state;
    const { selectedRows,addVisible,updateVisible,updateSource } = this.state;

    const OnAddSelf = {
      onOk:(response,clear)=>{
        dispatch({
          type:'role/add',
          payload:{
            reqData:{
              ...response,
            }
          },
          callback:(res)=>{
            console.log("res",res)
            if(res.resData && res.resData.length){
              message.success("添加成功",1,()=>{
                clear();
                this.setState({
                  addVisible:false
                })
                dispatch({
                  type: 'role/fetch',
                  payload: {
                    ...this.state.page
                  }
                });
              })
            }else{
              clear(1)
              message.error("添加失败")
            }

          }
        });
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addVisible:false
        })
      }
    }
    const OnSelfData = {
      visible:addVisible
    }

    const OnUpdateSelf = {
      onOk:(response,clear)=>{
        dispatch({
          type:'role/add',
          payload:{
            reqData:{
              ...response,
            }
          },
          callback:(res)=>{
            console.log("res",res)
            if(res.resData && res.resData.length){
              message.success("编辑成功",1,()=>{
                clear();
                this.setState({
                  updateVisible:false
                })
                dispatch({
                  type: 'role/fetch',
                  payload: {
                    ...this.state.page
                  }
                });
              })
            }else{
              clear(1)
              message.error("编辑失败")
            }

          }
        });
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateVisible:false,
          updateSource:{}
        })
      }
    }
    const OnUpdateData= {
      visible:updateVisible,
      record:updateSource
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div style={{margin:'12px 0'}}>
              <Button icon="plus" type="primary"  size='default' onClick={() => this.handleModalVisible(true)}>
                {formatMessage({ id: 'validation.new' })}
              </Button>
            </div>
            <NormalTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              //onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>


        <AddSelfRole on={OnAddSelf} data={OnSelfData} />

        <UpdateSelfRole on={OnUpdateSelf} data={OnUpdateData} />

         <Modal
          title="分配权限"
          visible={this.state.distribution}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={700}
          destroyOnClose={true}
        >
           <TreeSelectTransfer dataSource={valueList} rightDataList={this.state.roleData} dataList={this.state.dataList} titles={['分配权限', "已分配权限"]} onChange={this.getTheTree}/>
        </Modal>

        <Modal
          title="设置首页"
          visible={this.state.visibleIndex}
          onOk={this.handleIndex}
          onCancel={this.cancelIndex}
        >
          <Input value={this.state.inputValue} onChange={(e)=>this.chanValue(e)}/>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default RoleAdmins;

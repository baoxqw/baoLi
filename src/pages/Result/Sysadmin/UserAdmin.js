import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
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
  message,
  Transfer,
  Popconfirm,
  Spin
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './UserAdmin.less';
import storage from '@/utils/storage'
const FormItem = Form.Item;

//创建
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleModalVisible, ax, pageIndex} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const object = {
        req:{
          reqData:{
              ...fieldsValue,
              corp_id:1
          },
        },
        pageIndex,
      };
      ax.dispatch({
        type:'sysuser/add',
        payload:object
      });
      form.resetFields();
    });
    handleModalVisible();
  };
  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'validation.createuser' })}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.usercode' })}>
        {form.getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入用户编码！' }],
        })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.username' })}>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入用户名称！' }],
        })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
      </FormItem>
    </Modal>
  );
});

//编辑
const CreateUpdateForm = Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) { //当 Form.Item 子节点的值发生改变时触发，可以把对应的值转存到 Redux store
    props.fields = changedFields
  },
  mapPropsToFields(props) {
    const { name, code } = props.fields;
    return {
      name:Form.createFormField({
        value: name,
      }),
      code:Form.createFormField({
        value: code,
      }),
    }
  }})(props => {
  const { modalVisible, form, handleEditVisible, ax, fields,pageIndex,} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const object = {
        req:{
          reqData:{
            ...fieldsValue,
            corp_id:1,
            id:fields.id
          },
        },
        pageIndex,
      };
      ax.dispatch({
        type:'sysuser/add',
        payload: object
      });
      form.resetFields();
    });
    handleEditVisible();
  };
  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'validation.userediting' })}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleEditVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.usercode' })}>
        {form.getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入用户编码！'}],
        })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.username' })}>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入用户名称！' }],
        })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
      </FormItem>
    </Modal>
  );
});



@connect(({ role, loading }) => ({
  role,
  loading: loading.effects['role/fetch'],
}))
@Form.create()
class AssignRoleForm extends PureComponent  {
  static defaultProps = {
    handleAssignRole: () => {},
    handleAssignRoleModalVisible: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      targetKeys: [],
      selectedKeys: [],
      disabled: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      //type: 'sysuser/fetch',
    });
  }

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  handleScroll = (direction, e) => {

  };

  render() {
    const {
      assignRoleModalVisible,
      handleAssignRoleModalVisible,
      values,
      role,
      loading,
    } = this.props;
    const { data2 } = role;
    const { targetKeys, selectedKeys, disabled } = this.state;

    return (
      <Modal
        destroyOnClose
        title="分配角色"
        visible={assignRoleModalVisible}
        // onOk={okHandle}
        onCancel={() => handleAssignRoleModalVisible(false, values)}
      >
        <Transfer
          dataSource={data2}
          titles={['待选角色', '已选角色']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={this.handleChange}
          onSelectChange={this.handleSelectChange}
          onScroll={this.handleScroll}
          render={item => item.title}
          disabled={disabled}
        />
      </Modal>
    );
  }
}


function arrList(array) {
  let arr = [];
  for(let i=0;i<array.length;i++){
    const data = {
      key: i,
      id: array[i].id,
      title: array[i].name,
      description: array[i].name,
      chosen: Math.random() * 2 > 1,
    };
    arr.push(data);
  }
  return arr
}

@connect(({ sysuser, loading }) => ({
  sysuser,
  loading: loading.models.sysuser
}))
@Form.create()
class UserAdmins extends PureComponent {
  state = {
    modalVisible: false,
    editVisible: false,
    assignRoleModalVisible: false,
    selectedRows: [],
    formValues: {},
    dataList:[],
    visible: false,
    fields: {},
    mockData: [], //左边框数据
    targetKeys: [], //右边框数据
    selectedKeys:[], //存放选中的数据
    create_id:null,
    pageIndex:0,
    userId:null
  };

  showModal = async (record) => {
    await this.setState({
      visible: true,
    });
    const userinfo = storage.get("userinfo");
    const corpId = userinfo.corp.id;
    const userId = record.id;
    this.setState({
      userId
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'sysuser/assign',
      payload:{
        id:record.id,
        pageSize:1000
      },
      callback: res =>{
        /*let newArray = [];
        for(let i=0;i<res.length;i++){
          const data = {
            key: i.toString(),
            id: res[i].id,
            title: res[i].name,
            description: res[i].name,
            chosen: Math.random() * 2 > 1,
          };
          newArray.push(data);
        }
        this.setState({
          mockData:newArray
        });*/
        const obj = {
          reqData:{
            corpId,
            userId,
          }
        };
        dispatch({
          type:'sysuser/even',
          payload: obj,
          callback:async ress =>{
            const left = arrList(res); //右边所有项带上key
            let rightRight = [];  //右边key集合
            /*for(let i=0;i<res.length;i++){
              flag = false
              for(let j=0;j<ress.length;j++){
                if(res[i].id === ress[j].roleId){
                  flag = true;
                  rightRight.push(res[i].key);
                  break
                }
              }
              if(flag===false){
                leftList.push(res[i])
              }
            }*/

            for(let i=0;i<left.length;i++){
              for(let j=0;j<ress.length;j++){
                if(left[i].id === ress[j].roleId){
                  rightRight.push(left[i].key);
                  break
                }
              }
            }

           await this.setState({
              mockData:left,
              targetKeys:rightRight
            });
          }
        })
      }
    });
  };

  columns = [
    {
      title: `${formatMessage({ id: 'validation.code' })}`,
      dataIndex: 'code',
      sorter: true,
    },
    {
      title: `${formatMessage({ id: 'validation.name' })}`,
      dataIndex: 'name',
      sorter: true,
    },

    {
      title: `${formatMessage({ id: 'validation.operation' })}`,
      render: (text, record) => (
        <Fragment>
          <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleDelete(record)}>
            <a href="javascript:;">{formatMessage({ id: 'validation.delete' })}</a>
          </Popconfirm>
          <Divider type="vertical" />
          <span style={{color:'#40a9ff',cursor:'pointer'}} type="primary" onClick={() => this.handleEditVisible(true,record)}>
            {formatMessage({ id: 'validation.update' })}
          </span>
          <Divider type="vertical" />
          <a href='#javascript;' onClick={()=> this.showModal(record)}> {formatMessage({ id: 'validation.delegaterole' })}</a>
        </Fragment>
      ),
    },
  ];

  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const { pageIndex } = this.state;
    dispatch({
      type: 'sysuser/remove',
      payload: {
        id: record.id,
        pageIndex
      }
    })
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'sysuser/find',
      payload: {
        id:1,
        pageIndex:0,
        pageSize:10
      }
    })
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleEditVisible = (flag,record) => {
    const { dispatch } = this.props;
    this.setState({
      editVisible: !!flag,
    });
    if(!this.state.editVisible){
      this.setState({
        fields: record
      })
    }
    /*if(!this.state.editVisible){
      dispatch({
        type: 'sysuser/get',
        payload: record.key,
        put:'save'
      })
    }*/
  };

  handleAssignRoleModalVisible = (flag, record) => {
    this.setState({
      assignRoleModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    /*
      pagination中包含：
        current: 2
        pageSize: 10
        showQuickJumper: true
        showSizeChanger: true
        total: 48
    */
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      pageIndex: pagination.current, //第几页
      pageSize: pagination.pageSize, //每页要展示的数量
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const user = storage.get("userinfo");
    const id = user.corp.id;
    const obj = {
        id,
        pageIndex: pagination.current -1,
        pageSize: pagination.pageSize,
    };
    //const str = JSON.stringify(obj);
    this.setState({
      pageIndex:obj.pageIndex
    });
    dispatch({
      type: 'sysuser/find',
      payload: obj,
    });
  };

  //查询按钮
  handleSearch = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      const {code,name} = values;
      if(code || name){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if(code){
          codeObj = {
            code:'code',
            exp:'like',
            value:code
          };
          await conditions.push(codeObj)
        }
        if(name){
          nameObj = {
            code:'name',
            exp:'like',
            value:name
          };
          await conditions.push(nameObj)
        }
        const obj = {
          conditions,
        };
        dispatch({
          type:'sysuser/find',
          payload: obj
        })
      }
    })
  };

  handleReset = () => {
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    //清空后获取
    dispatch({
      type:'sysuser/find',
      payload: {
        id:1,
        pageIndex:this.state.pageIndex,
        pageSize:10
      }
    })

  };

  handleForm = (e)=>{
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
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
            <FormItem label={formatMessage({ id: 'validation.usercode' })}>
              {getFieldDecorator('code')(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'validation.username' })}>
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


  handleOk =async (e) => {
    const { mockData,targetKeys,pageIndex } = this.state;
    const {dispatch} = this.props;
    let array = []; // id合集
    for(let i=0;i<targetKeys.length;i++){
      array.push(mockData[targetKeys[i]].id)
    }
    const userinfo = storage.get("userinfo");
    const corp_id = userinfo.corp.id;
    const obj = {
      req:{
        id:this.state.userId,
        userDefineInt1:corp_id,
        userDefineStrGroup:array
      },
      pageIndex
    };
    dispatch({
      type:'sysuser/dist',
      payload: obj,
      callback:()=>{
        message.success('委派成功',1.5,()=>{
          this.setState({
            targetKeys:[],
            visible:false
          })
        });
      }
    })
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
      targetKeys:[]
    });
  };
  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  };
  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
  handleSelectChange = async (sourceSelectedKeys, targetSelectedKeys) => {
    await this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  render() {
    const {
      sysuser: { data, list },
      loading,
    } = this.props;
    const { selectedRows, modalVisible,editVisible, assignRoleModalVisible, stepFormValues, fields,pageIndex } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const editMethods = {
      handleEditVisible: this.handleEditVisible,
    };

    const assignRoleMethods = {
      handleAssignRoleModalVisible: this.handleAssignRoleModalVisible,
      handleAssignRole: this.handleAssignRole,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div className={styles.userAdminOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                {formatMessage({ id: 'validation.new' })}
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <CreateForm {...parentMethods} modalVisible={modalVisible}  ax={this.props} pageIndex={pageIndex}/>

        <CreateUpdateForm {...editMethods} modalVisible={editVisible}  ax={this.props} fields={fields} pageIndex={pageIndex}/>

        {/*{stepFormValues && Object.keys(stepFormValues).length ? (
          <AssignRoleForm
            {...assignRoleMethods}
            assignRoleModalVisible={assignRoleModalVisible}
            values={stepFormValues}
          />
        ) : null}*/}

        <Modal
        title={formatMessage({ id: 'validation.assigningroles' })}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>
          <Transfer
            titles={[formatMessage({ id: 'validation.pendingrole' }), formatMessage({ id: 'validation.selectedrole' })]}
            dataSource={this.state.mockData}
            filterOption={this.filterOption}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            data={list}
            render={item => item.title}
          />
        </div>
      </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default UserAdmins;

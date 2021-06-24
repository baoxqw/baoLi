import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import moment from 'moment';
import api from '@/pages/tool/api/api'
import router from 'umi/router';
import storage from '@/utils/storage'
import {
  Checkbox,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  TreeSelect,
  Radio,
  Modal,
  Tree,
  AutoComplete,
  Row,
  Col,
  message,
  Popconfirm,
  Table,
  Tabs,
  Divider,
} from 'antd';
import TreeTable from '../../tool/TreeTable/TreeTable';
import { toTree } from '../../tool/ToTree';
import ModelTable from '../../tool/ModelTable/ModelTable';


const { TreeNode } = TreeSelect;
const { Option } = Select;

const fieldLabe = {
  fundname: '项目名称',
  fundtype: '项目类型',
  projector: '立项人',
  projectdate: '立项日期',
  projectmanager: '项目负责人',
  projectresponsibledepartment: '项目负责部门',
  itemamount: '项目经费(元)',
  costbudget: '成本预算(元)',
  projectschedulestart: '项目工期计划(开始)',
  projectschedulestop: '项目工期计划(结束)',
  externalexpenses: '外委费用(元)',
  taxrate: '税率',
  subcontractingratio: '分包比例(%)',
  professionalsubcontracting: '分包金额(元)',
  system: '系统内外',
  projectgrading: '项目分级',
  signingtime: '合同签订时间',
  acceptancetime: '合同验收时间',
  customertype: '客户类型',
  contractcontent: '合同内容',
  contractamount: '合同金额',
  additionalcharges: '额外费用',
  eca: '有效合同额',
  projectaddress: '项目所在地',
  paymentsitustion: '付款情况(%)',
  balance: '余额(万元)',
  businessleader: '商务负责人',
  p1: 'p1',
  p2: 'p2',
  p3: 'p3',
  p4: 'p4',
  p5: 'p5',
  p6: 'p6',
  cca: '贡献合同额',
  comname: '客户名称',
};

const dataAddKey = (data) => {
  return data.map((item) => {
    item.key = item.id;
    if (item.children) {
      dataAddKey(item.children);
    }
    return item;
  });
};


@connect(({ TL,pd, loading }) => ({
  TL,
  pd,
  loading: loading.models.TL,
}))
@Form.create()
class TravelAdd extends PureComponent {
  state = {
    deptId:null,//负责部门
    deptName:null,
    departmentTreeValue:[],

    TableData:[],
    SelectValue:[],
    selectedRowKeys:[],
    Sconditions:[],

    TablePersonData:[],
    SelectPersonValue:[],
    selectedRowPersonKeys:[],
    PersonConditions:[],
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode defaultExpandAll title={item.name} key={item.id} value={item.id}  dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} value={item.id} dataRef={item}/>;
    });

  onFocusDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pd/fetchDept',
      payload: {
        reqData: {},
      },
      callback: (res) => {
        const a = toTree(res);
        this.setState({
          departmentTreeValue: a,
        });
      },
    });
  };

  onChangDepartment = (value, label, extra) => {
    this.setState({
      deptId: value,
    });
  };

  onSave = (onSave)=>{
    const { form } = this.props;
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        billcode:values.billcode?values.billcode:null,
        billdate:values.billdate.format('YYYY-MM-DD'),
        deptId:this.state.deptId, //部门id
        psnId:this.state.selectedRowPersonKeys[0],
        projectId:this.state.selectedRowKeys[0],
        mny:values.mny?values.mny:null,
        status:"初始状态",
        travaldays:values.travaldays?Number(values.travaldays):null, //出差天数
        memo:values.memo,
      };
      if(typeof onSave === 'function'){
        onSave(obj,this.clear);
      }
    })
  };

  onSubmit = (onOk)=>{
    if(typeof onOk === 'function'){
      onOk()
    }
  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }
  clear = ()=> {
    if(typeof onCancel === 'function'){
      onCancel()
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      deptId:null,//负责部门
      deptName:[],
      departmentTreeValue:[],

      TableData:[],
      SelectValue:[],
      selectedRowKeys:[],
      Sconditions:[],

      TablePersonData:[],
      SelectPersonValue:[],
      selectedRowPersonKeys:[],
      PersonConditions:[],

      record:{}
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
      data,
      on
    } = this.props;

    const { visible,submitId } = data;
    const { onOk,onCancel,onSave } = on;

    const onClick = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'TL/fetchProject',
          payload:{
            pageIndex:0,
            pageSize:10
          },
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      },
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.projectname
        });
        onChange(nameList)
        this.setState({
          SelectValue:nameList,
          selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { Sconditions } = this.state;
        const param = {
          ...obj
        };
        if(Sconditions.length){
          dispatch({
            type:'TL/fetchProject',
            payload:{
              Sconditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'TL/fetchProject',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
        //点击查询调的方法 参数是个对象  就是输入框的值
        const { dispatch } = this.props;
        const { projectname,status,type } = values;
        if(projectname || status || type) {
          let Sconditions = [];
          let codeObj = {};
          let nameObj = {};
          let typeObj = {}

          if (projectname) {
            codeObj = {
              code: 'projectname',
              exp: 'like',
              value: projectname
            };
            Sconditions.push(codeObj)
          }
          if (status) {
            nameObj = {
              code: 'status',
              exp: 'like',
              value: status
            };
            Sconditions.push(nameObj)
          }
          if (type) {
            typeObj = {
              code: 'type',
              exp: 'like',
              value: type
            };
            Sconditions.push(typeObj)
          }
          this.setState({
            Sconditions
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions:Sconditions,
          };
          dispatch({
            type: 'TL/fetchProject',
            payload: obj,
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          })
        }else{
          this.setState({
            Sconditions:[]
          });
          dispatch({
            type: 'RR/fetchProject',
            payload: {
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { dispatch } = this.props;
        this.setState({
          Sconditions:[]
        });
        dispatch({
          type: 'TL/fetchProject',
          payload: {
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectValue:[],
          selectedRowKeys:[],
        })
      }
    };
    const dataClick = {
      TableData:this.state.TableData,
      SelectValue:this.state.SelectValue,
      selectedRowKeys:this.state.selectedRowKeys,
      columns : [
        {
          title: '项目名称',
          dataIndex: 'projectname',
        },
        {
          title: '项目类型',
          dataIndex: 'type',
        },
        {
          title: '项目负责人',
          dataIndex: 'projectmanagerName',
        },
        {
          title:'负责部门',
          dataIndex: 'deptName',
        },
        {
          title:'申请单状态',
          dataIndex: 'status',
        },
        {
          title:'',
          dataIndex: 'caozuo',
        },
      ],
      fetchList:[
        {label:'项目名称',code:'projectname',placeholder:'请输入项目名称'},
        {label:'申请单状态',code:'status',placeholder:'请输申请单状态'},
      ],
      title:'项目名称',
      placeholder:'请选择项目名称',
    };

    const onPerson = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'TL/fetchPerson',
          payload:{
            pageIndex:0,
            pageSize:10
          },
          callback:(res)=>{
            this.setState({
              TablePersonData:res,
            })
          }
        })
      },
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectPersonValue:nameList,
          selectedRowPersonKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { PersonConditions } = this.state;
        const param = {
          ...obj
        };
        if(PersonConditions.length){
          dispatch({
            type:'TL/fetchPerson',
            payload:{
              conditions:PersonConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'TL/fetchPerson',
          payload:param,
          callback:(res)=>{
            this.setState({
              TablePersonData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
        //点击查询调的方法 参数是个对象  就是输入框的值
        const { dispatch } = this.props;
        const { code, name } = values;
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
            conditions.push(codeObj)
          }
          if(name){
            nameObj = {
              code:'name',
              exp:'like',
              value:name
            };
            conditions.push(nameObj)
          }
          this.setState({
            PersonConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'TL/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          })
        }else{
          this.setState({
            PersonConditions:[]
          });
          dispatch({
            type:'TL/fetchPerson',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { dispatch } = this.props;
        this.setState({
          PersonConditions:[]
        });
        dispatch({
          type: 'TL/fetchPerson',
          payload: {
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TablePersonData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectPersonValue:[],
          selectedRowPersonKeys:[],
        })
      }
    };
    const dataPerson = {
      TableData:this.state.TablePersonData,
      SelectValue:this.state.SelectPersonValue,
      selectedRowKeys:this.state.selectedRowPersonKeys,
      columns : [
        {
          title: '人员编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '人员名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '部门',
          dataIndex: 'deptname',
          key: 'deptname',
        },
        {
          title: '',
          dataIndex: 'caozuo',
        },
      ],
      fetchList:[
        {label:'人员编码',code:'code',placeholder:'请输入人员编码'},
        {label:'人员名称',code:'name',placeholder:'请输入人员名称'},
      ],
      title:'报销人',
      placeholder:'请选择报销人',
    };
    return (
        <Modal
          title={"新建"}
          visible={visible}
          width='80%'
          destroyOnClose
          centered
          onOk={()=>this.onSave(onSave)}
          onCancel={()=>this.handleCancel(onCancel)}
          >
          <div>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='单据号'>
                  {getFieldDecorator('billcode', {
                  })(<Input placeholder="系统默认生成" disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='单据日期'>
                  {getFieldDecorator('billdate', {
                    rules: [
                      {
                        required: true,
                      }
                    ],
                  })(<DatePicker style={{width:'100%'}} />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='负责部门'>
                  {getFieldDecorator('deptId',{
                    rules: [
                      {
                        required: true,
                        message:'请选择项目负责部门'
                      }
                    ]
                  })(
                    <TreeSelect
                      treeDefaultExpandAll
                      style={{ width: '100%' }}
                      onFocus={this.onFocusDepartment}
                      onChange={this.onChangDepartment}
                      placeholder="请选择负责部门"
                    >
                      {this.renderTreeNodes(this.state.departmentTreeValue)}
                    </TreeSelect >

                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="报销人">
                  {getFieldDecorator('psnId',{
                    rules: [
                      {
                        required: true,
                        message:'请选择项报销人'
                      }
                    ],
                  })(
                    <ModelTable
                      on={onPerson}
                      data={dataPerson}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="所属项目">
                  {getFieldDecorator('projectId',{
                    rules: [{required: true,message:'请选择所属项目'}],
                  })(
                    <ModelTable
                      on={onClick}
                      data={dataClick}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='出差天数'>
                  {getFieldDecorator('travaldays', {
                  })(<Input placeholder="请输入出差天数" type={"Number"}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="单据状态">
                  {getFieldDecorator('status',{
                    initialValue:"初始状态"
                  })(
                    <Input placeholder={"初始状态"} disabled/>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='备注'>
                  {getFieldDecorator('memo', {
                  })(<Input placeholder="请输入备注" style={{ width: '100%' }}/>)}
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Modal>
    );
  }
}

export default TravelAdd;

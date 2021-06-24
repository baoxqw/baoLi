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
  Checkbox,
  InputNumber,
  Tree,
  Icon,
  Tooltip,
  Modal,
  Select,
  message,
  Popconfirm,
} from 'antd';
import { toTree } from '../../tool/ToTree';
import ModelTable from '../../tool/ModelTable/ModelTable';
import ManyTable from '@/pages/tool/ManyTable/ManyTable';
import moment from 'moment'
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

@connect(({ RR, loading }) => ({
  RR,
  loading: loading.models.RR,
}))
@Form.create()
class ReimbursementRormAdd extends PureComponent {
  state = {
    TableData:[],
    SelectValue:[],
    selectedRowKeys:[],
    Sconditions:[],

    //部门
    deptId:[],
    deptTreeValue:[],

    id:null,
    name:'',

    TablePersonData:[],
    SelectPersonValue:[],
    selectedRowPersonKeys:[],
    PersonConditions:[],


    TableManyData:[],
    SelectManyValue:[],
    selectedRowManyKeys:[],
    Mconditions:[],

    travelfee:null,
    taxrate:null,
    tax:null,
  };

  onsubmit = (onOk)=>{
    if(typeof onOk === 'function'){
      onOk()
    }
  }

  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'RR/fetchDept',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        const a = toTree(res);
        this.setState({
          deptTreeValue:a
        })
      }
    });
  }

  onChangDepartment=(value, label, extra)=>{

    this.setState({
      deptId:value
    })
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name}  key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name}  key={item.id} />;
    });

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.clear)
    }
  }

  onSave = (onSave)=>{
    const { form } = this.props;
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        billcode:values.billcode,
        billdate:values.billdate.format('YYYY-MM-DD'),
        projectId:this.state.selectedRowKeys[0],
        deptId:this.state.deptId, //部门id
        psnId:this.state.selectedRowPersonKeys[0],
        status:values.status,
        memo:values.memo,
        totaldays:values.totaldays?Number(values.totaldays):null,
        travaldays:values.travaldays?Number(values.travaldays):null,
        workdays:values.totaldays?Number(values.workdays):null,
        //msnTemplateHId:this.state.selectedRowManyKeys,
        finishphase:this.state.selectedRowManyKeys.join(","),
        travelfee:values.travelfee?Number(values.travelfee):null,
        taxrate:values.taxrate?Number(values.taxrate):null,
        tax:values.tax?Number(values.tax):null,
        subsidy:values.subsidy?Number(values.subsidy):null,
      };

      if(typeof onSave === 'function'){
        onSave(obj,this.clear);
      }
    })
  };

  clear = ()=>{
    const { form } = this.props;
    form.resetFields();
    this.setState({
      TableData:[],
      SelectValue:[],
      selectedRowKeys:[],
      Sconditions:[],

      //部门
      deptId:[],
      deptTreeValue:[],

      psnId:null,
      psnName:'',

      record:{},

      TablePersonData:[],
      SelectPersonValue:[],
      selectedRowPersonKeys:[],
      PersonConditions:[],

      TableManyData:[],
      SelectManyValue:[],
      selectedRowManyKeys:[],
      Mconditions:[],

      travelfee:null,
      taxrate:null,
      tax:null,
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.data.id !== this.props.data.id){
      const id = nextProps.data.id;
      const name = nextProps.data.name;
      this.setState({
        id,
        name
      })
    }
  }

  onTravelfee = (e)=>{
    const travelfee = Number(e.target.value);
    const taxrate = this.state.taxrate;
    let tax = null;
    if(!taxrate){
      tax = 0
    }else{
      tax = ((travelfee/(1 + taxrate))*taxrate).toFixed(4);
    }
    if(!travelfee){
      tax = 0
    }
    this.setState({
      travelfee,
      tax
    })
  }

  onTaxrate = (e)=>{
    const taxrate = Number(e.target.value);
    const travelfee = this.state.travelfee; //报销金额
    let tax = null;
    if(!travelfee){
      tax = 0
    }else{
      tax = ((travelfee/(1 + taxrate))*taxrate).toFixed(4);
    }
    if(!taxrate){
      tax = 0
    }
    this.setState({
      taxrate,
      tax
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      on,
      data
    } = this.props;
    const { selectedRowKeys } = this.state;

    const { visible,submitId } = data;
    const { onOk,onCancel,onSave } = on;

    const onClick = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'RR/fetchProject',
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
          SelectManyValue:[],
          selectedRowManyKeys:[],
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
            type:'RR/fetchProject',
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
          type:'RR/fetchProject',
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
            type: 'RR/fetchProject',
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
          type:'RR/fetchPerson',
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
            type:'RR/fetchPerson',
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
          type:'RR/fetchPerson',
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
            type:'RR/fetchPerson',
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
            type:'RR/fetchPerson',
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
          type: 'RR/fetchPerson',
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

    const onMany = {
      onIconClick:()=>{
        const { dispatch } = this.props;

        if(selectedRowKeys.length){
          dispatch({
            type:'RR/fetchProjectTypeFind',
            payload:{
              pageIndex:0,
              pageSize:10,
              conditions:[{
                code: 'PROJECT_ID',
                exp: '=',
                value: selectedRowKeys[0]
              },{
                code: 'TYPE',
                exp: '=',
                value: "项目"
              }]
            },
            callback:(res)=>{
              this.setState({
                TableManyData:res,
              })
            }
          })
        }
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
          SelectManyValue:nameList,
          selectedRowManyKeys:selectedRowKeys
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { Mconditions } = this.state;
        const param = {
          ...obj,
        };
        if(Mconditions.length>2){
          dispatch({
            type:'RR/fetchProjectTypeFind',
            payload:{
              conditions:Mconditions,
              ...param,
            },
            callback:(res)=>{
              this.setState({
                TableManyData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'RR/fetchProjectTypeFind',
          payload:{
            ...obj,
            conditions:[{
              code: 'PROJECT_ID',
              exp: '=',
              value: selectedRowKeys[0]
            },{
              code: 'TYPE',
              exp: '=',
              value: "项目"
            }]
          },
          callback:(res)=>{
            this.setState({
              TableManyData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
        //点击查询调的方法 参数是个对象  就是输入框的值

        const { dispatch } = this.props;
        const { name,ratio } = values;
        if(name || ratio) {
          let Mconditions = [{
            code: 'PROJECT_ID',
            exp: '=',
            value: selectedRowKeys[0]
          },{
            code: 'TYPE',
            exp: '=',
            value: "项目"
          }];
          let nameObj = {};
          let ratioObj = {}

          if (name) {
            nameObj = {
              code: 'name',
              exp: 'like',
              value: name
            };
            Mconditions.push(nameObj)
          }
          if (ratio) {
            ratioObj = {
              code: 'ratio',
              exp: 'like',
              value: ratio
            };
            Mconditions.push(ratioObj)
          }
          this.setState({
            Mconditions
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions:Mconditions,
          };
          dispatch({
            type: 'RR/fetchProjectTypeFind',
            payload: obj,
            callback:(res)=>{
              this.setState({
                TableManyData:res,
              })
            }
          })
        }else{
          this.setState({
            Mconditions:[{
              code: 'PROJECT_ID',
              exp: '=',
              value: selectedRowKeys[0]
            },{
              code: 'TYPE',
              exp: '=',
              value: "项目"
            }]
          });
          dispatch({
            type: 'RR/fetchProjectTypeFind',
            payload: {
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableManyData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { dispatch } = this.props;
        this.setState({
          Mconditions:[]
        });
        dispatch({
          type: 'RR/fetchProjectTypeFind',
          payload: {
            pageIndex:0,
            pageSize:10,
            conditions:[{
              code: 'PROJECT_ID',
              exp: '=',
              value: selectedRowKeys[0]
            },{
              code: 'TYPE',
              exp: '=',
              value: "项目"
            }]
          },
          callback:(res)=>{
            this.setState({
              TableManyData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectManyValue:[],
          selectedRowManyKeys:[],
        })
      }
    };
    const dataMany = {
      columns : [
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '里程碑节点',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '里程碑类型',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '里程碑占比',
          dataIndex: 'ratio',
          key: 'ratio',
        },
        {
          title: '里程碑结果',
          dataIndex: 'milestoneoutcome',
          key: 'milestoneoutcome',
        },
        {
          title: '预计完成时间',
          dataIndex: 'estimateenddate',
          key: 'estimateenddate',
        },
        {
          title: '',
          dataIndex: 'operation',
          key: 'operation',
        },
      ],
      TableData:this.state.TableManyData,
      SelectValue:this.state.SelectManyValue,
      selectedRowKeys:this.state.selectedRowManyKeys,
      fetchList:[
        {label:'里程碑节点',code:'name',placeholder:'请输入里程碑节点'},
        {label:'里程碑占比',code:'ratio',type:()=><Input type={'Number'} placeholder={'请输入里程碑占比'}/>},
      ],
      title:'项目阶段',
      placeholder:'请选择项目阶段',
      disabled:!this.state.selectedRowKeys.length
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
        /*footer={
          [

            <Button type="primary" key={2} onClick={()=>this.onSave(onSave)}>保存</Button>,
            <Button type="primary" key={3} disabled={submitId?0:1} onClick={()=>this.onsubmit(onOk)}>提交</Button>,
            <Button onClick={()=>this.handleCancel(onCancel)} key={1} >取消</Button>,
          ]}*/
      >
        <div style={{padding:'0 24px',height:document.body.clientHeight/1.5,overflow:"auto"}}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="单据号">
                <Input placeholder="系统默认生成" disabled/>
                {/*{getFieldDecorator('billcode',{
                  rules: [{required: true,message:'请填写单据号'}]
                })(<Input placeholder="请填写单据号" />)}*/}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="单据日期">
                {getFieldDecorator('billdate',{
                  rules: [
                    {
                      required: true,
                      message:'请选择单据日期'
                    }
                  ]
                })(
                  <DatePicker  placeholder="请选择单据日期" style={{ width: '100%' }}/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="部门">
                {getFieldDecorator('deptname', {
                  rules: [
                    {
                      required: true,
                      message:'请选择部门'
                    }
                  ]
                })(<TreeSelect
                  treeDefaultExpandAll
                  style={{ width: '100%' }}
                  onFocus={this.onFocusDepartment}
                  onChange={this.onChangDepartment}
                  placeholder="请选择负责部门"
                >
                  {this.renderTreeNodes(this.state.deptTreeValue)}
                </TreeSelect >)}
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
                    }
                  ],
                  initialValue:this.state.SelectPersonValue
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
                  rules: [
                    {
                      required: true,
                    }
                  ],
                  initialValue: this.state.SelectValue
                })(<ModelTable
                  on={onClick}
                  data={dataClick}
                />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="项目阶段">
                {getFieldDecorator('finishphase',{
                  rules: [
                    {
                      required: true,
                      message:'请选择项目阶段'
                    }
                  ],
                  initialValue:this.state.SelectManyValue
                })(
                  <ManyTable on={onMany} data={dataMany}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="总天数">
                {getFieldDecorator('totaldays',{
                  rules: [
                    {
                      required: true,
                    }
                  ],
                })(
                  <Input placeholder={"请输入总天数"} type={"Number"}/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="交通天数">
                {getFieldDecorator('travaldays',{
                  rules: [
                    {
                      required: true,
                    }
                  ],
                })(<Input placeholder={"请输入交通天数"} type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="工作天数">
                {getFieldDecorator('workdays',{
                  rules: [
                    {
                      required: true,
                    }
                  ]
                })(
                  <Input placeholder={"请输入工作天数"} type={"Number"} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="状态">
                {getFieldDecorator('status',{
                  initialValue:'初始状态',
                  rules: [
                    {
                      required: true,
                      message:'请输入状态'
                    }
                  ]
                })(
                  <Input placeholder="请输入状态"  disabled/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="交通费">
                {getFieldDecorator('travelfee',{
                  rules: [
                    {
                      required: true,
                    }
                  ]
                })(
                  <Input placeholder="请输入交通费" type={"Number"} onChange={this.onTravelfee}/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="税率">
                {getFieldDecorator('taxrate',{
                })(<Input placeholder="请输入税率" type='Number' onChange={this.onTaxrate}/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="税额">
                {getFieldDecorator('tax', {
                  initialValue:this.state.tax
                })(<Input placeholder="请输入税额" type='Number' disabled/>)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="补贴">
                {getFieldDecorator('subsidy', {
                  rules: [
                    {
                      required: true,
                      message:'请输入补贴'
                    }
                  ],
                })(<Input placeholder="请输入补贴" type='Number'/>)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>

            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={24} md={24} sm={24}>
              <Form.Item label="备注">
                {getFieldDecorator('memo',{
                })(
                  <TextArea rows={3}/>
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default ReimbursementRormAdd;


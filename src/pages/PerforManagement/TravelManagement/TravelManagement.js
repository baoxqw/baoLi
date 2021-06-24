import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import { formatMessage, FormattedMessage } from 'umi/locale';
import ExportJsonExcel from 'js-export-excel';
import {
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  Card,
  Spin,
  Divider,
  Icon,
  Table,
  Row,
  Modal,
  Badge,
  Menu,
  Dropdown,
  Col,
  message,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ travel,TL, loading }) => ({
  travel,
  TL,
  loading: loading.models.travel,
  loadingList:loading.effects['TL/fetchList'],
  loadingFetch:loading.effects['travel/fetch'],
}))
@Form.create()
class TravelManagement extends PureComponent {
  state = {
    changeVisible:false,
    deleteVisible:false,
    superId:null,
    childData:[],
    expandedRowKeys:[],
    daoChu:[],
    resColumns:[
      {
        title: '项目名称',
        dataIndex: 'projectname',
        key:'projectname',
      },
      {
        title:'立项时间',
        dataIndex:'initiationdate',
        key:'initiationdate',
      },
      {
        title:'竣工时间',
        dataIndex:'closeoutdate',
        key:'closeoutdate',
      },
      {
        title:'总费用',
        dataIndex:'travelMny',
      },
      {
        title:'项目状态',
        dataIndex:'status',
        key:'status',
      },
      {
        title:'项目地址',
        dataIndex:'projectaddress',
        key:'projectaddress',
      },
    ],
    resColumns2:[
      {
        title: '单据号',
        dataIndex: 'billcode',
      },
      {
        title: '单据日期',
        dataIndex: 'billdate',
      },
      {
        title: '所属项目',
        dataIndex: 'projectName',
      },
      {
        title: '部门',
        dataIndex: 'deptName',
      },
      {
        title: '报销人',
        dataIndex: 'psnName',
      },
      {
        title: '单据状态',
        dataIndex: 'status',
      },
      {
        title: '出差天数',
        dataIndex: 'travaldays',
      },
      {
        title: '收支项目',
        dataIndex: 'costsubjname',
      },
      {
        title: '报销金额',
        dataIndex: 'claimingamount',
      },
      {
        title: '税率',
        dataIndex: 'taxrate',
      },
      {
        title: '税金',
        dataIndex: 'taxamount',
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
    ],
    TableData:[],
    SelectValue:[],
    selectedRowKeys:[],
    conditions:[],
    expandForm:false,

    lookShow:false,
    lookFile:[],

    lookTicketShow:false,

    previewVisible: false,
    previewImage: '',
  };

  componentDidMount() {

    const { dispatch } = this.props;
    //主表
    dispatch({
      type:'travel/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      },
      callback:(res)=>{
        console.log("数据",res)
        this.setState({
          daoChu:res,
        })
      }
    })

  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const { projectname, closeoutdate } = values;
      if(projectname || closeoutdate){
        let conditions = [];
        let codeObj = {};
        let startObj = {};
        let endObj = {};

        if(projectname){
          codeObj = {
            code:'id',
            exp:'=',
            value:this.state.selectedRowKeys[0]
          };
          conditions.push(codeObj)
        }
        if(closeoutdate){
          startObj = {
            code:'enddate',
            exp:'>=',
            value:closeoutdate[0].format('YYYY-MM-DD')
          };
          conditions.push(startObj)
        }
        if(closeoutdate){
          endObj = {
            code:'enddate',
            exp:'<=',
            value:closeoutdate[1].format('YYYY-MM-DD')
          };
          conditions.push(endObj)
        }

        this.setState({
          conditions
        })
        const obj = {
          conditions,
        };
        dispatch({
          type:'travel/fetch',
          payload:obj,
          callback:(res)=>{
            this.setState({
              daoChu:res
            })
          }
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'RW/fetch',
          payload:{},
          callback:(res)=>{
            this.setState({
              daoChu:res
            })
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
      selectedRowKeys:[],
    })
    //清空后获取列表
    dispatch({
      type:'travel/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
      },
      callback:(res)=>{
        this.setState({
          daoChu:res
        })
      }
    });
  }

  AllPromise = (daoChu) =>{
    const { dispatch } = this.props;
    const allDaoChu = daoChu.list.map((item) =>{
      return new Promise(resolve => {
        let conditions = [{
          code:'PROJECT_ID',
          exp:'=',
          value:item.projectId?item.projectId:''
        },{
          code:'STATUS',
          exp:'=',
          value:item.status?item.status:''
        }];
        dispatch({
          type:'travel/fetchChild',
          payload:{
            conditions
          },
          callback:(res)=>{
            resolve(res.resData)
          }
        })
      })
    });
    return Promise.all(allDaoChu).then((result)=>{
      result = result.filter(item => item !== null);
      let arr = [];
      result.map(item =>{
        arr = arr.concat(item)
      });
      let countArr = [];
      const data = daoChu.list;
      for(let i=0;i<data.length;i++){
        if(!data[i].projectId){
          countArr.push(data[i]);
          continue;
        }
        let status = false;
        for(let j=0;j<arr.length;j++){
          if(data[i].projectId === arr[j].projectId){
            const obj = {
              ...data[i],
              ...arr[j]
            };
            countArr.push(obj);
            status = true;
          }
        }
        if(!status){
          countArr.push(data[i]);
        }
      }
      return countArr
    })
  };

  daoChu = () =>{
    const { resColumns,resColumns2,daoChu } = this.state;
    const columns = [...resColumns,...resColumns2];
    this.AllPromise(daoChu).then((res)=>{
      if(res){
        let option={};
        let dataTable = [];
        let arr = []; //保存key
        res.map((item)=>{
          let obj = {};
          columns.map(ite => {
            const title = ite.title;
            const dataIndex = ite.dataIndex;
            for(let key in item){
              if(key === dataIndex){
                obj[title] = item[key]
              }
            }
          });
          dataTable.push(obj);
        });

        if(dataTable.length){
          for(let key in dataTable[0]){
            arr.push(key)
          }
        }
        option.fileName = '项目经理绩效';
        option.datas=[
          {
            sheetData:dataTable,
            sheetName:'sheet',
            sheetFilter:arr,
            sheetHeader:arr,
          }
        ];

        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
      }else{
        message.error("没有数据可导出");
      }
    })
  };

  AllPromise2 = (daoChu) =>{
    const { dispatch } = this.props;
    const allDaoChu = daoChu.list.map((item) =>{
      return new Promise(resolve => {
        let conditions = [{
          code:'PROJECT_ID',
          exp:'=',
          value:item.id
        },{
          code:'STATUS',
          exp:'=',
          value:"审批通过"
        }];
        dispatch({
          type:'travel/fetchChild',
          payload:{
            conditions
          },
          callback:(res)=>{
            console.log("返回值",res)
            resolve(res.resData)
          }
        })
      })
    });
    return Promise.all(allDaoChu).then((result)=>{
      console.log("result",result)
      result = result.filter(item => item !== null);
      let arr = [];
      result.map(item =>{
        arr = arr.concat(item)
      });
      return arr
    })
  };

  SuperDaoChu = ()=>{
    const { resColumns,daoChu } = this.state;
    if(!daoChu.list.length){
      return message.error("暂无数据导出")
    }
    console.log("导出",daoChu)
    let option={};
    let dataTable = [];
    let arr = []; //保存key
    daoChu.list.map((item)=>{
      let obj = {}
      resColumns.map(ite => {
        const title = ite.title;
        const dataIndex = ite.dataIndex;
        for(let key in item){
          if(key === dataIndex){
            obj[title] = item[key]
          }
        }
      });
      dataTable.push(obj);
    });
    if(dataTable.length){
      for(let key in dataTable[0]){
        arr.push(key)
      }
    }
    option.fileName = '差旅费项目统计';
    option.datas=[
      {
        sheetData:dataTable,
        sheetName:'sheet',
        sheetFilter:arr,
        sheetHeader:arr,
      }
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    console.log("option",option)
  }

  ChildDaoChu = async ()=>{
    const { daoChu } = this.state;
    const res = await this.AllPromise2(daoChu);
    if(!res.length){
      return message.error("没有人员数据可以导出")
    }
    console.log("res",res)
    let option={};
    let dataTable = [];
    res.map((item)=>{
      let obj = {
        '项目名称':item.projectName,
        '姓名':item.psnName,
        '报销金额':item.claimingamount
      };
      dataTable.push(obj)
    });

    option.fileName = '差旅费统计';
    option.datas=[
      {
        sheetData:dataTable,
        sheetName:'sheet',
        sheetFilter:["项目名称","姓名","报销金额"],
        sheetHeader:["项目名称","姓名","报销金额"],
      }
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  TongJi = () =>{
    this.SuperDaoChu();
    this.ChildDaoChu();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      dispatch,
      loadingFetch
    } = this.props;

    const on = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'travel/fetchProject',
          payload:{
            pageIndex:0,
            pageSize:10,
            conditions:[{
              code:'STATUS',
              exp:'=',
              value:"审批通过"
            }]
          },
          callback:(res)=>{
            if(res){
              this.setState({
                TableData:res,
              })
            }
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
          selectedRowKeys
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { conditions } = this.state;
        const param = {
          ...obj
        };
        if(conditions.length){
          dispatch({
            type:'travel/fetchProject',
            payload:{
              conditions:[
                ...conditions,
                {
                  code:'STATUS',
                  exp:'=',
                  value:"审批通过"
                }
              ],
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
          type:'travel/fetchProject',
          payload:{
            conditions:[{
              code:'STATUS',
              exp:'=',
              value:"审批通过"
            }],
            ...param
          },
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
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
            conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions:[
              ...conditions,
              {
                code:'STATUS',
                exp:'=',
                value:"审批通过"
              }
            ],
          };
          dispatch({
            type:'travel/fetchProject',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          })
        }else{
          this.setState({
            conditions:[]
          })
          dispatch({
            type:'travel/fetchProject',
            payload:{
              pageIndex:0,
              pageSize:10,
              conditions:[{
                code:'STATUS',
                exp:'=',
                value:"审批通过"
              }]
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
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'travel/fetchProject',
          payload:{
            pageIndex:0,
            pageSize:10,
            conditions:[{
              code:'STATUS',
              exp:'=',
              value:"审批通过"
            }]
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
    const data = {
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
          title:'操作',
          dataIndex: 'caozuo',
        },
      ],
      fetchList:[
        {label:'申请编号',code:'code',placeholder:'请输入申请编号'},
        {label:'项目名称',code:'projectname',placeholder:'请输入项目名称'}
      ],
      title:'项目名称',
      placeholder:'请选择项目名称',
      width:200
    };
    const { expandForm } = this.state
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 18, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='项目名称'>
              {getFieldDecorator('projectname')(
                <ModelTable
                  on={on}
                  data={data}
                />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='项目竣工时间段'>
              {getFieldDecorator('closeoutdate')( <RangePicker  style={{width:'200px',marginLeft:'10px'}}/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
              {/*{
                expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起
                  <Icon type="up" />
                </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开
                  <Icon type="down" />
                </a>
              }*/}
            </span>
          </Col>
        </Row>
        {/* {expandForm? <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='个人提成'>
              {getFieldDecorator('status')(
                <Input placeholder={'请输入个人提成'} type={'Number'}/>
              )}
            </FormItem>
          </Col>
        </Row>:''}*/}
        <div style={{margin:'12px 0'}}>
          {/*<Button type='primary' onClick={this.daoChu}>
            导出
          </Button>*/}
          <Button type='primary' loading={loadingFetch} onClick={this.TongJi}>
            报表统计
          </Button>
        </div>
      </Form>
    );
  }

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
    const { conditions} = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    if(conditions.length){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'travel/fetch',
        payload: param,
        callback:(res)=>{
          this.setState({
            daoChu:res
          })
        }
      });
      return
    }
    dispatch({
      type:'travel/fetch',
      payload: obj,
      callback:(res)=>{
        this.setState({
          daoChu:res
        })
      }
    });

  };

  download = ()=>{
    const { daoChu,resColumns } = this.state;
    if(daoChu && daoChu.list){
      let option={};
      let dataTable = [];
      let arr = []; //保存key
      daoChu.list.map((item)=>{
        let obj = {}
        resColumns.map(ite => {
          const title = ite.title;
          const dataIndex = ite.dataIndex;
          for(let key in item){
            if(key === dataIndex){
              obj[title] = item[key]
            }
          }
        })
        dataTable.push(obj);
      });
      if(dataTable.length){
        for(let key in dataTable[0]){
          arr.push(key)
        }
      }
      option.fileName = '项目收款统计';
      option.datas=[
        {
          sheetData:dataTable,
          sheetName:'sheet',
          sheetFilter:arr,
          sheetHeader:arr,
        }
      ];
      const toExcel = new ExportJsonExcel(option);
      toExcel.saveExcel();
    }else{
      message.error("没有数据可导出");
    }
  }

  onClickColumns = (res)=>{
    res = res.filter(item=>item.title !== "操作")
    this.setState({
      resColumns:res
    })
  }

  onClickColumns2 = (res)=>{
    res = res.filter(item=>item.title !== "操作")
    this.setState({
      resColumns2:res
    })
  }


  lookTicket = (e,record)=>{
    e.preventDefault();
    const { dispatch } = this.props
    this.setState({lookTicketShow:true})
    dispatch({
      type:'TL/fetchList',
      payload:{
        reqData:{
          bill_id:record.travelId,
          type:'invoice'
        }
      },
      callback:(response)=>{
        this.setState({lookFileTicket:response})
      }
    });
  }

  lookFileThing = (e,record)=>{
    e.preventDefault();
    const { dispatch } = this.props
    this.setState({lookShow:true})
    dispatch({
      type:'TL/fetchList',
      payload:{
        reqData:{
          bill_id:record.travelId,
          type:'wmtravelclaimform'
        }
      },
      callback:(response)=>{
        console.log("附件",response)
        this.setState({lookFile:response})
      }
    });
  }

  noTicketShow = ()=>{
    this.setState({
      lookTicketShow:false,
      lookFileTicket:[]
    })
  }

  noShow = ()=>{
    this.setState({
      lookShow:false,
      lookFile:[]
    })
  }

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  render() {
    const {
      form:{ getFieldDecorator },
      loading,
      travel:{ data },
      loadingList
    } = this.props;
    const { childData }= this.state
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'projectname',
        key:'projectname',
      },
      {
        title:'立项时间',
        dataIndex:'initiationdate',
        key:'initiationdate',
      },
      {
        title:'竣工时间',
        dataIndex:'closeoutdate',
        key:'closeoutdate',
      },
      {
        title:'总费用',
        dataIndex:'travelMny',
        render:(text,record)=>{
          if(text){
            return (text).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
          }else{return "0.00"}
        }
      },
      {
        title:'项目状态',
        dataIndex:'status',
        key:'status',
      },
      {
        title:'项目地址',
        dataIndex:'projectaddress',
        key:'projectaddress',
      },
      {
        title:'',
        dataIndex:'caozuo',
        width:1
      },
    ];
    const expandedRowRender = () => {
      const columns = [
        {
          title: '单据号',
          dataIndex: 'billcode',
        },
        {
          title: '单据日期',
          dataIndex: 'billdate',
        },
        {
          title: '所属项目',
          dataIndex: 'projectName',
        },
        {
          title: '部门',
          dataIndex: 'deptName',
        },
        {
          title: '报销人',
          dataIndex: 'psnName',
        },
        {
          title: '单据状态',
          dataIndex: 'status',
        },
        {
          title: '出差天数',
          dataIndex: 'travaldays',
        },
        {
          title: '收支项目',
          dataIndex: 'costsubjname',
        },
        {
          title: '报销金额',
          dataIndex: 'claimingamount',
          render:(text,record)=>{
            if(text){
              return (text).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
            }else{return "0.00"}
          }
        },
        {
          title: '税率',
          dataIndex: 'taxrate',
        },
        {
          title: '税金',
          dataIndex: 'taxamount',
        },
        {
          title: '附件',
          dataIndex: 'file',
          render: (text, record) => (
            <Fragment>
              <a href="#javascript:;"  onClick={(e)=> this.lookFileThing(e,record)}>查看附件</a>
            </Fragment>
          ),
        },
        {
          title: '发票',
          dataIndex: 'invoiceId',
          render: (text, record) => (
            <Fragment>
              <a href="#javascript:;"   onClick={(e)=> this.lookTicket(e,record)}>查看发票</a>
            </Fragment>
          ),

        },
        {
          title: '备注',
          dataIndex: 'memo',
        },
        {
          title: '',
          dataIndex: 'caozuo',
          width:1
        }
      ];
      return <NormalTable onClickColumns={this.onClickColumns2} columns={columns} dataSource={childData} pagination={false} />;
    };

    const ticketprops = {
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      listType: 'picture-card',
      fileList: this.state.lookFileTicket
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            {/* <div style={{margin:'-20px 0 20px 0'}}>
              <Button type={'primary'} onClick={this.download}>导出</Button>
            </div>*/}
            <NormalTable
              onClickColumns={this.onClickColumns}
              className="components-table-demo-nested"
              columns={columns}
              loading={loading}
              scroll={{ y:260}}
              onExpandedRowsChange={(expandedRows)=>{
                this.setState({childData:[]})
                if(expandedRows.length){
                  if(expandedRows.length>=2){
                    expandedRows.splice(0,1)
                  }
                }
                this.setState({
                  expandedRowKeys:expandedRows
                })
              }}
              expandedRowKeys={this.state.expandedRowKeys}
              onExpand={(expandedRows,record)=>{
                this.setState({
                  superId:record.id,
                });
                const { dispatch } = this.props
                let conditions = [
                  {
                    code:'PROJECT_ID',
                    exp:'=',
                    value:record.id
                  },
                  {
                    code:'STATUS',
                    exp:'=',
                    value:'审批通过'
                  }
                ];
                dispatch({
                  type:'travel/fetchChild',
                  payload:{
                    conditions,
                    pageIndex:0,
                    pageSize:10000
                  },
                  callback:(res)=>{
                    console.log("---res---",res);
                    if(res.resData){
                      res.resData = res.resData.map((item)=>{
                        item.key = item.id;
                        return item
                      });
                      this.setState({childData:res.resData})
                    }
                  }
                })
                if(expandedRows == false){
                  this.setState({childData:[]})
                }
              }}
              expandedRowRender = {expandedRowRender}
              onChange={this.handleStandardTableChange}
              data={data}
            />
          </div>

          <Modal
            title="查看附件"
            visible={this.state.lookShow}
            destroyOnClose
            onCancel={this.noShow}
            footer={[
              // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
              <Button  type="primary"  onClick={this.noShow}>
                确定
              </Button>,
            ]}
          ><Spin spinning={loadingList}>
            { this.state.lookFile.length ?
              this.state.lookFile.map((item,index)=>{
                return  <p key={index}>
                  <a download target="_blank" href={item.url} >{item.name}</a>
                </p>
              }) : '暂无附件'
            }
          </Spin>
          </Modal>


          <Modal
            title="查看发票"
            visible={this.state.lookTicketShow}
            destroyOnClose
            onCancel={this.noTicketShow}
            footer={[
              // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
              <Button  type="primary"  onClick={this.noTicketShow}>
                确定
              </Button>,
            ]}
          >
            <Spin spinning={loadingList}>
              <Upload
                loading={loading}
                {...ticketprops}
                onPreview={this.handlePreview}
              >
              </Upload>
            </Spin>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TravelManagement;

import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';

import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  DatePicker,
  Icon, Popconfirm, Checkbox,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../System/UserAdmin.less';
import NormalTable from '@/components/NormalTable';
import ModelTable from '../tool/ModelTable/ModelTable';
import './tableBg.less'
import ExportJsonExcel from 'js-export-excel';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;


@connect(({ loan, loading }) => ({
  loan,
  loading: loading.models.loan,
}))
@Form.create()
class Loan extends PureComponent {
  state ={
    addVisible:false,
    updateVisible:false,
    viewVisible:false,
    updata:{},
    record:{},
    rowId:null,
    superId:null,
    page:{
      pageIndex:0,
      pageSize:10
    },
    expandForm:false,
    selectedKeys:[],
    selectedRows:[],
    resColumns : [
      {
        title: '接收时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '贷款申请编号',
        dataIndex: 'loanApplyNo',
        key: 'loanApplyNo',
      },
      {
        title: '贷款产品编号',
        dataIndex: 'loanProductCode',
        key: 'loanProductCode',
      },
      {
        title: '贷款合同编号',
        dataIndex: 'loanNo',
        key: 'loanNo',
      },
      {
        title: '阿里客户',
        dataIndex: 'customerId',
        key: 'customerId',
      },
      {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '贷款产品编号',
        dataIndex: 'loanProductCode',
        key: 'loanProductCode',
      },
      {
        title: '交易货品名称',
        dataIndex: 'saleProductName',
        key: 'saleProductName',
      },
      {
        title: '收货时间',
        dataIndex: 'productReceiveTime',
        key: 'productReceiveTime',
      },
      {
        title: '订单生成时间',
        dataIndex: 'orderCreateTime',
        key: 'orderCreateTime',
      },
      {
        title: '结算单金额(单位:元)',
        dataIndex: 'statementAmount',
        key: 'statementAmount',
      },
      {
        title: '订单付款日期',
        dataIndex: 'orderPaymentTime',
        key: 'orderPaymentTime',
      },
      {
        title: '物流单号',
        dataIndex: 'logisticsNumber',
        key: 'logisticsNumber',
      },
      {
        title: '结算单付款日期',
        dataIndex: 'statementPaymentTime',
        key: 'statementPaymentTime',
      },
      {
        title: '申请放款时间',
        dataIndex: 'loanApplyTime',
        key: 'loanApplyTime',
      },
      {
        title: '申请放款金额(单位:元)',
        dataIndex: 'loanAmount',
        key: 'loanAmount',
      },
      {
        title: '执行年化费率',
        dataIndex: 'rate',
        key: 'rate',
      },
      //查看结果
      {
        title: '机构借据号',
        dataIndex: 'institutionLoanNo',
        key: 'institutionLoanNo',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render:((text,record)=>{
          if(text === 'SUCCESS'){
            return '放款成功'
          }else if(text === 'FAILED'){
            return '放款失败'
          }
        })
      },
      {
        title: '审批人员',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '审批时间',
        dataIndex: 'userDate',
        key: 'userDate',
      },
      {
        title: '实际放款时间',
        dataIndex: 'eventTime',
        key: 'eventTime',
      },
      {
        title: '对接渠道',
        dataIndex: 'channel',
        key: 'channel',
      },
      {
        title: '放款金额(单位：元)',
        dataIndex: 'loanAmount2',
        key: 'loanAmount2',
      },
      {
        title: '服务费用',
        dataIndex: 'fee',
        key: 'fee',
      },
      {
        title: '拒绝原因码',
        dataIndex: 'failReasonCode',
        key: 'failReasonCode',
      },
      {
        title: '拒绝原因描述',
        dataIndex: 'failReasonMessage',
        key: 'failReasonMessage',
      }
    ]
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'loan/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }

  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    const { SelectValue,selectedRowKeys } = this.state
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const { loanApplyNo,loanNo,customerId,loanProductCode,productReceiveTime,
        orderCreateTime,logisticsNumber,orderPaymentTime,userDate,userName } = values;
      if(loanApplyNo || loanNo || customerId || loanProductCode || productReceiveTime ||
        orderCreateTime || logisticsNumber || orderPaymentTime ||userDate ||userName) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};
        let customerIdObj = {};
        let loanProductCodeObj = {};
        let productReceiveTimeObj = {};
        let orderCreateTimeObj = {};
        let logisticsNumberObj = {};
        let orderPaymentTimeObj = {};
        let usernameObj = {};
        let startObj = {};
        let endObj = {};

        if (loanApplyNo) {
          codeObj = {
            code: 'loan_apply_no',
            exp: 'like',
            value: loanApplyNo
          };
          conditions.push(codeObj)
        }
        if (loanNo) {
          nameObj = {
            code: 'loan_no',
            exp: 'like',
            value: loanNo
          };
          conditions.push(nameObj)
        }
        if (customerId) {
          customerIdObj = {
            code: 'customer_id',
            exp: 'like',
            value: customerId
          };
          conditions.push(customerIdObj)
        }
        if (loanProductCode) {
          loanProductCodeObj = {
            code: 'loan_product_code',
            exp: 'like',
            value: loanProductCode
          };
          conditions.push(loanProductCodeObj)
        }
        if (productReceiveTime) {
          productReceiveTimeObj = {
            code: 'product_receive_time',
            exp: 'like',
            value: productReceiveTime.format('YYYY-MM-DD')
          };
          conditions.push(productReceiveTimeObj)
        }
        if (orderCreateTime) {
          orderCreateTimeObj = {
            code: 'order_create_time',
            exp: 'like',
            value: orderCreateTime.format('YYYY-MM-DD')
          };
          conditions.push(orderCreateTimeObj)
        }
        if (logisticsNumber) {
          logisticsNumberObj = {
            code: 'logistics_number',
            exp: 'like',
            value: logisticsNumber
          };
          conditions.push(logisticsNumberObj)
        }
        if (orderPaymentTime) {
          orderPaymentTimeObj = {
            code: 'order_payment_time',
            exp: 'like',
            value: orderPaymentTime.format('YYYY-MM-DD')
          };
          conditions.push(orderPaymentTimeObj)
        }
        if(userDate && userDate.length){
          startObj = {
            code:'user_date',
            exp:'>=',
            value:userDate[0].format('YYYY-MM-DD')
          };
          conditions.push(startObj)

          endObj = {
            code:'user_date',
            exp:'<=',
            value:userDate[1].format('YYYY-MM-DD')
          };
          conditions.push(endObj)
        }
        if(userName){
          usernameObj = {
            code: 'user_id',
            exp: '=',
            value: selectedRowKeys[0]
          };
          conditions.push(usernameObj)
        }
        this.setState({conditions})
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type:'loan/fetch',
          payload: obj
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'loan/fetch',
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
      TableData:[],
      SelectValue:[],
      selectedRowKeys:[],
      conditionsUser:[],
      page:{},
    })
    //清空后获取列表
    dispatch({
      type:'loan/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }

  toggleForm = () =>{
    const { expandForm } = this.state
    this.setState({expandForm:!expandForm})
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      dispatch
    } = this.props;
    const { expandForm,selectedRows } = this.state;
    const on = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'loan/fetchUcum',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
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
          return item.userName
        });
        onChange(nameList)
        this.setState({
          SelectValue:nameList,
          selectedRowKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { conditionsUser } = this.state;
        const param = {
          ...obj
        };
        this.setState({
          page:param
        });
        if(conditionsUser.length){
          dispatch({
            type:'loan/fetchUcum',
            payload:{
              conditions:conditionsUser,
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
          type:'loan/fetchUcum',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
        const { userName } = values;
        if(userName){
          let conditions = [];
          let nameObj = {};

          if(userName){
            nameObj = {
              code:'user_name',
              exp:'like',
              value:userName
            };
            conditions.push(nameObj)
          }
          this.setState({
            conditionsUser:conditions,
          });
          const obj = {
            conditions,
          };
          dispatch({
            type:'loan/fetchUcum',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { page } = this.state;
        this.setState({
          conditionsUser:[]
        });
        dispatch({
          type:'loan/fetchUcum',
          payload:{
            ...page
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
    const onData = {
      TableData:this.state.TableData,
      SelectValue:this.state.SelectValue,
      selectedRowKeys:this.state.selectedRowKeys,
      columns :[
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
            return <Checkbox checked={text}/>
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
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'用户名',code:'userName',placeholder:'请输入用户名'},
      ],
      title:'人员管理',
      placeholder:'请选择人员',
    };
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='申请编号'>
              {getFieldDecorator('loanApplyNo')(<Input placeholder='请输入贷款申请编号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='合同编号'>
              {getFieldDecorator('loanNo')(<Input placeholder='请输入贷款合同编号' />)}
            </FormItem>
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
            {
              expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起
                <Icon type="up" />
              </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开
                <Icon type="down" />
              </a>
            }
          </Col>
        </Row>
        {expandForm? <div>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={16}>
              <FormItem label='阿里客户'>
                {getFieldDecorator('customerId')(<Input placeholder='请输入阿里客户' />)}
              </FormItem>
            </Col>
            <Col md={8} sm={16}>
              <FormItem label='产品编号'>
                {getFieldDecorator('loanProductCode')(<Input placeholder='请输入贷款产品编号' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={16}>
              <FormItem label='收货日期'>
                {getFieldDecorator('productReceiveTime')(<DatePicker placeholder="请选择收货日期"  style={{width:'100%'}}/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={16}>
              <FormItem label='生成日期'>
                {getFieldDecorator('orderCreateTime')(<DatePicker placeholder="请选择订单生成日期"  style={{width:'100%'}}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={16}>
              <FormItem label='付款日期'>
                {getFieldDecorator('orderPaymentTime')(<DatePicker placeholder="请选择订单付款日期"  style={{width:'100%'}}/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={16}>
              <FormItem label='物流单号'>
                {getFieldDecorator('logisticsNumber')(<Input placeholder='请输入物流单号'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={16}>
              <FormItem label='审批人员'>
                {getFieldDecorator('userName')(<ModelTable
                  data={onData}
                  on={on}
                />)}
              </FormItem>
            </Col>
            <Col md={8} sm={16}>
              <FormItem label='审批时间'>
                {getFieldDecorator('userDate')(<RangePicker  style={{width:'100%',}}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>:''}
        <div style={{margin:'8px 0',display:'flex'}}>
          <Button type='primary' disabled={!selectedRows.length}  onClick={this.daoChu}>
            导出
          </Button>
        </div>
      </Form>
    );
  }

  daoChu = ()=>{
    const { selectedRows,resColumns } = this.state;
    const { dispatch } = this.props;
    const str = JSON.stringify(selectedRows);
    const arrs = JSON.parse(str);
    arrs.map(item =>{
      if(item.status){
        switch (item.status) {
          case 'SUCCESS':
            item.status = '放款成功';
            break;
          case 'FAILED':
            item.status = '放款失败'
            break;
        }
      }
    })
    dispatch({
      type:"loan/queryListRes",
      payload:{
        arr:arrs
      },
      callback:(res)=>{
        if(!res.length){
          return message.error("暂无数据导出")
        }
        let option={};
        let dataTable = [];
        let arr = []; //保存key
        res.map((item)=>{
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
        option.fileName = '支用管理';
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
      }
    })
  }

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions} = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'loan/fetch',
        payload: param,
      });
      return
    }
    this.setState({
      pageIndex:obj.pageIndex
    });
    dispatch({
      type:'loan/fetch',
      payload: obj,
    });
  };

  handleLook = (e,record)=>{
    e.preventDefault()
    router.push(`/loan/loanInfo/${record.id}`)
  }

  onSelectChange = (selectedRowKeys,selectedRows) => {
    this.setState({ selectedKeys:selectedRowKeys,selectedRows });
  };

  render() {
    const {
      form:{getFieldDecorator},
      loan:{fetchData}
    } = this.props;
    const columns = [
      {
        title: '接收时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '贷款申请编号',
        dataIndex: 'loanApplyNo',
        key: 'loanApplyNo',
      },
      {
        title: '贷款合同编号',
        dataIndex: 'loanNo',
        key: 'loanNo',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render:((text,record)=>{
          if(text === 'SUCCESS'){
            return '放款成功'
          }else if(text === 'FAILED'){
            return '放款失败'
          }
        })
      },
      {
        title: '阿里客户',
        dataIndex: 'customerId',
        key: 'customerId',
      },
      {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '贷款产品编号',
        dataIndex: 'loanProductCode',
        key: 'loanProductCode',
      },
      {
        title: '交易货品名称',
        dataIndex: 'saleProductName',
        key: 'saleProductName',
      },
      {
        title: '收货时间',
        dataIndex: 'productReceiveTime',
        key: 'productReceiveTime',
      },
      {
        title: '订单生成时间',
        dataIndex: 'orderCreateTime',
        key: 'orderCreateTime',
      },
      {
        title: '结算单金额(单位:元)',
        dataIndex: 'statementAmount',
        key: 'statementAmount',
        render:((text,record)=>{
           if(text){
             return Number(text).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
           }else{
             return null
           }
        })
      },
      {
        title: '订单付款日期',
        dataIndex: 'orderPaymentTime',
        key: 'orderPaymentTime',
      },
      {
        title: '物流单号',
        dataIndex: 'logisticsNumber',
        key: 'logisticsNumber',
      },
      {
        title: '结算单付款日期',
        dataIndex: 'statementPaymentTime',
        key: 'statementPaymentTime',
      },
      {
        title: '申请放款时间',
        dataIndex: 'loanApplyTime',
        key: 'loanApplyTime',
      },
      {
        title: '申请放款金额(单位:元)',
        dataIndex: 'loanAmount',
        key: 'loanAmount',
        render:((text,record)=>{
          if(text){
            return Number(text).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,')
          }else{
            return null
          }
        })
      },
      {
        title: '执行年化费率',
        dataIndex: 'rate',
        key: 'rate',
      },
      {
        title: '审批人员',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '审批时间',
        dataIndex: 'userDate',
        key: 'userDate',
      },
      {
        title: '操作',
        fixed:'right',
        dataIndex: 'operation',
        render: (text, record) =>
        {
          return <Fragment>
            <a href="#javascript:;" onClick={(e) => this.handleLook(e,record)}>查看</a>
          </Fragment>
        }
      },
    ];

    const { selectedKeys } = this.state;

    const rowSelection = {
      selectedRowKeys:selectedKeys,
      onChange: this.onSelectChange,
    };
    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} >{this.renderForm()}</div>
            <div style={{marginTop:'20px'}}>
              <NormalTable
                columns={columns}
                data={fetchData}
                onRow={(record )=>{
                  return {
                    onClick:()=>{
                      this.setState({
                        rowId: record.id,
                        superId:record.id,
                        record:record,
                      })
                    },
                    rowKey:record.id
                  }
                }}
                rowClassName={this.setRowClassName}
                onChange={this.handleStandardTableChange}
                rowSelection = {rowSelection}
              />
            </div>

          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Loan;

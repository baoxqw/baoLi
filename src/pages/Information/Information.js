import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import env from '../../../config/env';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Select,
  Col,
  DatePicker,
  Icon, Popconfirm, Checkbox,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../System/UserAdmin.less';
import NormalTable from '@/components/NormalTable';
import ModelTable from '../tool/ModelTable/ModelTable';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
import '../FuncLoan/tableBg.less'

@connect(({ information, loading }) => ({
  information,
  loading: loading.models.information,
}))
@Form.create()
class Information extends PureComponent {
  state ={
    page:{
      pageIndex:0,
      pageSize:10
    },
    conditions:{}
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'information/findList',
      payload:{
        pageIndex:0,
        pageSize:10
      },
    })
  }

  //查询
  findList = () => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err,values)=>{
      const { date } = values;
      if(date) {
        const d = date.format("YYYYMMDD");
        this.setState({conditions:{
          date:d
          }})
        const obj = {
          pageIndex:0,
          pageSize:10,
          reqData:{
            date:d
          },
        };
        dispatch({
          type:'information/findList',
          payload: obj
        })
      }else{
        this.setState({
          conditions:{}
        })
        dispatch({
          type:'information/findList',
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
      conditions:{},
      page:{
        pageIndex:0,
        pageSize:10
      },
    })
    //清空后获取列表
    dispatch({
      type:'information/findList',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
      dispatch
    } = this.props;

    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='日期'>
              {getFieldDecorator('date')(<DatePicker style={{width:'100%'}} />)}
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
          reqData: conditions
        }
      dispatch({
        type:'information/findList',
        payload: param,
      });
      return
    }
    this.setState({
      pageIndex:obj.pageIndex
    });
    dispatch({
      type:'information/findList',
      payload: obj,
    });
  };


  render() {
    const {
      form:{getFieldDecorator},
      information:{fetchData}
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key'
      },
      {
        title: '目录',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        fixed:'right',
        dataIndex: 'operation',
        render: (text, record) =>
        {
          return <Select placeholder={'文件下载'} style={{width:'200px'}}>
            <Option value={0}><a href={`${env}/static/checking/${record.name}/quota_full.csv`}>额度文件下载</a> </Option>
            <Option value={1}><a href={`${env}/static/checking/${record.name}/repayment_plan_update.csv`}>还款计划文件下载</a> </Option>
            <Option value={2}><a href={`${env}/static/checking/${record.name}/repayment_detail_update.csv`}>还款记录文件下载</a></Option>
          </Select>
        }
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} >{this.renderForm()}</div>
            <div style={{marginTop:'20px'}}>
              <NormalTable
                columns={columns}
                data={fetchData}
                onChange={this.handleStandardTableChange}
              />
            </div>

          </div>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Information;

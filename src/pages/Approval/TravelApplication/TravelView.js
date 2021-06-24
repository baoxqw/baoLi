import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
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
  Transfer, Badge, Steps,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from '../../System/UserAdmin.less';
import FooterToolbar from '@/components/FooterToolbar';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Step } = Steps;
const { Description } = DescriptionList;
@connect(({ approval, loading }) => ({
  approval,
  loading: loading.models.approval,
}))
@Form.create()
class TravelView extends PureComponent {
  state = {
    detail:'',
    process:'',
    current:0,
    finaceok:true,
    detailSource:null
  };

  backClick = ()=>{
    this.props.history.go(-1)
  }
  componentDidMount(){
    const { dispatch } = this.props;
    console.log('上一页',this.props)
    const taskId = this.props.location.state.query.taskId;
    const processInstanceId = this.props.location.state.query.processInstanceId;
    const type = this.props.location.state.query.type;
    const billcode = this.props.location.state.query.billId;
    let conditions = [];
    if(billcode){
      let codeObj = {
        code:'id',
        exp:'=',
        value:billcode
      };
      conditions.push(codeObj)
    }
    let aa = {
      conditions
    }
    //详情
    dispatch({
      type:'approval/fetchSdetail',
      payload:aa,
      callback:(res)=>{
        if(res.resData){
          this.setState({detailSource:res.resData[0]})
          console.log('详情',res)
        }
      }
    })
    if(type === '财务'){
      this.setState({finaceok:true})
    }else{
      this.setState({finaceok:false})
    }
    this.setState({
      taskId,
      processInstanceId
    })
    //详情
    dispatch({
      type:'approval/fetchdetail',
      payload: {
        userDefineStr1:processInstanceId
      },
      callback:(res)=>{
        if(res.resData){
          let person = "";
          let current = null;
          let process = [];
          res.resData.map((item)=>{
            for(let key in item){
              //发起人
              if(key === 'USERNAME'){
                person = item[key]
              }
              //步骤
              if(key === 'AUDITOR_IDX'){
                current = item[key] + 1;
              }
              //流程
              if(key === 'AUDITOR_LIST'){
                process = JSON.parse(item[key])
              }
            }
          })
          this.setState({
            person,
            current,
            process
          })
        }

      }
    })
  }

  render() {
    const { detailSource,process } = this.state
    const parentMethods = {
      handleAdd: this.handleAdd,
    };
    console.log('process',process)

    const description = (
      <DescriptionList size="small" col="2">
        {/*  <Description term="单据号">{this.state.detail?this.state.detail.billcode:''}</Description>
        <Description term="单据数量">{this.state.detail?this.state.detail.number:''}</Description>
        <Description term="申请类型">{this.state.detail?this.state.detail.billtype:''}</Description>
        <Description term="申请金额">{this.state.detail?this.state.detail.money:''}</Description>*/}
        <Description term={formatMessage({id:'valid.Document'})}>{this.state.detail?this.state.detail.billcode:''}</Description>
        <Description term={formatMessage({id:'valid.documents.number'})}>{this.state.detail?this.state.detail.number:''}</Description>
        <Description term={formatMessage({id:'valid.Application.type'})}>{this.state.detail?this.state.detail.billtype:''}</Description>
        <Description term={formatMessage({id:'project.applied.amount'})}>{this.state.detail?this.state.detail.money:''}</Description>
      </DescriptionList>
    );
    const leave = (
      <DescriptionList size="small" col="2">
        <Description term="单据号">{detailSource?detailSource.billcode:''}</Description>
        <Description term="单据日期">{detailSource?detailSource.billdate:''}</Description>
        <Description term="所属项目">{detailSource?detailSource.projectName:''}</Description>
        <Description term="部门">{detailSource?detailSource.deptName:''}</Description>
        <Description term="报销人">{detailSource?detailSource.psnName:''}</Description>
        <Description term='报销金额'>{detailSource?detailSource.mny:''}</Description>
        <Description term='出差天数'>{detailSource?detailSource.travaldays:''}</Description>
        <Description term='备注'>{detailSource?detailSource.memo:''}</Description>
        <Description term='报销人'>{detailSource?detailSource.username:''}</Description>
        <Description term='状态'>{detailSource?<b>{detailSource.status}</b>:''}</Description>
      </DescriptionList>
    );
    return (
      <PageHeaderWrapper
        title={formatMessage({id:'project.Application.details'})}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        /* action={action}*/
        content={this.state.finaceok?description:leave}
        /*extraContent={}*/
        onTabChange={this.onOperationTabChange}
      >
        {/*流程进度*/}
        <Card title={formatMessage({id:'validation.process.schedule'})} style={{ marginBottom: 24 }} bordered={false}>
          <Steps  current={this.state.current}>
            <Step title={this.state.person} />
            {
              this.state.process?this.state.process.map((item,index)=>{
                return <Step key= {index} title={item.name} />
              }):''
            }
            {/*<Step title="部门初审" />*/}
            <Step title={formatMessage({id:'valid.complete'})} />
          </Steps>
        </Card>
        <FooterToolbar style={{ width: '100%' }}>
          <Button
            onClick={this.backClick}
          >{formatMessage({id:'validation.return'})}
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default TravelView;

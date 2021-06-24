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
class Application extends PureComponent {
  state = {
     detail:'',
     process:'',
     current:0,
     finaceok:true,
    detailSource:null,
    ss:[],
    lookstatus:false,
  };

  backClick = ()=>{
    this.props.history.go(-1)
  }
  componentDidMount(){
    const { dispatch } = this.props;
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
      payload:{
        reqData:{
          id:billcode
        }
      },
      callback:(res)=>{
        if(res.resData){
          this.setState({detailSource:res.resData[0]})
        }
      }
    })
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
              if(key == 'USERNAME'){
                person = item[key]
              }
              //步骤
              if(key == 'AUDITOR_IDX'){
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

    //查询审批意见
    dispatch({
      type:'approval/fetchAdvice',
      payload:{
        reqData:{
          processinstanceid:processInstanceId
        }
      },
      callback:(res)=>{
        if(res.resData){
          res.resData.map((item)=>{
            if(item.type == 'TJ'){
              item.type = '拒绝'
            }else if(item.type == 'AGREE'){
              item.type = '同意'
            }
          })
          this.setState({ss:res.resData})
        }
      }
    })
  }
  renderStatus(){
    return <Card title="流程进度" style={{ marginTop: 24 }} bordered={false}>
      <Steps current={this.state.current}>
        <Step title={this.state.person} />
        {
          this.state.process?this.state.process.map((item,index)=>{
            return <Step key= {index} title={item.name} />
          }):''
        }
        <Step title="完成" />
      </Steps>
    </Card>
  }
  renderLookStatus (){
    const ss = this.state.ss
    return <Card title="审批意见" style={{ marginTop: 24,}} bordered={false}>
      <div style={{paddingLeft:'20px'}}>
        {
          ss.length?ss.map((item,key)=>{
            return <div style={{marginBottom:"10px"}} key={key}>
              <b style={{display:'inline-block',marginRight:'10px'}}>{item.userName}({item.typeName})</b>
              {item.time}
              <p style={{height:'30px',lineHeight:'30px'}}>{item.message}</p>
            </div>

          }):'暂无审批意见！'
        }
      </div>
    </Card>
  }
  lookAdvice = ()=>{
    this.setState({
      lookstatus: !this.state.lookstatus
    })
  }
  render() {
    const { detailSource,process,person,current } = this.state
    const leave = (
      <DescriptionList size="small" col="2">
        <Description term='单据号'>{detailSource?detailSource.billcode:''}</Description>
        <Description term='单据日期'>{detailSource?detailSource.billdate:''}</Description>
        <Description term='部门'>{detailSource?detailSource.deptname:''}</Description>
        <Description term='报销人'>{detailSource?detailSource.username:''}</Description>
        <Description term='所属项目'>
          <Tooltip title={detailSource?detailSource.projectname:''}>
            <p style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>{detailSource?detailSource.projectname:''}</p>
          </Tooltip>
        </Description>
        <Description term='状态'>{detailSource?detailSource.status:''}</Description>
        <Description term='出差费'>{detailSource?detailSource.travelfee:''}</Description>
        <Description term='工作阶段'>{detailSource?detailSource.phasenames:''}</Description>
        <Description term='比例'>{detailSource?detailSource.sumratio:''}</Description>
        <Description term='补贴'>{detailSource?detailSource.subsidy:''}</Description>
        <Description term='总天数'>{detailSource?detailSource.totaldays:''}</Description>
        <Description term='交通天数'>{detailSource?detailSource.travaldays:''}</Description>

      </DescriptionList>
    );
    const action = (
      <Fragment>
        <Button type="primary" onClick={()=>this.lookAdvice()}>查看审批意见</Button>
      </Fragment>
    );
    return (
      <PageHeaderWrapper
        title='绩效申请详情'
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={leave}
        onTabChange={this.onOperationTabChange}
      >
        {/*流程进度*/}
        {this.renderStatus()}
        {this.state.lookstatus?this.renderLookStatus():null}
       {/* <Card title={formatMessage({id:'validation.process.schedule'})} style={{ marginBottom: 24 }} bordered={false}>
          <Steps  current={this.state.current}>
            <Step title={this.state.person} />
            {
              this.state.process?this.state.process.map((item,index)=>{
                return <Step key= {index} title={item.name} />
              }):''
            }
            <Step title="部门初审" />
            <Step title={formatMessage({id:'valid.complete'})} />
          </Steps>
        </Card>*/}
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

export default Application;

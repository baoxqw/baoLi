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
  Transfer, Badge, Dropdown, Steps,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from '../../System/UserAdmin.less';
import FooterToolbar from '@/components/FooterToolbar';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Description } = DescriptionList;
const { TextArea } = Input;
const ButtonGroup = Button.Group;
const { Step } = Steps;
@connect(({ approval, loading }) => ({
  approval,
  loading: loading.models.approval,
}))
@Form.create()
class Approval extends PureComponent {
  state = {
    opinion:'',
    status:false,
    detail:'',
    current:0,
    process:'',
    person:'',
    leave:'',
    finaceok:true,
    asks:'',
    detailSource:null,
  };

  about = (e)=>{
    this.setState({
      opinion: e.target.value
    })
  };

  backClick = ()=>{
    router.push('/approval/myapproval/list');
  }

  componentDidMount(){
    const { dispatch, form } = this.props;
    const auditStatus = this.props.location.state.query.auditStatus;
    const taskId = this.props.location.state.query.taskId;
    const processInstanceId = this.props.location.state.query.processInstanceId;
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
        }
      }
    })
    if(auditStatus == 'WAIT_AUDIT'){
      this.setState({asks:true})
    }else if(auditStatus == 'AGREE_AUDIT'){
      this.setState({asks:false})
    }
    this.setState({
      taskId,
      processInstanceId
    })
    //类型
    const type = this.props.location.state.query.type;
    if(type == '财务'){
      this.setState({finaceok:true})
    }else{
      this.setState({finaceok:false})
    }

      //财务详情
      dispatch({
        type:'approval/fetchdetail',
        payload: {
          userDefineStr1:processInstanceId
        },
        callback:(res)=>{
          console.log('详情信息66：',res)
          if(res.resData && res.resData.length){
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

      // this.setState({finaceok:false})
  }

  aggree (value){
    const { dispatch } = this.props;
    let result;
    if(value === '同意'){
      result = 1
    }
    if(value === '拒绝'){
      result = 0
    }
    if(value === '退回'){
      result = 2
    }
/*    if(value === '取消'){
      this.setState({
        opinion:''
      });
      return
    }*/
    const userDefineStrGroup = [this.state.taskId,this.state.opinion]
    const obj = {
      userDefineStrGroup
    }
    dispatch({
      type: 'approval/result',
      payload:obj,
      callback:()=>{
        message.success('已完成',1.5,()=>{
          router.push('/approval/myapproval/list');
        });
      },
    });
  }

  refuse = ()=>{
    const { dispatch } = this.props;
    const userdata = [this.state.taskId,this.state.opinion]
    const object = {
      userdata
    }
    dispatch({
      type: 'approval/refuse',
      payload:object,
      callback:()=>{
        message.success('已完成',1.5,()=>{
          router.push('/approval/myapproval/list');
        });
      },
    });
  }

  onStatus = ()=>{
    this.setState({
      status: !this.state.status
    })
  };

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

  render() {
    const { detailSource } = this.state
    const parentMethods = {
      handleAdd: this.handleAdd,
    };

    const handleCorpAdd = () => {
      router.push('/projectmanagement/projectassign/add');
    };

    const description = (
      <DescriptionList size="small" col="2">
        <Description term="单据号">{this.state.detail?this.state.detail.billcode:''}</Description>
        <Description term="单据数量">{this.state.detail?this.state.detail.number:''}</Description>
        <Description term="申请类型">{this.state.detail?this.state.detail.billtype:''}</Description>
        <Description term="申请金额">{this.state.detail?this.state.detail.money:''}</Description>

      </DescriptionList>
    );
    const leave = (
      <DescriptionList size="small" col="2">
        <Description term='单据号'>{detailSource?detailSource.billcode:''}</Description>
        <Description term='单据日期'>{detailSource?detailSource.billdate:''}</Description>
        <Description term='部门'>{detailSource?detailSource.deptname:''}</Description>
        <Description term='报销人'>{detailSource?detailSource.username:''}</Description>
        <Description term='所属项目'>{detailSource?detailSource.projectname:''}</Description>
        <Description term='状态'>{detailSource?detailSource.status:''}</Description>
        <Description term='交通费'>{detailSource?detailSource.travelfee:''}</Description>
        <Description term='税率'>{detailSource?detailSource.taxrate:''}</Description>
        <Description term='税额'>{detailSource?detailSource.tax:''}</Description>
        <Description term='补贴'>{detailSource?detailSource.subsidy:''}</Description>

      </DescriptionList>
    );

    const action = (
      <Fragment>
        <Button type="primary" onClick={()=>this.onStatus()}>查看当前状态</Button>
      </Fragment>
    );
    return (
      <PageHeaderWrapper
        title='审批详情'
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={this.state.finaceok?description:leave}
        /*extraContent={}*/
        onTabChange={this.onOperationTabChange}
      >
        {
          this.state.asks?<Card title=''>
            <Row gutter={24} style={{marginTop:24}}>
              <Col lg={2} md={2} sm={3}>
                意见
              </Col>
              <Col lg={16} md={16} sm={20}>
                <TextArea rows={4} placeholder='请输入意见' value={this.state.opinion} onChange={(e)=>this.about(e)}/>
              </Col>
            </Row>

            <Row style={{marginTop:40,marginLeft:90}}>
              <span>
                <Button type="primary" onClick={()=> this.aggree('同意')}>同意</Button>
              </span>
              <span style={{marginLeft:14}}>
                <Button style={{backgroundColor:'red',color:'#fff'}} onClick={this.refuse}>拒绝</Button>
              </span>
              <span style={{marginLeft:14}}>
                <Button type="primary" onClick={()=> this.aggree('退回')}>退回</Button>
              </span>

            </Row>
          </Card>:''
        }

        {this.state.status?this.renderStatus():null}

        <FooterToolbar style={{ width: '100%' }}>
          <Button
            onClick={this.backClick}
          >返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default Approval;

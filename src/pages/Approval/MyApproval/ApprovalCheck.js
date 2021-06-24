import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import storage from '@/utils/storage'
import RoleUser from '@/pages/tool/RoleUser';
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
@connect(({ approval,statustable, loading }) => ({
  approval,
  statustable,
  loading: loading.models.approval,
}))
@Form.create()
class ApprovalCheck extends PureComponent {
  state = {
    initDate:{},
    opinion:'',
    ss:[],
    lookstatus:false,
    status:false,
    detail:'',
    current:0,
    process:[],
    person:'',
    personid:null,
    leave:'',
    finaceok:false,
    asks:'',
    detailSource:{},
    proid:null,
    processInstanceId:null,
    select:false,
    is:0,  //同意还是拒绝
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
    const { record } = this.props.location.state;
    console.log("record",record)
    this.onRecord(record)
  }
  componentWillReceiveProps = (nextProps) => {
    if(this.props.location.state.record !== nextProps.location.state.record){
      const { record } = nextProps.location.state;
      this.onRecord(record)
    }
  };

  onRecord = (record)=>{
    console.log('数据',record)
    const { dispatch } = this.props;
    this.setState({
      proid:record.billId,
      processInstanceId:record.processInstanceId
    })
    dispatch({
      type:'approval/fetchSdetail',
      payload:{
        reqData:{
          id:record.billId
        }
      },
      callback:(res)=>{
        console.log("----res----",res)
        if(res.resData && res.resData.length){
          if(res.resData[0] !== null){
            this.setState({
              initDate:res.resData[0],
              detailSource:res.resData[0]
            });
            if(res.resData[0].status && res.resData[0].status === '审批进行中'){
              dispatch({
                type:'approval/fetchProcessId',
                payload:{
                  id:record.processInstanceId
                },
                callback:(res)=>{
                  console.log("fetchProcessId",res)
                  if(res.userDefineStr1){
                    this.setState({
                      initDate:{
                        ...this.state.initDate,
                        taskId:res.userDefineStr1
                      }
                    })
                  }
                }
              });
            }
          }
        }
      }
    });
    dispatch({
      type:'approval/fetchdetail',
      payload: {
        userDefineStr1:record.processInstanceId
      },
      callback:(res)=>{
        console.log("ssss",res)
        if(res.resData && res.resData.length){
          let person = "";
          let current = null;
          let personid = null;
          let process = [];
          res.resData.map((item)=>{
            for(let key in item){
              //发起人
              if(key === 'USERNAME'){
                person = item[key]
              }
              //发起人id
              if(key === 'USERID'){
                personid = item[key]
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
            personid,
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
          processinstanceid:record.processInstanceId
        }
      },
      callback:(res)=>{
        console.log('------',res)
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
  addinfo = (type)=>{
    const user = storage.get("userinfo");
    const { dispatch } = this.props;
    const { person,processInstanceId,proid,personid } = this.state;
    console.log("person",person)
    console.log("person",typeof person)
    let c = {
      reqData:{
        checkman:personid?Number(personid):null,
        senderman:user.id,
        content:this.state.initDate.billcode?this.state.initDate.billcode:'',
        state:0,
        type:8,
        bussiness_id:Number(proid),
        processid:processInstanceId,
        corp_id:user.corpId,
      }
    };
    if(type){
      c.reqData.title = '审批通过'
    }else{
      c.reqData.title = '审批不通过'
    }

    dispatch({
      type:'papproval/addmsg',
      payload:c,
    })

  }

  advice =(data)=>{
    const { form } = this.props;
    form.validateFields((err,values)=>{
      if(err) {
        return
      }
      this.setState({
        select:!this.state.select,
        is:data,
        opinion:values.opinion
      });
    })
  }
  aggreeBack = ()=>{
    const { dispatch } = this.props;
    const { initDate } = this.state
    const obj = {
      reqData:{
        billid:initDate.billId?Number(initDate.billId):null,
        audittype:initDate.type?initDate.type:'',
        processinstanceid:initDate.processInstanceId?initDate.processInstanceId:'',
      }
    }
    dispatch({
      type: 'statustable/remove',
      payload:obj,
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
  lookAdvice = ()=>{
    this.setState({
      lookstatus: !this.state.lookstatus
    })
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
  submit = (is,qinChu,changeStatus)=>{
    const { dispatch } = this.props;
    const { processInstanceId } = this.state;
    const obj = {
      userDefineStrGroup:[this.state.initDate.taskId,this.state.opinion,processInstanceId]
    };
    console.log("obj",obj)
    if(is){
      dispatch({
        type: 'approval/result',
        payload:obj,
        callback:(res)=>{
          console.log("同意",res)
          if(res.errCode === '0'){
            message.success('已同意',1.5,()=>{
              qinChu();
              changeStatus();
              //添加消息
              this.addinfo(is)
              router.push('/approval/myapproval/list');
            });
          }else{
            qinChu();
            changeStatus();
            message.error('提交失败');
          }
        },
      });
    }else{
      dispatch({
        type: 'approval/refuse',
        payload:obj,
        callback:(res)=>{
          console.log("拒绝",res)
          if(res.errCode === '0'){
            message.success('已拒绝',1.5,()=>{
              qinChu();
              changeStatus();
              //添加消息
              this.addinfo(is)
              router.push('/approval/myapproval/list');
            });
          }else{
            qinChu();
            changeStatus();
            message.error('提交失败')
          }
        },
      });
    }
  }


  render() {

    const {
      form: { getFieldDecorator },
    } = this.props;

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
        <Description term='所属项目'>
          <Tooltip title={detailSource?detailSource.projectname:''}>
            <p style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {detailSource?detailSource.projectname:''}
            </p>

          </Tooltip>
        </Description>
        <Description term='状态'><b>{detailSource?detailSource.status:''}</b></Description>
        <Description term='出差费'>{detailSource?detailSource.travelfee:''}</Description>
        <Description term='项目阶段'>
          <Tooltip title={detailSource?detailSource.phasenames:''}>
            <p style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>{detailSource?detailSource.phasenames:''}</p>
          </Tooltip>
        </Description>
        <Description term='比例'>{detailSource?detailSource.sumratio:''}</Description>
        <Description term='补贴'>{detailSource?detailSource.subsidy:''}</Description>

      </DescriptionList>
    );

    const action = (
      <Fragment>
        <Button type="primary" onClick={()=>this.lookAdvice()}>查看审批意见</Button>
        <Button type="primary" onClick={()=>this.onStatus()}>查看当前状态</Button>
      </Fragment>
    );

    const dataUser = {
      visible:this.state.select,
      title:"是否加签",
      agree:"加签",
      cancel:"不加签"
    };

    const onUser = {
      onOk:(arr,qinChu,changeStatus)=>{
        console.log("arr是选中的用户或者角色",arr)
        const { is } = this.state;
        const { dispatch } = this.props;
        if(arr.length){ //需要加签
          /*
            current:流程当前进行的下表
            process:流程
          */
          const { current,process,processInstanceId } = this.state;
          console.log("processInstanceId",processInstanceId)
          let user = [...process];
          user.splice(current,0,arr[0]); //将选择的人或角色插入流程
          user = user.map(item =>{
            item.id = Number(item.id);
            return item
          });
          dispatch({
            type:"approval/addUserRole",
            payload:{
              reqData:{
                processinstanceid:processInstanceId,
                auditors:user
              }
            },
            callback:(res)=>{
              console.log("加签成功",res)
              if(res.errMsg === "提交成功"){
                this.submit(is,qinChu,changeStatus);
              }else{
                changeStatus();
                message.error("提交失败")
              }
            }
          })
        }else{
          changeStatus();
          return message.error("请选择审批人")
        }
      },
      onCancel:(qinChu,changeStatus)=>{
        const { is } = this.state;
        this.submit(is,qinChu,changeStatus);
      },
      onShadow:()=>{
        this.setState({
          select:false
        })
      }
    };

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
          this.state.initDate.status === '审批进行中'? <Card title=''>
            <Row gutter={24} style={{marginTop:24}}>
              <Col lg={16} md={16} sm={16} offset={2}>
                <Form.Item label="意见">
                  {getFieldDecorator('opinion', {
                    rules: [
                      {
                        required: true,
                        message:"请输入意见"
                      }
                    ],
                  })(<TextArea rows={4} placeholder="请输入意见"/>)}
                </Form.Item>
              </Col>
            </Row>

            <Row style={{marginTop:40,marginLeft:90}}>
              <span>
                <Button type="primary" onClick={()=> this.advice(1)}>同意</Button>
              </span>
              <span style={{marginLeft:14}}>
                <Button style={{backgroundColor:'red',color:'#fff'}} onClick={()=>this.advice(0)}>拒绝</Button>
              </span>
              <span style={{marginLeft:14}}>
                <Button type="primary" onClick={ this.aggreeBack}>退回</Button>
              </span>

            </Row>
          </Card>:''
        }


        {this.state.lookstatus?this.renderLookStatus():null}
        {this.state.status?this.renderStatus():null}

        <RoleUser on={ onUser } data={ dataUser }/>



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

export default ApprovalCheck;

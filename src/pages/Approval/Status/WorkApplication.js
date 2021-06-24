import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import storage from '@/utils/storage'

import {
  Row,
  Spin,
  Col,
  Upload,
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
import RoleUser from '@/pages/tool/RoleUser';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Description } = DescriptionList;
const { TextArea } = Input;
const ButtonGroup = Button.Group;
const { Step } = Steps;
@connect(({ TT,TL,approval,statustable, loading }) => ({
  TT,
  TL,
  approval,
  statustable,
  loading: loading.models.TL,
  loadingChild:loading.effects['TT/childFetch'],
  loadingList:loading.effects['TT/fetchList'],
}))
@Form.create()
class WorkApplication extends PureComponent {
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
    leave:'',
    finaceok:false,
    asks:'',
    detailSource:{},
    proid:null,
    mny:null,
    lookFileTicket:[],
    lookFile:[],
    lookTicketShow:false,
    lookShow:false,

    previewVisible: false,
    previewImage: '',
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
    router.push('/approval/statustable/list');
  }

  componentDidMount(){
    const { query } = this.props.location.state;
    console.log("record",query)
    console.log("-----",this.props.location)
    if(query.processInstanceId){
      this.setState({processInstanceId:query.processInstanceId})
      this.onRecord(query)
    }

  }
  componentWillReceiveProps = (nextProps) => {
    if(this.props.location.state.record !== nextProps.location.state.record){
      const { record } = nextProps.location.state;
      this.onRecord(record)
    }
  };

  onRecord = (record)=>{
    const { dispatch } = this.props;
    this.setState({proid:record.billId,processInstanceId:record.processInstanceId})
    dispatch({
      type:'TT/find',
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
        console.log("流程",res)
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
    dispatch({
      type:'TT/childFetch',
      payload:{
        conditions:[{
          code:'CLAIMFORM_H_ID',
          exp:'=',
          value:record.billId
        }]
      },
      callback:(count)=>{
        this.setState({
          mny:count
        })
      }
    })
    //查询审批意见
    dispatch({
      type:'TT/fetchAdvice',
      payload:{
        reqData:{
          processinstanceid:record.processInstanceId
        }
      },
      callback:(res)=>{
        console.log('审批意见',res)
        if(res.resData){
          this.setState({ss:res.resData})
        }
      }
    })
  }
  addinfo = (type)=>{
    const user = storage.get("userinfo");
    const { dispatch } = this.props;
    const { person,processInstanceId,proid } = this.state;
    let c = {
      reqData:{
        checkman:person.id?Number(person.id):null,
        senderman:user.id,
        content:this.state.initDate.billcode?this.state.initDate.billcode:'',
        state:0,
        type:9,
        bussiness_id:Number(proid),
        processid:processInstanceId,
        corp_id:user.corpId,
        jump:1
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
  /*advice =(data)=>{
    const { dispatch } = this.props;
    const userDefineStrGroup = [this.state.initDate.taskId,this.state.opinion]
    const obj = {
      userDefineStrGroup
    }
    if(data){
      dispatch({
        type: 'approval/result',
        payload:obj,
        callback:(res)=>{
          if(res.errCode === '0'){
            message.success('已完成',1.5,()=>{
              this.setState({
                agreeStatus:false,
                refuseStatus:false,
                returnStatus:false,
              })
              //添加消息
              this.addinfo(data)
              router.push('/approval/travelbusiness/list');
            });
          }else{
            message.error('提交失败');
          }
        },
      });
    }else{
      dispatch({
        type: 'approval/refuse',
        payload:obj,
        callback:(res)=>{
          if(res.errCode === '0'){
            message.success('已完成',1.5,()=>{
              this.setState({
                agreeStatus:false,
                returnStatus:false,
              })
              //添加消息
              this.addinfo(data)
              router.push('/approval/travelbusiness/list');
            });
          }else{
            message.error('提交失败')
          }
        },
      });
    }
  }*/
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
              this.setState({
                agreeStatus:false,
                refuseStatus:false,
                returnStatus:false,
              })
              //添加消息
              this.addinfo(is)
              router.push('/approval/travelbusiness/list');
            });
          }else{
            message.error('提交失败');
          }
        },
      });
    }else{
      dispatch({
        type: 'approval/refuse',
        payload:obj,
        callback:(res)=>{
          if(res.errCode === '0'){
            message.success('已完成',1.5,()=>{
              qinChu();
              changeStatus();
              this.setState({
                agreeStatus:false,
                returnStatus:false,
              })
              //添加消息
              this.addinfo(is)
              router.push('/approval/travelbusiness/list');
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
          router.push('/approval/travelbusiness/list');
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
  //查看发票
  lookTicket = (e,record)=>{
    e.preventDefault();
    const { dispatch } = this.props
    this.setState({lookTicketShow:true})
    dispatch({
      type:'TT/fetchList',
      payload:{
        reqData:{
          bill_id:record.id,
          type:'invoice'
        }
      },
      callback:(response)=>{
        console.log('发票的数据',response)
        this.setState({lookFileTicket:response})
      }
    });
  }
  lookFileThing = (e,record)=>{
    e.preventDefault();
    const { dispatch } = this.props
    this.setState({
      lookShow:true,

    })
    dispatch({
      type:'TT/fetchList',
      payload:{
        reqData:{
          bill_id:record.id,
          type:'wmtravelclaimform'
        }
      },
      callback:(response)=>{
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
  lookAdvice = ()=>{
    this.setState({
      lookstatus: !this.state.lookstatus
    })
  }
  renderLookStatus (){
    const ss = this.state.ss
    return <Card title="审批意见" style={{ marginTop: 24 }} bordered={false}>
      <div style={{paddingLeft:'20px'}}>
        {
          ss.length?ss.map((item,key)=>{
            return <div style={{marginBottom:"10px",}} key={key}>
              <b style={{display:'inline-block',marginRight:'10px'}}>{item.userName}({item.typeName})</b>
              {item.time}
              <p style={{height:'30px',lineHeight:'30px'}}>{item.message}</p>
            </div>

          }):'暂无审批意见！'
        }


      </div>
    </Card>
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
  handleCancel = () => this.setState({ previewVisible: false });
  render() {
    const {
      loadingChild,
      loading,
      loadingList,
      TT:{childData},
      form: { getFieldDecorator },
    } = this.props;
    const { detailSource,mny } = this.state;
    const { previewVisible, previewImage } = this.state
    const childColumns = [
      {
        title: '收支项目',
        dataIndex: 'costsubjName',
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
            <a href="#javascript:;"  onClick={(e)=> this.lookTicket(e,record)}>查看发票</a>
          </Fragment>
        ),

      },
      {
        title: '',
        width:1,
        dataIndex: 'operating',
      },
    ];
    const description = (
      <DescriptionList size="small" col="2">
        <Description term="单据号">{detailSource?detailSource.billcode:''}</Description>
        <Description term="单据日期">{detailSource?detailSource.billdate:''}</Description>
        <Description term="所属项目">
          <Tooltip title={detailSource?detailSource.projectName:''}>
            <p style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>{detailSource?detailSource.projectName:''}</p>
          </Tooltip>
        </Description>
        <Description term="部门">{detailSource?detailSource.deptName:''}</Description>
        <Description term="报销人">{detailSource?detailSource.psnName:''}</Description>
        <Description term='报销金额'>{mny?mny:''}</Description>
        <Description term='出差天数'>{detailSource?detailSource.travaldays:''}</Description>
        <Description term='备注'>{detailSource?detailSource.memo:''}</Description>
        <Description term='状态'>{detailSource?detailSource.status:''}</Description>
      </DescriptionList>
    );

    const action = (
      <Fragment>
        <Button type="primary" onClick={()=>this.lookAdvice()}>查看审批意见</Button>
        <Button type="primary" onClick={()=>this.onStatus()}>查看当前状态</Button>
      </Fragment>
    );
    const ticketprops = {
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      listType: 'picture-card',
      fileList: this.state.lookFileTicket

    }

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
        title='差旅费申请详情'
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={description}
        onTabChange={this.onOperationTabChange}
      >
        <Card>
          <NormalTable
            loading={loadingChild}
            data={{list:childData}}
            columns={childColumns}
            pagination={false}
          />
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
                {...ticketprops}
                onPreview={this.handlePreview}
              >
              </Upload>
            </Spin>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            {/* { this.state.lookFileTicket.length ?
              this.state.lookFileTicket.map((item,index)=>{
                return <p key={index}>
                  <a download target="_blank" href={item.url} >{item.name}</a>
                </p>
              }) : '暂无附件'
            }*/}
          </Modal>
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
        </Card>
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

export default WorkApplication;

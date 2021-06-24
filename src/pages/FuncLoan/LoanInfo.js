import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';

import {
  Form,
  Button,
  Tooltip,
  Modal,
  message, Card,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import NormalTable from '@/components/NormalTable';
import LoanAgree from './LoanAgree';
import LoanReject from './LoanReject';
import env from '../../../config/env';
import storage from '@/utils/storage';

const { Description } = DescriptionList;

@connect(({ loan, loading }) => ({
  loan,
  loading: loading.models.loan,
}))
@Form.create()
class LoanInfo extends PureComponent {
  state = {
    fileList:[],
    tableList:[],
    attachmentsList:[],
    fileShow:false,
    finaceok:true,
    initDate:{},
    current:1,
    agreeVisible:false,
    rejectVisible:false,
    fileName:{},
    detailMore:{},
    loanApplyNo:'',
    attaType:['jpg','png','jpeg'],
    checkStatus:false,
    auth:false,
    lookMore:false,
    type:0
  };

  backClick = ()=>{
    router.push('/loan/list');
  }

  componentDidMount(){
    const { dispatch } = this.props;
    const { id = 0 } = this.props.match.params;

    const auth = storage.get(`antd-pro-authority`);
    if(auth.indexOf("admin") !== -1 || auth.indexOf("loanAudit") !== -1){
      this.setState({
        auth:true
      })
    }

    dispatch({
      type:'loan/queryId',
      payload:{
        conditions:[{code:'id',exp:"=",value:id}]
      },
      callback:(res)=>{
        if(res.errMsg === "成功" && res.resData && res.resData.length){
          const  record  = res.resData[0];
          const { attas,type } = record;
          let attachmentsList = [];
          if(attas && attas.length){
            attachmentsList = JSON.parse(attas)
            attachmentsList.map((item,index)=>{
              item.key = index
            })
          }

          this.setState({
            initDate:record,
            loanApplyNo:record.loanApplyNo,
            attachmentsList,
            type
          })
          if(record.status){
            this.setState({
              checkStatus:true
            })
          }
        }
      }
    })
  }

  filemodal = ()=>{
    this.setState({
      fileShow: true
    })
  }

  fileCancel = ()=>{
    this.setState({
      fileShow: false
    })
  }

  onCancel = ()=>{
    this.setState({
      contactModal:false
    })
  };

  agree = ()=>{
    this.setState({
      agreeVisible:true
    })
  }

  reject = ()=>{
    this.setState({
      rejectVisible:true
    })
  }

  onLook = ()=>{
    const { dispatch } = this.props
    const { initDate } = this.state
    this.setState({
      agreeVisible:true
    })
    dispatch({
      type:'loan/lookLoan',
      payload:{
        conditions:[{
          code:'loan_id',
          exp:'=',
          value:initDate.id
        }],
        pageIndex:0,
        pageSize:100000,
      },
      callback:(res)=>{
        if(res.list){
          this.setState({
            tableList:res.list
          })
        }
      }
    })

  }

  lookInfor = ()=>{
    const { dispatch } = this.props
    const { initDate } = this.state
    dispatch({
      type:'loan/findmore',
      payload:{
        conditions:[{
          code:"customer_id",
          exp:'=',
          value:initDate.customerId
        }]
      },
      callback:(res)=>{
        this.setState({
          detailMore:res
        })
        console.log('详情结果',res)
      }
    })
    this.setState({
      lookMore:true
    })
  }

  lookCancel = ()=>{
    this.setState({
      lookMore:false
    })
  }

  render() {
    const {
      loading,
      dispatch,
      form: { getFieldDecorator },
    } = this.props;
    const { auth,type,attaType,initDate,tableList,attachmentsList,checkStatus } = this.state
    console.log('--initDate',initDate)
    const description = (
      <DescriptionList >
        {/* <Description term="产品编号">
          <Tooltip title={this.state.initDate?this.state.initDate.productCode:''}>
            <p style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>{this.state.initDate?this.state.initDate.productCode:''}</p>
          </Tooltip>
        </Description>*/}
        <Description term="公司名称">
          <Tooltip title={this.state.initDate?this.state.initDate.companyName:''}>
            <p style={{fontWeight:'900',width:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0}}>
              {this.state.initDate?this.state.initDate.companyName:''}
            </p>
          </Tooltip>
        </Description>
        <Description style={{cursor:'pointer',}}
                     term="阿里客户" onClick={this.lookInfor}>
          <b style={{color:'#3855e8'}}>{this.state.initDate?this.state.initDate.customerId:''}</b></Description>

      </DescriptionList>
    );
    const action = (
      <Fragment>
        {
          type === 1?auth?<Button type="primary" onClick={this.reject} disabled={checkStatus}>审核</Button>:<Button disabled>无权限</Button>:<Button disabled>数据有误</Button>
        }
        <Button type="primary" onClick={this.filemodal}>查看附件</Button>
        <Button type="primary" onClick={this.onLook}>查看结果</Button>
        <Button type="primary" onClick={this.backClick}>返回</Button>
      </Fragment>
    );

    const OnAddAgree = {
      onSave:(clear)=>{
        clear();
        this.setState({
          agreeVisible:false
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          agreeVisible:false
        })
      }
    }

    const OnAgreeData = {
      visible:this.state.agreeVisible,
      record:tableList,
    }

    const OnAddReject = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'loan/reject',
          payload:obj,
          callback:(res)=>{
            if(res.errCode === 200){
              message.success(`成功-${res.resData}`,1.5,()=>{
                clear()
                this.setState({
                  checkStatus:true,
                  rejectVisible:false
                })
              })
            }else{
              message.error(`失败-${res.errMsg}`,1.5,()=>{
                clear(1)
                this.setState({
                  checkStatus:false
                })
              })
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          rejectVisible:false
          //

        })
      }
    }

    const OnRejectData = {
      visible:this.state.rejectVisible,
      record:initDate,
    }

    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        render: (text)=>{
          return text + 1
        }
      },
      {
        title: '附件类型',
        dataIndex: 'type',
        render:((text,record)=>{
          switch (text) {
            case 'QCBL_INVISIBLE_FACTOR_CONTRACT_AGREEMENT':
              return '保理协议（暗保）';
            case 'QCBL_LEGAL_GUARANTEE_CONTRACT_AGREEMENT':
              return '法人担保协议';
            case 'QCBL_SPOUSE_GUARANTEE_CONTRACT_AGREEMENT':
              return '配偶担保协议';
            case 'QCBL_LOAN_CONFIRMATION_AGREEMENT':
              return '放款确认书';
            case 'COMPANY_LICENSE':
              return '公司证件';
            case 'MARRIAGE_CERTIFICATE':
              return '结婚证';
            case 'PERSON_ID_CARD_FRONT':
              return '身份证正面';
            case 'PERSON_ID_CARD_BACK':
              return '身份证反面';
            default :
              return text;
          }
        })
      },
      {
        title: '附件名称',
        dataIndex:'name',
        render: (text, record) => (

          <a target="_blank" href={`${env}/static/file/${initDate.pathDate}/${text}`} download>{text}</a>        )

      },
      {
        title: '',
        dataIndex:'caozuo',
        width:1
      }
    ];


    return (
      <PageHeaderWrapper
        title='公司基本信息'
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={description}
        /*extraContent={}*/
        onTabChange={this.onOperationTabChange}
      >
        <Card title={'单证信息'} >
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <p style={{width:'33.33333333%',display:'flex',flexDirection:'row',}}>
              <span style={{}}>贷款产品编号：</span><b>
              <Tooltip title={this.state.initDate.loanProductCode?this.state.initDate.loanProductCode:''}>
                <p style={{fontWeight:'900',width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0,}}>
                  {this.state.initDate.loanProductCode?this.state.initDate.loanProductCode:''}
                </p>
              </Tooltip>
            </b>
            </p>
            <p style={{width:'33.33333333%',display:'flex',flexDirection:'row',}}>
              <span style={{}}>交易货品名称：</span><b>
              <Tooltip title={this.state.initDate.saleProductName?this.state.initDate.saleProductName:''}>
                <p style={{fontWeight:'900',width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0,}}>
                  {this.state.initDate.saleProductName?this.state.initDate.saleProductName:''}
                </p>
              </Tooltip>
            </b>
            </p>
            <p style={{width:'33.33333333%'}}>
              收货时间：<b>{this.state.initDate.productReceiveTime?this.state.initDate.productReceiveTime:''}</b>
            </p>

          </div>
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <p style={{width:'33.33333333%'}}>
              订单生成时间：<b>{this.state.initDate.orderCreateTime?this.state.initDate.orderCreateTime:''}</b>
            </p>
            <p style={{width:'33.33333333%'}}>
              结算单金额(单位:元)：<b>{this.state.initDate.statementAmount?Number(this.state.initDate.statementAmount).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,'):''}</b>
            </p>
            <p style={{width:'33.33333333%'}}>
              订单付款日期：<b>{this.state.initDate.orderPaymentTime?this.state.initDate.orderPaymentTime:''}</b>
            </p>
          </div>
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <p style={{width:'33.33333333%'}}>
              结算单付款日期：<b>{this.state.initDate.statementPaymentTime?this.state.initDate.statementPaymentTime:''}</b>
            </p>
            <p style={{width:'33.33333333%',display:'flex',flexDirection:'row',}}>
              <span style={{}}>物流单号：</span><b>
              <Tooltip title={this.state.initDate.logisticsNumber?this.state.initDate.logisticsNumber:''}>
                <p style={{fontWeight:'900',width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0,}}>
                  {this.state.initDate.logisticsNumber?this.state.initDate.logisticsNumber:''}
                </p>
              </Tooltip>
            </b>
            </p>
            <p style={{width:'33.33333333%'}}></p>
          </div>
        </Card>
        <Card title={'支用申请信息'} style={{marginTop:'25px'}}>
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <p style={{width:'33.33333333%',display:'flex',flexDirection:'row',}}>
              <span style={{}}>贷款申请编号：</span><b>
              <Tooltip title={this.state.initDate?this.state.initDate.loanApplyNo:''}>
                <p style={{fontWeight:'900',width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0,}}>
                  {this.state.initDate.loanApplyNo?this.state.initDate.loanApplyNo:''}
                </p>
              </Tooltip>
            </b>
            </p>
            <p style={{width:'33.33333333%',display:'flex',flexDirection:'row',}}>
              <span style={{}}>贷款合同编号：</span><b>
              <Tooltip title={this.state.initDate.loanNo?this.state.initDate.loanNo:''}>
                <p style={{fontWeight:'900',width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace: 'nowrap',padding:0,margin:0,}}>
                  {this.state.initDate.loanNo?this.state.initDate.loanNo:''}
                </p>
              </Tooltip>
            </b>
            </p>
            <p style={{width:'33.33333333%'}}>
              申请放款时间：<b>{this.state.initDate.loanApplyTime?this.state.initDate.loanApplyTime:''}</b>
            </p>

          </div>
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <p style={{width:'33.33333333%'}}>
              申请放款金额(单位:元)：<b>{this.state.initDate.loanAmount?Number(this.state.initDate.loanAmount).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,'):''}</b>
            </p>
            <p style={{width:'33.33333333%'}}>
              执行年化费率：<b>{this.state.initDate.rate?this.state.initDate.rate:''}</b>
            </p>
            <p style={{width:'33.33333333%'}}>

            </p>
          </div>
        </Card>
        <Modal
          title="附件"
          visible={this.state.fileShow}
          onCancel={this.fileCancel}
          width={"70%"}
          footer={null}
        >
          <NormalTable
            columns={columns}
            dataSource={attachmentsList}
            loading={loading}
            pagination={false}
          />
        </Modal>
        <Modal
          title="详情"
          visible={this.state.lookMore}
          onCancel={this.lookCancel}
          width={"80%"}
          footer={null}
        >
          <Card bordered={false} style={{margin:0,padding:0}}>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
              <p style={{width:'50%'}}>
                公司证件类型：<b>{this.state.detailMore?this.state.detailMore.companyLicenseType:''}</b>
              </p>
              <p style={{width:'50%'}}>
                企业身份标识号码：<b>{this.state.detailMore?this.state.detailMore.companyLicenseNo:''}</b>
              </p>
            </div>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
              <p style={{width:'50%'}}>
                对公账户户名：<b>{this.state.detailMore?this.state.detailMore.publicAccountsName:''}</b>
              </p>
              <p style={{width:'50%'}}>
                对公账户银行名字：<b>{this.state.detailMore?this.state.detailMore.publicAccountsBank:''}</b>
              </p>
            </div>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
              <p style={{width:'50%'}}>
                对公账户开户支行：<b>{this.state.detailMore?this.state.detailMore.publicAccountsBranchBank:''}</b>
              </p>
              <p style={{width:'50%'}}>
                对公账户账号：<b>{this.state.detailMore?this.state.detailMore.publicAccountsNo:''}</b>
              </p>
            </div>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
              <p style={{width:'50%'}}>
                联系人姓名：<b>{this.state.detailMore?this.state.detailMore.contactPersonName:''}</b>
              </p>
              <p style={{width:'50%'}}>
                联系人手机号码：<b>{this.state.detailMore?this.state.detailMore.contactPersonPhoneNo:''}</b>
              </p>
            </div>
          </Card>
        </Modal>
        <LoanAgree on={OnAddAgree} data={OnAgreeData} />
        <LoanReject on={OnAddReject} data={OnRejectData} />
      </PageHeaderWrapper>
    );
  }
}

export default LoanInfo;

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import storage from '@/utils/storage'
import {
  Row,
  Col,
  List,
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
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import NormalTable from '@/components/NormalTable';
import CreditAgree from './CreditAgree';
import CreditReject from './CreditReject';
import env from '../../../config/env';
const { Description } = DescriptionList;

@connect(({ Cre, loading }) => ({
  Cre,
  loading: loading.models.Cre,
}))
@Form.create()
class CreditInfo extends PureComponent {
  state = {
    fileList: [],
    fileShow: false,
    finaceok: true,
    initDate: {},
    agreeVisible: false,
    rejectVisible: false,
    fileName: {},
    creditApplyNo: '',
    tableList: [],
    current: 1,
    attachmentsList: [],
    attaType: ['jpg', 'png', 'jpeg'],
    checkStatus: false,
    auth: false,
    type: 0,
    amountRatio: null
  };

  backClick = () => {
    router.push('/credit');
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { id = 0 } = this.props.match.params;
    const auth = storage.get(`antd-pro-authority`);
    if (auth.indexOf("admin") !== -1 || auth.indexOf("creditAudit") !== -1) {
      console.log("有权限")
      this.setState({
        auth: true
      })
    }
    dispatch({
      type: 'Cre/queryId',
      payload: {
        conditions: [{ code: 'id', exp: "=", value: id }]
      },
      callback: (res) => {
        if (res.errMsg === "成功" && res.resData && res.resData.length) {
          const record = res.resData[0];
          const { attas, type, platformPaymentCollectionAmountWithCoreCompany1Year, platformTotalSettlementAmountWithCoreCompany1Year } = record;
          let attachmentsList = [];
          if (attas && attas.length) {
            attachmentsList = JSON.parse(attas)
            attachmentsList.map((item, index) => {
              item.key = index
            })
          }

          switch (record.legalPersonMaritalStatus) {
            case 'UNMARRIED': record.legalPersonMaritalStatus = '未婚'
              break;
            case 'MARRIED': record.legalPersonMaritalStatus = '已婚'
              break;
            case 'DIVORCED': record.legalPersonMaritalStatus = '离异'
              break;
            case 'WIDOWED': record.legalPersonMaritalStatus = '丧偶'
              break;
            default: record.legalPersonMaritalStatus = '未知'
          }
          switch (record.companyLicenseType) {
            case 'UNITY': record.companyLicenseType = '企业的统一社会信用代码'
              break;
            case 'GENERAL': record.companyLicenseType = '传统工商注册类型'
              break;
            default: record.companyLicenseType = '未知'
          }

          switch (record.legalPersonLicenseType) {
            case 'IDENTITY_CARD': record.legalPersonLicenseType = '身份证'
              break;
            default: record.legalPersonLicenseType = '其他'
          }

          switch (record.legalPersonMateLicenseType) {
            case 'IDENTITY_CARD': record.legalPersonMateLicenseType = '身份证'
              break;
            default: record.legalPersonMateLicenseType = '其他'
          }

          const amountRatio = Number(platformPaymentCollectionAmountWithCoreCompany1Year || 0) / Number(platformTotalSettlementAmountWithCoreCompany1Year || 0) * 100
          console.log(platformPaymentCollectionAmountWithCoreCompany1Year)
          console.log(platformTotalSettlementAmountWithCoreCompany1Year)

          this.setState({
            initDate: record,
            creditApplyNo: record.creditApplyNo,
            attachmentsList,
            type,
            amountRatio
          })
          if (record.status) {
            this.setState({
              checkStatus: true
            })
          }
        }
      }
    })
  }

  filemodal = () => {
    this.setState({
      fileShow: true
    })
  }

  fileCancel = () => {
    this.setState({
      fileShow: false
    })
  }

  onCancel = () => {
    this.setState({
      contactModal: false
    })
  };

  agree = () => {
    this.setState({
      agreeVisible: true
    })
  }

  reject = () => {
    this.setState({
      rejectVisible: true
    })
  }

  onLook = () => {
    const { dispatch } = this.props
    const { initDate } = this.state
    this.setState({
      agreeVisible: true
    })
    dispatch({
      type: 'Cre/lookTable',
      payload: {
        conditions: [{
          code: 'credit_id',
          exp: '=',
          value: initDate.id
        }],
        pageIndex: 0,
        pageSize: 100000,
      },
      callback: (res) => {
        if (res.list) {
          this.setState({
            tableList: res.list
          })
        }
      }
    })

  }

  render() {
    const {
      loading,
      dispatch,
      form: { getFieldDecorator },
    } = this.props;
    const { type, tableList, attachmentsList, auth, checkStatus, initDate } = this.state;
    const description = (
      <DescriptionList >
        <Description term="公司名称">
          <Tooltip title={this.state.initDate ? this.state.initDate.companyName : ''}>
            <p style={{ fontWeight: '900', width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: 0, margin: 0 }}>
              {this.state.initDate ? this.state.initDate.companyName : ''}
            </p>
          </Tooltip>
        </Description>
        <Description term="阿里客户"><b>{this.state.initDate ? this.state.initDate.customerId : ''}</b></Description>
        <Description term="公司证件类型">
          <b>{this.state.initDate ? this.state.initDate.companyLicenseType : ''}</b>
        </Description>

        <Description term="企业身份标识号码"><b>{this.state.initDate ? this.state.initDate.companyLicenseNo : ''}</b></Description>
        <Description term="联系人姓名"><b>{this.state.initDate ? this.state.initDate.contactPersonName : ''}</b></Description>
        <Description term="联系人手机号码"><b>{this.state.initDate ? this.state.initDate.contactPersonPhoneNo : ''}</b></Description>

        <Description term="对公账户户名">
          <Tooltip title={this.state.initDate ? this.state.initDate.publicAccountsName : ''}>
            <p style={{ fontWeight: '900', width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: 0, margin: 0 }}>
              {this.state.initDate ? this.state.initDate.publicAccountsName : ''}
            </p>
          </Tooltip>
        </Description>
        <Description term="对公账户银行名字">
          <Tooltip title={this.state.initDate ? this.state.initDate.publicAccountsBank : ''}>
            <p style={{ fontWeight: '900', width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: 0, margin: 0 }}>
              {this.state.initDate ? this.state.initDate.publicAccountsBank : ''}
            </p>
          </Tooltip>
        </Description>
        <Description term="对公账户开户支行">
          <Tooltip title={this.state.initDate ? this.state.initDate.publicAccountsBranchBank : ''}>
            <p style={{ fontWeight: '900', width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: 0, margin: 0 }}>
              {this.state.initDate ? this.state.initDate.publicAccountsBranchBank : ''}
            </p>
          </Tooltip>
        </Description>
        <Description term="对公账户账号">
          <Tooltip title={this.state.initDate ? this.state.initDate.publicAccountsNo : ''}>
            <p style={{ fontWeight: '900', width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: 0, margin: 0 }}>
              {this.state.initDate ? this.state.initDate.publicAccountsNo : ''}
            </p>
          </Tooltip>
        </Description>

      </DescriptionList>
    );
    const action = (
      <Fragment>
        {
          type === 1 ? auth ? <Button type="primary" onClick={this.reject} disabled={checkStatus}>审核</Button> : <Button type="primary" disabled>无权限</Button> : <Button type="primary" disabled>数据有误</Button>
        }
        <Button type="primary" onClick={this.filemodal}>查看附件</Button>
        <Button type="primary" onClick={this.onLook}>查看结果</Button>
        <Button type="primary" onClick={this.backClick}>返回</Button>
      </Fragment>
    );
    const OnAddAgree = {
      onSave: (clear) => {
        clear();
        this.setState({
          agreeVisible: false
        })
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          agreeVisible: false
        })
      }
    }
    const OnAgreeData = {
      visible: this.state.agreeVisible,
      record: tableList
    }

    const OnAddReject = {
      onSave: (obj, clear) => {
        console.log('提交数据', obj)
        dispatch({
          type: 'Cre/reject',
          payload: obj,
          callback: (res) => {
            if (res.errCode === 200) {
              message.success(`成功-${res.resData}`, 1.5, () => {
                clear()
                this.setState({
                  checkStatus: true,
                  rejectVisible: false
                })
              })
            } else {
              message.error(`失败-${res.errMsg}`, 1.5, () => {
                clear(1)
                this.setState({
                  checkStatus: false
                })
              })
            }
          }
        })
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          rejectVisible: false
          //

        })
      }
    }
    const OnRejectData = {
      visible: this.state.rejectVisible,
      record: this.state.initDate,
    }

    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        render: (text) => {
          return text + 1
        }
      },
      {
        title: '附件类型',
        dataIndex: 'type',
        render: ((text, record) => {
          switch (text) {
            case 'COMPANY_LICENSE':
              return '营业执照影像件';
            case 'PERSON_ID_CARD_FRONT':
              return '法人身份证影像件（正面）';
            case 'PERSON_ID_CARD_BACK':
              return '法人身份证影像件（反面）';
            case 'MARRIAGE_CERTIFICATE':
              return '结婚证照片';
            case 'DIVORCE_CERTIFICATE':
              return '离婚证';
            case 'BACHELOR_CERTIFICATE':
              return '单身证明书';
            case 'COMPANY_LICENSE':
              return '公司证件';
            case 'MARRIAGE_CERTIFICATE':
              return '结婚证';
            case 'DIVORCE_CERTIFICATE':
              return '离婚证';
            case 'PERSON_ID_CARD_FRONT':
              return '身份证正面';
            case 'PERSON_ID_CARD_BACK':
              return '身份证反面';
            case 'LEGAL_PERSON_CREDIT_REPORT':
              return '法人代表征信报告';
            case 'ENTERPRISE_CREDIT_REPORT':
              return '企业征信报告';
            case 'ENTERPRISE_3YEAR_FINANCING_REPORT':
              return '企业近三年及当期财报';
            case 'ENTERPRISE_OUT_FINANCING_DETAIL':
              return '企业外部融资明细';
            case 'HOUSE_CERTIFICATE':
              return '房产证';
              case 'WIDOW_CERTIFICATE':
                return '丧偶证明';
            default:
              return text;
          }
        })
      },
      {
        title: '附件名称',
        dataIndex: 'name',
        render: (text, record) => (
          <a target="_blank" href={`${env}/static/file/${initDate.pathDate}/${text}`} download>{text}</a>),
      },
      {
        title: '',
        dataIndex: 'caozuo',
        width: 1
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
        onTabChange={this.onOperationTabChange}
      >

        <Card title={'法人相关信息'} >
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <p style={{ width: '33.33333333%' }}>
              法人姓名：<b>{this.state.initDate.legalPersonName ? this.state.initDate.legalPersonName : ''}</b>
            </p>
            <p style={{ width: '33.33333333%' }}>
              法人证件类型：<b>{this.state.initDate.legalPersonLicenseType ? this.state.initDate.legalPersonLicenseType : ''}</b>
            </p>
            <p style={{ width: '33.33333333%', display: 'flex', flexDirection: 'row', }}>
              <span style={{}}>法人证件号码：</span><b>
                <Tooltip title={this.state.initDate.legalPersonLicenseNo ? this.state.initDate.legalPersonLicenseNo : ''}>
                  <p style={{ fontWeight: '900', width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: 0, margin: 0, }}>
                    {this.state.initDate ? this.state.initDate.legalPersonLicenseNo : ''}
                  </p>
                </Tooltip>
              </b>
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <p style={{ width: '33.33333333%' }}>
              法人手机号：<b>{this.state.initDate.legalPersonPhoneNo ? this.state.initDate.legalPersonPhoneNo : ''}</b>
            </p>
            <p style={{ width: '33.33333333%' }}>
              法人婚姻状态：<b>{this.state.initDate.legalPersonMaritalStatus ? this.state.initDate.legalPersonMaritalStatus : ''}</b>
            </p>
            <p style={{ width: '33.33333333%' }}>
              法人配偶姓名：<b>{this.state.initDate.legalPersonMateName ? this.state.initDate.legalPersonMateName : ''}</b>
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <p style={{ width: '33.33333333%' }}>
              法人配偶证件类型：<b>{this.state.initDate.legalPersonMateLicenseType ? this.state.initDate.legalPersonMateLicenseType : ''}</b>
            </p>
            <p style={{ width: '33.33333333%', display: 'flex', flexDirection: 'row', }}>
              <span style={{}}>法人配偶证件号码：</span><b>
                <Tooltip title={this.state.initDate.legalPersonMateLicenseNo ? this.state.initDate.legalPersonMateLicenseNo : ''}>
                  <p style={{ fontWeight: '900', width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: 0, margin: 0, }}>
                    {this.state.initDate ? this.state.initDate.legalPersonMateLicenseNo : ''}
                  </p>
                </Tooltip>
              </b>
            </p>
            <p style={{ width: '33.33333333%' }}></p>
          </div>
        </Card>
        <Card title={'公司经营信息'} style={{ marginTop: '25px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <p style={{ width: '33.33333333%' }}>
              平台注册时间：<b>{this.state.initDate.platformRegisteredTime ? this.state.initDate.platformRegisteredTime : ''}</b>
            </p>
            <p style={{ width: '33.33333333%' }}>
              年交易金额：<b>{this.state.initDate.platformTransactionAmount1Year ? Number(this.state.initDate.platformTransactionAmount1Year).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : ''}</b>
            </p>
            <p style={{ width: '33.33333333%' }}>
              平台累计回款金额(单位:元)：<b>{this.state.initDate.platformTotalPaymentCollectionAmount1Year ? Number(this.state.initDate.platformTotalPaymentCollectionAmount1Year).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : ''}</b>
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <p style={{ width: '33.33333333%' }}>
              平台年订单金额(单位:元)：<b>{this.state.initDate.platformOrderAmount1Year ? Number(this.state.initDate.platformOrderAmount1Year).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : ''}</b>
            </p>
            <p style={{ width: '33.33333333%' }}>
              平台年结算单笔数：<b>{this.state.initDate.platformSettlementNumber1Year ? this.state.initDate.platformSettlementNumber1Year : ''}</b>
            </p>
            <p style={{ width: '33.33333333%', display: 'flex', flexDirection: 'row', }}>
              <span>与核企平台年累计结算单金额(单位:元)：</span><b>
                {this.state.initDate.platformTotalSettlementAmountWithCoreCompany1Year ? Number(this.state.initDate.platformTotalSettlementAmountWithCoreCompany1Year).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : ''}
              </b>
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <p style={{ width: '33.33333333%' }}>
              平台年结算单金额(单位:元)：<b>{this.state.initDate.platformSettlementAmount1Year ? Number(this.state.initDate.platformSettlementAmount1Year).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : ''}</b>
            </p>
            <p style={{ width: '33.33333333%', display: 'flex', flexDirection: 'row', }}>
              <span style={{}}>与核企（准入买家）的年回款金额：</span><b>
                <Tooltip title={this.state.initDate.platformPaymentCollectionAmountWithCoreCompany1Year ? Number(this.state.initDate.platformPaymentCollectionAmountWithCoreCompany1Year).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : ''}>
                  <p style={{ fontWeight: '900', width: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: 0, margin: 0, }}>
                    {this.state.initDate.platformPaymentCollectionAmountWithCoreCompany1Year ? Number(this.state.initDate.platformPaymentCollectionAmountWithCoreCompany1Year).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : ''}
                  </p>
                </Tooltip>
              </b>
            </p>
            <p style={{ width: '33.33333333%' }}>
              与核企（准入买家）的年结算单笔数：<b>{this.state.initDate.platformSettlementNumberWithCoreCompany1Year ? this.state.initDate.platformSettlementNumberWithCoreCompany1Year : ''}</b>
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <p style={{ width: '33.33333333%' }}>
              线上年回款比例：<b>{this.state.amountRatio ? this.state.amountRatio.toFixed(2) : ''}%</b>
            </p>
            <p style={{ width: '33.33333333%' }}>

            </p>
            <p style={{ width: '33.33333333%' }}>

            </p>
          </div>
        </Card>
        <Card title={'授信申请信息'} style={{ marginTop: '25px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <p style={{ width: '33.33333333%' }}>
              产品编号：<b>{this.state.initDate.productCode ? this.state.initDate.productCode : ''}</b>
            </p>
            <p style={{ width: '33.33333333%', display: 'flex', flexDirection: 'row', }}>
              <span style={{}}>授信申请单号：</span><b>
                <Tooltip title={this.state.initDate.creditApplyNo ? this.state.initDate.creditApplyNo : ''}>
                  <p style={{ fontWeight: '900', width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: 0, margin: 0, }}>
                    {this.state.initDate ? this.state.initDate.creditApplyNo : ''}
                  </p>
                </Tooltip>
              </b>
            </p>
            <p style={{ width: '33.33333333%' }}>

              建议额度(单位:元)：<b>{this.state.initDate.adviceQuota ? Number(this.state.initDate.adviceQuota).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : ''}</b>
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <p style={{ width: '33.33333333%' }}>
              建议单笔最高额度(单位:元)：<b>{this.state.initDate.loanLimitQuota ? Number(this.state.initDate.loanLimitQuota).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : ''}</b>
            </p>
            <p style={{ width: '33.33333333%', display: 'flex', flexDirection: 'row', }}>

            </p>
            <p style={{ width: '33.33333333%' }}>

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
        <CreditAgree on={OnAddAgree} data={OnAgreeData} />
        <CreditReject on={OnAddReject} data={OnRejectData} />
      </PageHeaderWrapper>
    );
  }
}

export default CreditInfo;

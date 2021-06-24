import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import moment from 'moment';
import api from '@/pages/tool/api/api'
import router from 'umi/router';
import storage from '@/utils/storage'
import {
  Checkbox,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  TreeSelect,
  Radio,
  Modal,
  Tree,
  AutoComplete,
  Row,
  Col,
  message,
  Popconfirm,
  Table,
  Tabs,
  Divider,
  Upload,
  Icon,
} from 'antd';
import TreeTable from '../../tool/TreeTable/TreeTable';
import { toTree } from '../../tool/ToTree';
import ModelTable from '../../tool/ModelTable/ModelTable';


const { TreeNode } = TreeSelect;
const { Option } = Select;

const fieldLabe = {
  fundname: '项目名称',
  fundtype: '项目类型',
  projector: '立项人',
  projectdate: '立项日期',
  projectmanager: '项目负责人',
  projectresponsibledepartment: '项目负责部门',
  itemamount: '项目经费(元)',
  costbudget: '成本预算(元)',
  projectschedulestart: '项目工期计划(开始)',
  projectschedulestop: '项目工期计划(结束)',
  externalexpenses: '外委费用(元)',
  taxrate: '税率',
  subcontractingratio: '分包比例(%)',
  professionalsubcontracting: '分包金额(元)',
  system: '系统内外',
  projectgrading: '项目分级',
  signingtime: '合同签订时间',
  acceptancetime: '合同验收时间',
  customertype: '客户类型',
  contractcontent: '合同内容',
  contractamount: '合同金额',
  additionalcharges: '额外费用',
  eca: '有效合同额',
  projectaddress: '项目所在地',
  paymentsitustion: '付款情况(%)',
  balance: '余额(万元)',
  businessleader: '商务负责人',
  p1: 'p1',
  p2: 'p2',
  p3: 'p3',
  p4: 'p4',
  p5: 'p5',
  p6: 'p6',
  cca: '贡献合同额',
  comname: '客户名称',
};

const dataAddKey = (data) => {
  return data.map((item) => {
    item.key = item.id;
    if (item.children) {
      dataAddKey(item.children);
    }
    return item;
  });
};


@connect(({ TL,pd,IAE, loading }) => ({
  TL,
  pd,
  IAE,
  loading: loading.models.TL,
}))
@Form.create()
class TravelChildUpdate extends PureComponent {
  state = {
    fileListTicket:[],
    costsubjId:null,
    costsubjName:null,
    costsubjTreeValue:[],

    record:{},

    char:["长途","汽车","火车","高铁","飞机"],

    dis:true,
    fileListTicketaa:[],
    fileList: [],
    deleteFileTicket:[],
    deleteFile:[]
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record.id !== this.props.data.record.id){
      console.log('---00',nextProps.data.record)
      const record = nextProps.data.record;
      const { dispatch } = this.props;
      //发票
      dispatch({
        type:'TL/fetchList',
        payload:{
          reqData:{
            bill_id:record.id,
            type:'invoice'
          }
        },
        callback:(res)=>{
          this.setState({
            fileListTicket:res
          })
        }
      });
      //附件
      dispatch({
        type:'TL/fetchticket',
        payload:{
          reqData:{
            bill_id:record.id,
            type:'wmtravelclaimform'
          }
        },
        callback:(res)=>{
          console.log("附件",res)
          this.setState({
            fileList:res
          })
        }
      });
      this.setState({
        costsubjId:record.costsubjId,
        costsubjName:record.costsubjName, //收支项目名
        record,
      })
    }
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode defaultExpandAll title={item.name} key={item.id} value={item.id}  dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} value={item.id} dataRef={item}/>;
    });

  onFocusDepartment = () => {
    const { dispatch } = this.props;
    console.log("执行")
    dispatch({
      type: 'TL/newdatasss',
      payload: {
        reqData: {},
      },
      callback: (res) => {
        console.log("res",res)
        if(res && res.resData){
          const a = toTree(res.resData);
          this.setState({
            costsubjTreeValue: a,
          });
        }
      },
    });
  };

  onChangDepartment = (value, label, extra) => {
    const { char } = this.state;
    let status = true;
    char.map(item =>{
      if(item === label[0]){
        status = false
      }
    });
    this.setState({
      costsubjId: value,
      dis:status
    });
  };

  onSubmit = (onOk)=>{
    const { form } = this.props;
    const { deleteFileTicket,deleteFile } = this.state;
    form.validateFields((err, values) => {
      if(err) return;
      const obj = {
        costsubjId:this.state.costsubjId,
        taxamount:values.taxamount?Number(values.taxamount):null,
        taxrate:values.taxrate?Number(values.taxrate):null,
        claimingamount:values.claimingamount?Number(values.claimingamount):null,
        addticket:this.state.fileListTicket,
        annex:this.state.fileList,
        memo:values.memo,
      };
      if(typeof onOk === 'function'){
        onOk(obj,deleteFileTicket,deleteFile,this.handleCancel)
      }
    })
  }

  handleCancel = (handleCancel)=>{
    if(typeof handleCancel === 'function'){
      handleCancel()
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      costsubjId:null,
      costsubjName:null,
      costsubjTreeValue:[],
      record:{},
      dis:true,
      fileListTicketaa:[],
      fileList: [],
      deleteFileTicket:[],
      deleteFile:[]
    })
  }

  taxrateChange = (e)=>{
    const { form } = this.props;
    const claimingamount = form.getFieldValue("claimingamount");
    const taxrate = e.target.value;
    if(claimingamount){
      form.setFieldsValue({
        taxamount:claimingamount * taxrate
      })
    }
  };

  claimingChange = (e)=>{
    const { form } = this.props;
    const taxrate = form.getFieldValue("taxrate");
    const claimingamount = e.target.value;
    if(taxrate){
      form.setFieldsValue({
        taxamount:claimingamount * taxrate
      })
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      data,
      on,
      dispatch
    } = this.props;

    const { record } = this.state;

    const { visible } = data;
    const { onOk,handleCancel } = on;
    let { fileListTicket,fileList } = this.state;

    const propsticket = {
      fileList:fileListTicket?fileListTicket:[],
      accept:".jpg,.png,.jpeg,.pdf",
      onRemove: file => {
        if(file.id){
          this.setState({
            deleteFileTicket:[...this.state.deleteFileTicket,file]
          })
        }
        this.setState(state => {
          const index = state.fileListTicket.indexOf(file);
          const newFileList = state.fileListTicket.slice();
          newFileList.splice(index, 1);
          return {
            fileListTicket: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileListTicket: [...state.fileListTicket, file],
        }));
        return false;
      }
    };
    const props = {
      fileList,
      onRemove: file => {
        if(file.id){
          this.setState({
            deleteFile:[...this.state.deleteFile,file]
          })
        }
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      }
    };

    return (
        <Modal
          title={"子表编辑"}
          visible={visible}
          width='80%'
          destroyOnClose
          centered
          onOk={()=>this.onSubmit(onOk)}
          onCancel={()=>this.handleCancel(handleCancel)}
        >
          <div style={{padding:'0 24px',height:document.body.clientHeight/1.5,overflow:"auto"}}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='费用类型'>
                  {getFieldDecorator('costsubjName', {
                    rules: [
                      {
                        required: true,
                        message:'请选择费用类型'
                      }
                    ],
                    initialValue:this.state.costsubjName
                  })(
                    <TreeSelect
                      treeDefaultExpandAll
                      style={{ width: '100%' }}
                      onFocus={this.onFocusDepartment}
                      onChange={this.onChangDepartment}
                      placeholder="请选择费用类型"
                    >
                      {this.renderTreeNodes(this.state.costsubjTreeValue)}
                    </TreeSelect >
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='报销金额'>
                  {getFieldDecorator('claimingamount', {
                    initialValue:record.claimingamount?record.claimingamount:null
                  })(<Input placeholder={"请输入报销金额"} type='number' onChange={this.claimingChange}/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='税率'>
                  {getFieldDecorator('taxrate', {
                    initialValue:record.taxrate?record.taxrate:null
                  })(<Input placeholder={"选择长途类设置"} style={{width:'100%'}} type='number' disabled={this.state.dis} onChange={this.taxrateChange}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='税金'>
                  {getFieldDecorator('taxamount', {
                    initialValue:record.taxamount?record.taxamount:null
                  })(<Input addonBefore="CNY" style={{width:'100%'}} type='number' disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='备注'>
                  {getFieldDecorator('memo', {
                    initialValue:record.memo?record.memo:null
                  })(<Input style={{width:'100%'}} placeholder='请输入备注' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>

              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="添加发票">
                  {getFieldDecorator('invoiceId', {
                  })(
                    <Upload {...propsticket} style={{width:'100%',display:'inline-block'}}>
                      <Button style={{width:'246px',display:'inline-block'}}>
                        <Icon type="upload" /> 请添加发票
                      </Button>
                    </Upload>)}
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="添加附件">
                  {getFieldDecorator('annex', {
                  })(
                    <Upload {...props}>
                      <Button style={{width:'246px',display:'inline-block'}}>
                        <Icon type="upload" /> 请添加附件
                      </Button>
                    </Upload>)}
                </Form.Item>
              </Col>

            </Row>
          </div>
        </Modal>
    );
  }
}

export default TravelChildUpdate;

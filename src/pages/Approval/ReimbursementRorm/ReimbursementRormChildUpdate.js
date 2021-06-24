import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  TreeSelect ,
  Button,
  Card,
  Checkbox,
  InputNumber,
  Tree,
  Icon,
  Tooltip,
  Modal,
  Select,
  message,
  Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { toTree } from '../../tool/ToTree';
import TreeTable from '../../tool/TreeTable/TreeTable';
const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;
@connect(({ RR, loading }) => ({
  RR,
  loading: loading.models.RR,
}))
@Form.create()
class BillManagementChildUpdate extends PureComponent {

  state = {
    invoiceHId:null,
    costsubjValue:[],
    costsubjId:null,
    costsubjname:"",
    claimingamount:null, //报销金额
    taxrate:null, //税率
    taxamount:null //税金
  };

  onOk = (onOk)=>{
    const { form } = this.props;
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        costsubjId:this.state.costsubjId,
        claimingamount:values.claimingamount?Number(values.claimingamount):0,
        taxamount:values.taxamount?Number(values.taxamount):0,
        taxrate:values.taxrate?Number(values.taxrate):0,
        memo:values.memo
      };
      if(typeof onOk === 'function'){
        onOk(obj)
      }
    })
  };

  handleCancel = (handleCancel)=>{
    handleCancel()
  }

  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'RR/fetchCostsubj',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        const a = toTree(res);
        console.log("a",a);
        this.setState({
          costsubjValue:a
        })
      }
    });
  }

  onChangDepartment=(value, label, extra)=>{
    console.log(value);
    this.setState({
      costsubjId:value
    })
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name}  key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name}  key={item.id} />;
    });

  onClaimingamount = (e)=>{
    const claimingamount = Number(e.target.value);
    const taxrate = this.state.taxrate;
    let taxamount = null;
    if(!taxrate){
      taxamount = 0
    }else{
      taxamount = ((claimingamount/(1 + taxrate))*taxrate).toFixed(4);
    }
    if(!claimingamount){
      taxamount = 0
    }
    this.setState({
      claimingamount,
      taxamount
    })
  }

  onTaxrate = (e)=>{
    const taxrate = Number(e.target.value);
    const claimingamount = this.state.claimingamount; //报销金额
    let taxamount = null;
    if(!claimingamount){
      taxamount = 0
    }else{
      taxamount = ((claimingamount/(1 + taxrate))*taxrate).toFixed(4);
    }
    if(!taxrate){
      taxamount = 0
    }
    this.setState({
      taxrate,
      taxamount
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record.id !== this.props.data.record.id){
      console.log("收支",nextProps.data)
      this.setState({
        claimingamount:nextProps.data.record.claimingamount,
        taxrate:nextProps.data.record.taxrate,
        taxamount:nextProps.data.record.taxamount,
        costsubjId:nextProps.data.record.costsubjId,
        costsubjname:nextProps.data.record.costsubjname,
      })
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data
    } = this.props;

    const { onOk,handleCancel } = on;

    const { visible,record } = data;

    return (
      <Modal
        title="添加"
        width='80%'
        destroyOnClose
        visible={visible}
        onOk={()=>this.onOk(onOk)}
        onCancel={()=>this.handleCancel(handleCancel)}
      >
        <Card bordered={false}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="收支项目">
                {getFieldDecorator('costsubjname',{
                  rules: [{required: true,message:'请选择收支项目'}],
                  initialValue: record.costsubjname?record.costsubjname:''
                })(<TreeSelect
                  treeDefaultExpandAll
                  style={{ width: '100%' }}
                  onFocus={this.onFocusDepartment}
                  onChange={this.onChangDepartment}
                  placeholder="请选择收支项目"
                >
                  {this.renderTreeNodes(this.state.costsubjValue)}
                </TreeSelect >)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label=" 报销金额">
                {getFieldDecorator('claimingamount',{
                  rules: [
                    {
                      required: true,
                      message:'报销金额'
                    }
                  ],
                  initialValue: this.state.claimingamount
                })(
                  <Input placeholder=" 报销金额" type='Number' onChange={this.onClaimingamount}/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="税率">
                {getFieldDecorator('taxrate',{
                  initialValue: this.state.taxrate
                })(<Input placeholder="请输入税率" type='Number' onChange={this.onTaxrate}/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="税金">
                {getFieldDecorator('taxamount', {
                  initialValue:this.state.taxamount
                })(<Input placeholder="请输入税金" type='Number' disabled/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={24} md={24} sm={24}>
              <Form.Item label="备注">
                {getFieldDecorator('memo',{
                })(
                  <TextArea rows={3}/>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Modal>
    );
  }
}

export default BillManagementChildUpdate;

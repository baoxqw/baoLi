import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  TreeSelect,
  Modal,
  Row,
  Spin,
  Col,
  message,
  Upload,
  Icon,
} from 'antd';
import { toTree } from '../../tool/ToTree';
const { TreeNode } = TreeSelect;

const dataAddKey = (data) => {
  return data.map((item) => {
    item.key = item.id;
    if (item.children) {
      dataAddKey(item.children);
    }
    return item;
  });
};

@connect(({ TL,pd, loading }) => ({
  TL,
  pd,
  loading: loading.models.TL,
}))
@Form.create()
class TravelChildAdd extends PureComponent {
  state = {
    costsubjId:null,
    costsubjName:null,
    costsubjTreeValue:[],

    char:["长途","汽车","火车","高铁","飞机"],

    dis:true,
    fileList: [],
    fileListTicket:[],
  };

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
    dispatch({
      type: 'TL/newdatasss',
      payload: {
        reqData: {},
      },
      callback: (res) => {
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

  onSubmit = (onOk,type)=>{
    const { form } = this.props;
    form.validateFields((err, values) => {
      if(err) return;
      const obj = {
        costsubjId:this.state.costsubjId,
        taxamount:values.taxamount?Number(values.taxamount):null,
        taxrate:values.taxrate?Number(values.taxrate):null,
        claimingamount:values.claimingamount?Number(values.claimingamount):null,
        //invoiceId:1,
        memo:values.memo,
        addticket:values.invoiceId,
        annex:values.annex,

      };
     /* const formData = new FormData();
      let file = [];
      //发票
      let invoice = []
      let type = []
      if(values.addticket){
        if(values.addticket.fileList){
          values.addticket.fileList.forEach((originFileObj,index)=>{
            invoice[index]=originFileObj
            file['invoice']=invoice
            formData.append('invoiceFile[]', originFileObj);
            formData.append('type[]', 'business');
            formData.append('parentpath', 'wmtravelclaimform');
          })
        }
      }
      //报销单
      let reimbursement = []
      if(values.annex){
        if(values.annex.fileList){
          values.annex.fileList.forEach((originFileObj,index)=>{
            formData.append('reimbursementFile[]', originFileObj);
            formData.append('type[]', 'business');
            formData.append('parentpath', 'wmtravelclaimform');
          })
        }
      }
      formData.append('invoiceFile[]', originFileObj);
      formData.append('reimbursementFile[]', originFileObj);
      formData.append('type[]', 'business');
      formData.append('type[]', 'business');
      formData.append('parentpath', 'invoice');
      formData.append('parentpath', 'wmtravelclaimform');*/
      if(typeof onOk === 'function'){
        onOk(obj,type,this.handleCancel)
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

      dis:true,
      fileList: [],
      fileListTicket:[],
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
      loadingChild
    } = this.props;
    const { fileList, fileListTicket} = this.state
    const { visible } = data;
    const { onOk,handleCancel } = on;
    const propsticket = {
      accept:".jpg,.png,.jpeg,.pdf",
      onRemove: file => {
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
      },
      fileList:fileListTicket,
    };
    const props = {
      onRemove: file => {
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
      },
      fileList,
    };
    const annexprops = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {

        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败.`);
        }
      },
    };

    return (
        <Modal
          title={"子表新建"}
          visible={visible}
          width='80%'
          destroyOnClose
          centered
          //onOk={()=>this.onSubmit(onOk)}
          onCancel={()=>this.handleCancel(handleCancel)}
          footer={
            [
              <Button onClick={()=>this.handleCancel(handleCancel)} key={1} >取消</Button>,
              <Button type="primary" key={2} onClick={()=>this.onSubmit(onOk,"再记一笔")}>再记一笔</Button>,
              <Button type="primary" key={3} onClick={()=>this.onSubmit(onOk,"保存")}>保存</Button>,
            ]}
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
                    ]
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
                    rules: [
                      {
                        required: true,
                        message:'请输入报销金额'
                      }
                    ]
                  })(<Input placeholder={"请输入报销金额"} type='number' onChange={this.claimingChange}/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='税率'>
                  {getFieldDecorator('taxrate', {
                  })(<Input placeholder={"选择长途类设置"} style={{width:'100%'}} type='number' disabled={this.state.dis} onChange={this.taxrateChange}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='税金'>
                  {getFieldDecorator('taxamount', {
                  })(<Input addonBefore="CNY" style={{width:'100%'}} type='number' disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='备注'>
                  {getFieldDecorator('memo', {
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

export default TravelChildAdd;

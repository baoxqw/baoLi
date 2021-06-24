import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  DatePicker,
  Divider,
  Button,
  Card,
  Tabs,
  Icon,
  Checkbox,
  Select,
  message,
  Popconfirm,
  Upload,
  Steps,
} from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;
@connect(({ papproval, loading }) => ({
  papproval,
  loading: loading.models.papproval,
}))
@Form.create()
class ApprovalStatues extends PureComponent {
  state = {
    BStatus:false,
    current:0,
    process:[],
    person:'',
  };
  componentWillReceiveProps(nextProps){
    const { dispatch} = this.props
    if(nextProps.data.record !== this.props.data.record){
      console.log('-----审批状态',nextProps.data.record)
      const { record } = nextProps.data
      /* dispatch({
         type:'papproval/fetchdetail',
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
       })*/
    }
  }
  handleOk = (onOk) =>{
    const { form } = this.props;
    const { BStatus } = this.state;
    if(BStatus){
      return
    }

    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      this.setState({
        BStatus:true
      })
      let obj = {
        reqData:{
          code:values.code,
          name:values.name,
        }
      }
      onOk(obj,this.clear)
    })
  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

  clear = ()=> {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data
    } = this.props;
    const { onCancel } = on
    const { visible,record } = data;
    return (
      <Modal
        title="审批状态"
        destroyOnClose
        centered
        visible={visible}
        width={700}
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <Card title="流程进度" bordered={false}>
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
      </Modal>
    );
  }
}

export default ApprovalStatues;

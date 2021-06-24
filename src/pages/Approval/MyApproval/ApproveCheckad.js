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
} from 'antd';
import TreeTable from '../../tool/TreeTable/TreeTable';
import { toTree } from '../../tool/ToTree';
import ModelTable from '../../tool/ModelTable/ModelTable';

const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const { Option } = Select;


const dataAddKey = (data) => {
  return data.map((item) => {
    item.key = item.id;
    if (item.children) {
      dataAddKey(item.children);
    }
    return item;
  });
};

@connect(({ TBL,TL,approval,statustable, loading }) => ({
  TBL,
  TL,
  approval,
  statustable,
  loading: loading.models.TL,
  loadingChild:loading.effects['TBL/childFetch'],
  loadingList:loading.effects['TBL/fetchList'],
}))
@Form.create()
class ApproveCheckad extends PureComponent {
  state = {
    taskId:null,
    opinion:'',
    processInstanceId:null,
    is:0,  //同意还是拒绝
    current:0,
    process:[],
    person:'',
    record:[],
    check:false
  };

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.data.record !== this.props.data.record){
      const { record } = nextProps.data;
      console.log('====record',record)
      this.setState({
        record,
      })
    }
  };

  advice =(data)=>{
    const { dispatch,on,form } = this.props;
    const { onOk,onCancel } = on;
    const { record,check } = this.state;

    form.validateFields((err,values)=>{
      if(err) {
        return
      }

      let status = false;

      if(data === 0){
        if(check){
          return
        }
        this.setState({
          check:true
        })
        record.map((item)=>{
          dispatch({
            type: 'approval/refuse',
            payload:{
              userDefineStrGroup:[item.taskId,values.opinion,item.processInstanceId]
            },
            callback:(res)=>{
              if(res.errCode === '0'){
                if(!status){
                  message.success('已完成');
                }
                status = true;
                //添加消息
                this.addinfo(data)
                this.setState({
                  check:false
                })
                onOk()
              }else{
                onCancel()
                this.setState({
                  check:false
                })
                message.error('提交失败')
              }
            },
          });
        })
      }

      if(data === 1){
        if(check){
          return
        }
        this.setState({
          check:true
        })
        record.map((item)=>{
          dispatch({
            type: 'approval/result',
            payload:{
              userDefineStrGroup:[item.taskId,values.opinion,item.processInstanceId]
            },
            callback:(res)=>{
              if(res.errCode === '0'){
                if(!status){
                  message.success('已完成');
                }
                status = true;
                //添加消息
                this.addinfo(data)
                this.setState({
                  check:false
                })
                onOk()
              }else{
                onCancel()
                this.setState({
                  check:false
                })
                message.error('提交失败');
              }
            },
          });
        })
      }
    })
  }

  addinfo = (type)=>{
    const user = storage.get("userinfo");
    const { dispatch } = this.props;
    const { record } = this.state;
    record.map((item)=>{
      dispatch({
        type:'approval/fetchdetail',
        payload: {
          userDefineStr1:item.processInstanceId
        },
        callback:(res)=>{
          console.log("执行",res)
          if(res && res.resData && res.resData.length){
            let checkId = null;
            res.resData.map((item)=>{
              for(let key in item){
                //发起人
                if(key === 'USERID'){
                  checkId = item[key]
                }
              }
            })
            let c = {
              reqData:{
                checkman:checkId,
                senderman:user.id,
                content:item.billCode?item.billCode:'',
                state:0,
                type:8,
                bussiness_id:Number(item.billId),
                processid:item.processInstanceId,
                corp_id:user.corpId,
                jump:1
              }
            };

            console.log("cccc",c)
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
        }
      })
    })
  }

  aggreeBack = ()=>{
    const { dispatch ,on} = this.props;
    const { onOk,onCancel } = on;
    const { record } = this.state
    record.map((item)=>{
      dispatch({
        type: 'statustable/remove',
        payload:{
          reqData:{
            billid:item.billId?Number(item.billId):null,
            audittype:item.type?item.type:'',
            processinstanceid:item.processInstanceId?item.processInstanceId:'',
          }
        },
        callback:()=>{
          onOk()
        },
      });
    })

  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

  clear = ()=> {
    if(typeof onCancel === 'function'){
      onCancel()
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      deptId:null,//负责部门
      deptName:[],
      departmentTreeValue:[],

      TableData:[],
      SelectValue:[],
      selectedRowKeys:[],
      Sconditions:[],

      TablePersonData:[],
      SelectPersonValue:[],
      selectedRowPersonKeys:[],
      PersonConditions:[],

      record:{}
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      data,
      on
    } = this.props;

    const { record,visible } = data;
    const { onOk,onCancel } = on;
    return (
      <Modal
        title={"批量审批"}
        visible={visible}
        width={'60%'}
        destroyOnClose
        centered
        footer={null}
        //onOk={()=>this.onSave(onOk)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <div>
          <Row gutter={24}>
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
          <div style={{marginLeft:'64px'}}>
            <span>
                <Button type="primary" onClick={()=> this.advice(1)}>同意</Button>
            </span>
            <span style={{marginLeft:14}}>
                <Button style={{backgroundColor:'red',color:'#fff'}} onClick={()=>this.advice(0)}>拒绝</Button>
            </span>
            <span style={{marginLeft:14}}>
                <Button type="primary" onClick={ this.aggreeBack}>退回</Button>
            </span>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ApproveCheckad;

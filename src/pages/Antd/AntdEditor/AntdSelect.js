import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  Checkbox,
  DatePicker,
  Divider ,
  Button,
  Card,
  Tabs,
  Icon,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
const { Option } = Select;

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';


@connect(({  }) => ({

}))
@Form.create()
class AntdSelect extends PureComponent {
  state = {
    key:null,
    arrData:[]
  };

  componentDidMount(){
    const { dispatch } = this.props;
  }

  componentWillReceiveProps(nextProps){
    if((nextProps.data.key !== this.props.data.key) || (nextProps.data.arrData !== this.props.data.arrData)){
      if((nextProps.data.key !== this.props.data.key) || (!nextProps.data.key)){
        const { form } = this.props;
        form.resetFields();
      }
      this.setState({
        key:nextProps.data.key,
        arrData:nextProps.data.arrData
      });
    }
  }

  onSelect = (value,option) =>{
    let { on:{arrDataSelect},data:{arrData} } = this.props;
    let obj = {
      backgroundColor:'',
      label:'label',
      key: null,
      code: Math.round(Math.random() * 10000) + '',
      xl: {},
      required:false,
      placeholder:'',
      style:{},
      type:option.props.children,
      disabled:false
    };
    arrData = [...arrData,obj];
    if(typeof arrDataSelect === 'function'){
      arrDataSelect(value,arrData)
    }
  };

  labelOnBlur = (e,type)=>{
    let { on:{onLabel},data:{arrData,key} } = this.props;
    if(type==='code'){
      let status = false;
      arrData.map(item =>{
        if(item.code === e.target.value){
          status = true
        }
      });
      if(status){
        return message.error("此code已存在,请重新设置",1.2,()=>{
          if(typeof onLabel === 'function'){
            onLabel(arrData)
          }
        })
      }
    }
    if(!e.target.value){
      return message.error("code不能为空",1.2,()=>{
        if(typeof onLabel === 'function'){
          onLabel(arrData)
        }
      })
    }
    arrData[key][type] = e.target.value;
    if(typeof onLabel === 'function'){
      onLabel(arrData)
    }
  };

  onSelectChange = (checkedValue,type)=>{
    let { on:{onLabel},data:{arrData,key} } = this.props;
    arrData[key][type] = checkedValue.target.checked;
    if(typeof onLabel === 'function'){
      onLabel(arrData)
    }
  };

  deleteButton = ()=>{
    let { data:{arrData,arrList,key},on:{arrDataSelect} } = this.props;
    arrData.splice(key,1);
    arrList.splice(key,1);
    if(typeof arrDataSelect === 'function'){
      arrDataSelect(arrList,arrData,'删除');
    }
  };

  Output = (arrData,key)=>{
    const {form: { getFieldDecorator }} = this.props;
    if(key || key === 0){
      if(arrData[key].type === '输入框' || arrData[key].type === '数字输入框' || arrData[key].type === '时间输入框'){
          return <Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="label">
                  {getFieldDecorator('label',{
                    initialValue:key || key === 0?arrData[key]?arrData[key].label:'':''
                  })(
                    <Input placeholder={'请设置lable'} disabled={!(key||key === 0)} onBlur={(e)=>this.labelOnBlur(e,'label')}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="placeholder">
                  {getFieldDecorator('placeholder',{
                    initialValue:key || key === 0?arrData[key]?arrData[key].placeholder:'':''
                  })(
                    <Input disabled={!((key||key === 0) && (arrData[key]?arrData[key].type!== '多选框':false ))} placeholder={'请设置placeholder'} onBlur={(e)=>this.labelOnBlur(e,'placeholder')}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="code">
                  {getFieldDecorator('code',{
                    initialValue:key || key === 0?arrData[key]?arrData[key].code:'':''
                  })(
                    <Input placeholder={'请设置code'} disabled={!(key||key === 0)} onBlur={(e)=>this.labelOnBlur(e,'code')}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="required">
                  {getFieldDecorator('required',{
                    valuePropName: 'checked',
                    initialValue:key || key === 0?arrData[key]?arrData[key].required:'':''
                  })(
                    <Checkbox disabled={!((key||key === 0) && (arrData[key]?arrData[key].type !== '多选框':false))} onChange={(checkedValue)=>this.onSelectChange(checkedValue,'required')}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="disabled">
                  {getFieldDecorator('disabled',{
                    valuePropName: 'checked',
                    initialValue:key || key === 0?arrData[key]?arrData[key].disabled:'':''
                  })(
                    <Checkbox disabled={!((key||key === 0) && (arrData[key]?arrData[key].type !== '多选框':false))} onChange={(checkedValue)=>this.onSelectChange(checkedValue,'disabled')}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item>
                  <Button disabled={!(key||key === 0)} onClick={this.deleteButton}>删除该组件</Button>
                </Form.Item>
              </Col>
            </Row>
          </Row>
      }
      if(arrData[key].type === '多选框'){
          return <Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="label">
                  {getFieldDecorator('label',{
                    initialValue:key || key === 0?arrData[key]?arrData[key].label:'':''
                  })(
                    <Input placeholder={'请设置lable'} disabled={!(key||key === 0)} onBlur={(e)=>this.labelOnBlur(e,'label')}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="code">
                  {getFieldDecorator('code',{
                    initialValue:key || key === 0?arrData[key]?arrData[key].code:'':''
                  })(
                    <Input placeholder={'请设置code'} disabled={!(key||key === 0)} onBlur={(e)=>this.labelOnBlur(e,'code')}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="disabled">
                  {getFieldDecorator('disabled',{
                    valuePropName: 'checked',
                    initialValue:key || key === 0?arrData[key]?arrData[key].disabled:'':''
                  })(
                    <Checkbox  onChange={(checkedValue)=>this.onSelectChange(checkedValue,'disabled')}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item>
                  <Button disabled={!(key||key === 0)} onClick={this.deleteButton}>删除该组件</Button>
                </Form.Item>
              </Col>
            </Row>
          </Row>
      }
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      data:{selectInput}
    } = this.props;

    const { key,arrData } = this.state;

    const option = selectInput.map((item,index)=>{
      return <Option key={index} value={item.components}>{item.title}</Option>
    });




    return (
        <div>
            <div>
              <Form.Item label="选择组件">
                <Select
                  placeholder={'请选择组件'}
                  style={{width:'100%'}}
                  onSelect={this.onSelect}
                >
                  {
                    option
                  }
                </Select>
              </Form.Item>
            </div>
            <Divider >设置属性</Divider>
            <div style={{marginTop:'12px',height:`${!(key || key===0)?'500px':'auto'}`}}>
              {
                this.Output(arrData,key)
              }
            </div>
        </div>
    );
  }
}

export default AntdSelect;

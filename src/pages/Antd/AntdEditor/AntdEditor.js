import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  Tooltip,
  DatePicker,
  Checkbox ,
  Button,
  Card,
  Tabs,
  Icon,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import AntdSelect from '@/pages/Antd/AntdEditor/AntdSelect';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
const { TextArea } = Input;
function slice3(data){
  let result = [];
  for(let i=0;i<data.length;i+=3){
    result.push(data.slice(i,i+3));
  }
  return result
}

@connect(({  }) => ({

}))
@Form.create()
class AntdEditor extends PureComponent {
  state = {
    data:{},
    arrList:[],
    arrData:[],
    key:null,
  };

  componentDidMount(){
    const { dispatch } = this.props;
  }

  onSelect = (value) =>{
    this.setState({
      arrData:[
        ...this.state.arrData,
        value
      ]
    })
  };

  onBackgroundColor = (key)=>{
    console.log("key",key)
    let {  arrData } = this.state;
    let status = false
    arrData = arrData.map((item,index)=>{
      if(key === index){
        if(item.backgroundColor === '#e6f7ff'){
          item.backgroundColor = '';
          status = true
        }else{
          item.backgroundColor = '#e6f7ff';
        }
      }else{
        item.backgroundColor = '';
      }
      return item
    });
    if(status){
      this.setState({
        key:null,
        arrData
      });
      return
    }
    this.setState({
      key,
      arrData
    })
  }

  onSave = ()=>{
    const { arrList,arrData } = this.state;
    console.log("arrData",arrData);
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    let { arrList,arrData } = this.state;
    if(arrList.length){
      arrList = arrList.map((item,index)=>{
        return item(arrData[index])
      });
      const sliceList = slice3(arrList);
      console.log("sliceList",sliceList)
      if(arrList.length){
        arrList = sliceList.map( (item,index) =>{
          return <Row key={index} gutter={16}>
            {item.map((it)=>{
              return it
            })}
          </Row>
        });
      }
      console.log("arrList2",arrList)
    }

    const data = {
      selectInput:[
        {
          title:'输入框',
          components:({label='label',disabled,key,code=Math.round(Math.random()*10000)+'',xl={},required=false,placeholder,style,backgroundColor})=><Col  key={key} xl={xl} lg={6} md={12} sm={24}>
            <Form.Item label={label} style={{backgroundColor,padding:5,borderRadius:3}} onClick={()=>this.onBackgroundColor(key)}>
              {getFieldDecorator(code,{
                rules: [{required}]
              })(<Input placeholder={placeholder} style={style}  disabled={disabled}/>)}
            </Form.Item>
          </Col>
        },
        {
          title:'数字输入框',
          components:({label='label',disabled,key,backgroundColor,code=Math.round(Math.random()*10000)+'',xl={},required=false,placeholder,style})=><Col  key={key} xl={xl} lg={6} md={12} sm={24}>
            <Form.Item label={label} style={{backgroundColor,padding:5,borderRadius:3}} onClick={()=>this.onBackgroundColor(key)}>
              {getFieldDecorator(code,{
                rules: [{required}]
              })(<Input placeholder={placeholder} type={'Number'} style={style} disabled={disabled}/>)}
            </Form.Item>
          </Col>
        },
        {
          title:'时间输入框',
          components:({label='label',disabled,key,backgroundColor,code=Math.round(Math.random()*10000)+'',xl={},required=false,placeholder,style})=><Col key={key} xl={xl} lg={6} md={12} sm={24}>
            <Form.Item label={label} style={{backgroundColor,padding:5,borderRadius:3}} onClick={()=>this.onBackgroundColor(key)}>
              {getFieldDecorator(code,{
                rules: [{required}]
              })(<DatePicker placeholder={placeholder} style={{width:'100%',...style}} disabled={disabled}/>)}
            </Form.Item>
          </Col>
        },
        {
          title:'多选框',
          components:({label='label',disabled,key,backgroundColor,code=Math.round(Math.random()*10000)+'',xl={},required=false,placeholder,style})=><Col key={key} xl={xl} lg={6} md={12} sm={24}>
            <Form.Item label={label} style={{backgroundColor,padding:5,borderRadius:3}} onClick={()=>this.onBackgroundColor(key)}>
              {getFieldDecorator(code,{
                valuePropName: 'checked',
              })(<Checkbox disabled={disabled}/>)}
            </Form.Item>
          </Col>
        },
      ],
      arrData: this.state.arrData,
      arrList: this.state.arrList,
      key:this.state.key
    };
    const on = {
      arrDataSelect:(value,arrData,type)=>{
       /* let { arrList } = this.state;
        arrList = [...arrList,value];
        let arr = [];
        let arr2 = [];
        arrData.map((item,index) =>{
          if(item.type === '文本区域框'){
            arr = [...arr,item];
            arr2 = [...arr2,arrList[index]];
            arrData.splice(index,1);
            arrList.splice(index,1);
          }
        });
        arrData = [...arrData,...arr];
        arrList = [...arrList,...arr2];
        console.log("arrList",arrList)
        console.log("arrData",arrData)*/
        arrData = arrData.map((item,index)=>{
          item.key = index;
          if(index%3===0){
            item.xl = {};
            return item
          }else {
            item.xl = {offset: 2};
            return item
          }
        });
        if(type === '删除'){
          this.setState({
            arrList:value,
            arrData,
            key:null
          });
          return
        }
        this.setState({
          arrList:[
            ...this.state.arrList,
            value
          ],
          arrData
        })
      },
      onLabel:(arrData)=>{
        console.log("arrData",arrData)
        this.setState({
          arrData:[...arrData]
        })
      },
    };

    return (
      <PageHeaderWrapper>
          <div style={{display:'flex',width:'100%'}}>
            <Card style={{width:'68%'}}>
              {
                arrList
              }
            </Card>
            <Card style={{width:'30%',marginLeft:'2%'}}>
              <AntdSelect on={on} data={data}/>
            </Card>
            <FooterToolbar>
              <Button type="primary"  onClick={this.onSave}>
                保存
              </Button>
              <Button

              >取消</Button>
            </FooterToolbar>
          </div>
      </PageHeaderWrapper>
    );
  }
}

export default AntdEditor;

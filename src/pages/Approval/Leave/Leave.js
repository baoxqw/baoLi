import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import React, { PureComponent, useState } from 'react';
import { Steps, Form, Button, Input, Row, Col, Select, Transfer, Icon, message, Card,DatePicker  } from 'antd';
import { connect } from 'dva';
import TransferSort from './TransferSort';
import { formatMessage, FormattedMessage } from 'umi/locale';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
// 顶部步骤条
const StepsBar = props => {
  // const steps = ['填写申请信息', '选择审批人员', '完成'];
  const steps = [formatMessage({id:'valid.application.information'}),
    formatMessage({id:'valid.Select.approver'}),
    formatMessage({id:'valid.complete'})];
  const { current } = props;

  return (
    <Row className="mg-v">
      <Col span={18} offset={3}>
        <Steps current={current} labelPlacement="vertical">
          {steps.map((item,index) => (
            <Step key={index} title={item} />
          ))}
        </Steps>
      </Col>
    </Row>
  );
};

// 第一步申请表格
const ApplyForm = Form.create()(({ onNext, form }) => {
  const { getFieldDecorator } = form;
  function onOk(value) {
    const starttime = value[0].format('YYYY-MM-DD HH:mm')
    const endtime = value[1].format('YYYY-MM-DD HH:mm')

  }
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  const fields = [
    {
      label: '所属项目',
      name: 'project',
      rules: [
        {
          required: true,
          message: '选择所属项目',
        },
      ],
      render: (
        <Select placeholder='请选择项目'  onChange={handleChange}>
          <Option value="1">项目1</Option>
          <Option value="2">项目2</Option>
        </Select>
      ),
    },
    {
      // label: '单据号',
      label:formatMessage({id:'valid.Document'}),
      placeholder: formatMessage({id:'valid.Document'}),
      name: 'billcode',
      rules: [
        {
          required: true,
          message: formatMessage({id:'valid.Document'}),
        },
      ],
    },
    {
      // label: '报销类型',
      label:formatMessage({id:'valid.expense'}),
      placeholder: formatMessage({id:'valid.expense'}),
      name: 'billtype',
      rules: [
        {
          required: true,
          message:formatMessage({id:'valid.expense'}),

        },
      ],
    },
    {
      // label: '请假天数',
      label:formatMessage({id:'valid.Leave.days'}),
      placeholder: formatMessage({id:'valid.Leave.days'}),
      name: 'days',
      rules: [
        {
          required: true,
          message: formatMessage({id:'valid.Leave.days'}),
        },
      ],
    },
    {
      // label: '时间范围',
      label:formatMessage({id:'valid.Time.range'}),
      placeholder:formatMessage({id:'valid.Time.range'}),
      name: 'time',
      rules: [
        {
          required: true,
          message:formatMessage({id:'valid.Time.range'}),

        },
      ],
      render: <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm"  onOk={onOk}/>
    },
  ];

  function handleSubmit(e) {
    e.preventDefault();
    form.validateFields((err, values) => {
      if(err){
        return
      }else{
        onNext(1, values);
      }
      /*onNext(1, values);*/
    });
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const renderFormItemList = (data, formItemProps) => {
    const list = data.map(({ label, render, rules, placeholder, name },index) => {
      let content = render || <Input placeholder={placeholder} />;
      content = getFieldDecorator(name, { rules })(content);

      return (
        <FormItem label={label} key={index} {...formItemProps}>
          {content}
        </FormItem>
      );
    });

    return list;
  };

  return (
    <Form onSubmit={handleSubmit}>
      {renderFormItemList(fields, formItemLayout)}
      <Row>
        <Col offset={4}>
          <Button type="primary" htmlType="submit">
            {/*下一步*/}
            {formatMessage({id:'valid.next'})}
          </Button>
        </Col>
      </Row>
    </Form>
  );
});

// 第二步 选择审批人员
const SelectPerson = ({ data, onNext }) => {
  if (!data) return null;

  const [selectedKeys, setSelectedKeys] = useState([]);
  let arr = [];
  // 下一步
  const toNext = () => {
    // console.log('selectedKeys', selectedKeys);
    if (!selectedKeys.length || !data.length) return message.error('请选择审批人员');

    for(let i=0;i<data.length;i++){
      for(let j=0;j<selectedKeys.length;j++){
        if(data[i].id === selectedKeys[j]){
          arr.push({
            id:data[i].id,
            name:data[i].name
          });
          break
        }
      }
    }

    const nextData = {
      auditors: arr,
    };
    return onNext(1, nextData);
  };

  const transferData = data.map(item => ({
    key: item.id,
    title: item.name,
  }));

  const transferProps = {
    dataSource: transferData,
    operations: ['加入右侧', '加入左侧'],
    render: item => item.title,
    targetKeys: selectedKeys,
    onChange: selected => setSelectedKeys(selected)
  };

  return (
    <div>
      <Row className="mg-b">
        <Col span={24} offset={2}>
          <Transfer {...transferProps} />
        </Col>
      </Row>

      <Row type="flex" justify="center">
        <Col>
          <Button onClick={() => onNext(-1)} className="mg-r">
            上一步
          </Button>
          <Button type="primary" onClick={toNext}>
            下一步
          </Button>
        </Col>
      </Row>
    </div>
  );
};

// 申请成功界面
const Complete = ({ onNext }) => {
  return (
    <div className="flex flex-column flex-v-center">
      <Icon
        type="check-circle"
        theme="filled"
        style={{ color: '#24cb24', fontSize: '60px', marginBottom: '20px' }}
      />
      <div className="mg-b text-center">
        <h3>操作成功</h3>
        <div>等待人员审核</div>
      </div>
      <Button type="primary" onClick={() => onNext(-2)}>
        返回
      </Button>
    </div>
  );
};

@connect(({ leave, loading }) => ({
  leave,
  loading: loading.models.leave,
}))
@Form.create()
class Leave extends PureComponent {
  resultInfo = {};

  state = {
    current: 0,
    dataList:[]
  };

  componentDidMount() {

  }

  toNextStep = async (step, data) => {
    // 合并每一步需要提交数据
    if (data) {
      this.resultInfo = { ...this.resultInfo, ...data };
    }
    const obj = {
      ...this.resultInfo,
      days:Number(this.resultInfo['days']),
      starttime:this.resultInfo.time[0].format('YYYY-MM-DD HH:mm'),
      endtime:this.resultInfo.time[1].format('YYYY-MM-DD HH:mm'),
      audittype:'请假'
    }
    const { current } = this.state;
    const nextStep = current + (typeof step === 'number' ? step : 1);
    const { dispatch } = this.props;
    if(nextStep === 1){
      dispatch({
        type:'leave/fetch',
        payload: {
          pageSize:1000,
        },
        callback:(res)=>{
          if(res){
            this.setState({
              dataList:res
            })
          }
        }
      })
    }
    // 下一步为完成页面则提交数据
    if (nextStep === 2) {

      const payload = {
        reqData: obj
        ,
      };
      dispatch({
        type: 'leave/submitLeave',
        payload,
        callback:(res)=>{
          if(res.errCode !== '0'){
            return message.error('提交失败');
          }
        }
      });
      // if (errMsg) return;
    }

    // 切换下一步
    this.setState({
      current: nextStep,
    });
  };

  toNext = (count,nextData,data)=>{
    console.log(nextData)
    if (!nextData) return message.error('请选择审批人员');
    let arr = [];
    for(let i=0;i<nextData.length;i++){
      for(let j=0;j<data.length;j++){
        if(nextData[i] === data[j].key){
          arr.push({
            id:data[j].id,
            name:data[j].name
          });
          break
        }
      }
    }
    console.log("最终的",arr);
    const next = {
      auditors: arr,
    };
    return this.toNextStep(1, next);
  }

  render() {
    const {
      state: { current,dataList },
    } = this;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Row>
            <Col span={12} offset={6}>
              <StepsBar current={current} />
              {
                [
                  <ApplyForm onNext={this.toNextStep} />,
                  <TransferSort onNext={this.toNextStep} toNext={this.toNext} />,
                  <Complete onNext={this.toNextStep} />,
                ][current]
              }
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Leave;

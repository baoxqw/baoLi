import React, { PureComponent } from 'react';
import { Input, Button, Form, Card, Icon } from 'antd';
import logo from '@/assets/logo2.png';
import whiteLogo from '@/assets/logo1.png';
import backgroundImg from '@/assets/login_background.png';
import { connect } from 'dva';
import styles from './login.less';
import DocumentTitle from 'react-document-title';
// 登录面板组件
function LoginCard({ onSubmit, form, ...props }) {
  const LogoHeader = (
    <div >

    </div>
  );
  const cardStyle = {
    width: '350px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,.8)',
  };
  function handleSubmit(e) {
    e.preventDefault();

    form.validateFields((err, values) => {
      if (err) return;
      onSubmit({
        reqData:{
          ...values
        }
      });
    });
  }
  const { getFieldDecorator } = form;

  return (
    <Card style={cardStyle} cover={LogoHeader} bordered={false} {...props}>
      <Form onSubmit={handleSubmit}>
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(<Input placeholder="请输入用户名" prefix={<Icon type="user" />} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('passWord', {
            rules: [{ required: true, message: '请输入密码' }],
          })(<Input type="password" placeholder="请输入密码" prefix={<Icon type="lock" />} />)}
        </Form.Item>
        <Form.Item>
          <Button block htmlType="submit" type="primary">
            登录
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

// 包裹表单验证
const WrappedLoginCard = Form.create('login_form')(LoginCard);

// 侧边 login 文字条组件
function SideBanner({ className }) {
  return (
    <div >
      <div style={{ marginBottom: '14px' }}>

      </div>

    </div>
  );
}

@connect(({ loading }) => ({
  submitting: loading.effects['login/login'],
}))
class Login extends PureComponent {
  state = {};

  handleSubmit = payload => {

    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload,
    });
  };

  render() {
    return (
      <DocumentTitle title="">
        <div className={styles.login} style={{ background: `url(${backgroundImg}) 0/100% 58% no-repeat`,backgroundPosition:'left top',backgroundColor:'#eeeeee' }}>
            <WrappedLoginCard className={styles.loginCardPosition} onSubmit={this.handleSubmit} />
            <SideBanner className={styles.sideBannerPosition}/>
        </div>
      </DocumentTitle>

    );
  }
}

export default Login;

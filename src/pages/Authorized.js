import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';
import { roles } from '@/../config/routesAuthority.config';
import storage from '@/utils/storage'

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

// 根据权限跳转首页
const IndexPage = ({ children, location }) => {
  const userinfo = storage.get("userinfo");
  if(!userinfo){
    return <Redirect to='/user/login' />;
  }

  console.log('location:',location)
  if (location.pathname === '/') {
    let indexPage = '/credit/list'; // 默认管理员统计页面
    // 查看角色是否配置 index, 并且设置 index 页面
    getAuthority().forEach(item => {
      console.log('item:00000:',item);
      if(item === 'admin'){
        indexPage =  '/organ/list'
      }else if(item === 'creditQuery'){
        indexPage =  '/credit/list'
      }else if(item === 'creditAudit'){
        indexPage =  '/credit/list'
      }else if(item === 'loanQuery'){
        indexPage =  '/loan/list'
      }else if(item === 'loanAudit'){
        indexPage =  '/loan/list'
      }else if(item === 'dataSync'){
        indexPage =  '/information/list'
      }else{
        indexPage =  '/organ/list'
      }
    });
    return <Redirect to={indexPage} />;
  }
  return children;

  // if (location.pathname === '/') {
  //     Authority.find
  //   return getAuthority().includes('admin') ? (
  //     <Redirect to="/credit" />
  //   ) : (
  //     <Redirect to="/account/center" />
  //   );
  // }
  // return children;
};

export default ({ children, ...props }) => (
  <Authorized authority={children.props.route.authority} noMatch={<Redirect to="/user/login" />}>
    <IndexPage {...props}>{children}</IndexPage>
  </Authorized>
);

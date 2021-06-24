import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Avatar, List, Form, Modal, Input, message,Tabs,Badge} from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';
import { connect } from 'dva';
import storage from '@/utils/storage'
import router from 'umi/router';
import Phone from '@/components/GlobalHeader/Phone';

const FormItem = Form.Item;
const { TabPane } = Tabs;

function changestate(data=[]) {
  if(!data || !data.length){
    return
  }
  data.map((item)=>{
    if(item.state === 1){
      item.read = true;
    }
  })
}

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleModalVisible, ax,} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if(fieldsValue.passWord === fieldsValue.passWord2){
        const obj = {
          reqData:{
            passWord:fieldsValue.passWord
          }
        };
        ax.dispatch({
          type:'upuser/update',
          payload: obj,
          callback:(res)=>{
            if(res.errCode === 200){
              message.success('修改成功',1.2,()=>{
                form.resetFields();
                handleModalVisible();
              });
            }else{
              message.success(`${res.errMsg}`);
            }
          }
        });
      }else{
        message.error("密码不一致")
      }
    });
  };
  return (
    <Modal
      destroyOnClose
      title='修改密码'
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='新密码'>
        {form.getFieldDecorator('passWord', {
          rules: [{ required: 'true' }],
        })(<Input autoComplete='new-password' placeholder={"请输入密码"} type='password'/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='确认密码'>
        {form.getFieldDecorator('passWord2', {
          rules: [{ required: 'true' }],
        })(<Input placeholder={"请再次输入密码"} type='password'/>)}
      </FormItem>
    </Modal>
  );
});

@connect(({ upuser, user,loading }) => ({
  upuser,
  ...user,
  loading: loading.models.upuser

}))

@Form.create()
export default class GlobalHeaderRight extends PureComponent {

  state = {
    modalVisible: false,
    personState:false,
    personCode:'',
    popupVisible:false,
    editVisible:false,
    userInfo:{}
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const userinfo = storage.get("userinfo");
    //const person = userinfo.code;
    //pm  登陆才会显示消息提醒
    /*if(person){
      this.setState({
        personState:true,
        personCode:person
      })
    }
    for(let i=1;i<10;i++){
      const payload = {
        pageSize:100000,
        pageIndex:0,
        reqData: {
          type: i
        },
      };
      dispatch({
        type: 'user/fetchUserTaskMsg',
        payload,
      });
    }
*/
    this.setState({
      userInfo:userinfo
    })
  }

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  /*  1：合同审核
  *   2：合同变更审核
  *   3：立项审核
  *   4：立项变更审核
  *   5：项目里程碑审核
  *   6：营销里程碑审核
  *   7：结项审核
  *   8：报销单审核
  *   9: 差旅费审核
  * */
  changeReadState = clickedItem => {
    const { id,type,bussiness_id,processid,state,jump } = clickedItem;
    console.log("clickedItem",clickedItem)
    const { dispatch } = this.props;
    switch (type) {
      case 1:
        dispatch({
          type: 'user/marked',
          payload: {
            type,
            id,
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              if(jump === 1) {
                router.push("/agreemanagement/contact/list", { id: bussiness_id });
              }else{
                router.push("/agreemanagement/approve/agree",{record:{id:bussiness_id,processInstanceId:processid}});
              }
            }
          }
        });
        break;
      case 2:
        dispatch({
          type: 'user/marked',
          payload: {
            type,
            id,
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              if(jump === 1){
                router.push("/agreemanagement/contact/list",{id:bussiness_id});
              }
              router.push("/agreemanagement/changeapprove/changeagree",{record:{id:bussiness_id,processInstanceId:processid}});
            }
          }
        });
        break;
      case 3:
        dispatch({
          type: 'user/marked',
          payload: {
            type,
            id,
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              if(jump === 1){
                return router.push("/ecprojectmanagement/projectapproval/list",{id:bussiness_id});
              }
              return router.push("/ecprojectmanagement/projectverify/query",{record:{id:bussiness_id,processInstanceId:processid}});
            }
          }
        });
        break;
      case 4:
        dispatch({
          type: 'user/marked',
          payload: {
            type,
            id,
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              if(jump === 1){
                return router.push("/ecprojectmanagement/projectchange/list",{id:bussiness_id});
              }
              return router.push("/ecprojectmanagement/changeprojectverify/query",{record:{id:bussiness_id,processInstanceId:processid}});
            }
          }
        });
        break;
      case 5:
        dispatch({
          type: 'user/marked',
          payload: {
            type,
            id,
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              if(jump === 1){
                return router.push("/ecprojectmanagement/processmanege/list",{id:bussiness_id});
              }
              return router.push("/ecprojectmanagement/milestonereview/agree",{record:{id:bussiness_id,processInstanceId:processid}});
            }
          }
        });
        break;
      case 6:
        dispatch({
          type: 'user/marked',
          payload: {
            type,
            id,
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              if(jump === 1){
                return router.push("/ecprojectmanagement/processmanege/list",{id:bussiness_id});
              }
              return router.push("/ecprojectmanagement/marketingmilestone/agree",{record:{id:bussiness_id,processInstanceId:processid}});
            }
          }
        });
        break;
      case 7:
        dispatch({
          type: 'user/marked',
          payload: {
            type,
            id,
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              if(jump === 1){
                return router.push("/ecprojectmanagement/processmanege/list",{id:bussiness_id});
              }
              return router.push("/ecprojectmanagement/concludingAudit/agree",{record:{id:bussiness_id,processInstanceId:processid}});
            }
          }
        });
        break;
      case 8:
        dispatch({
          type: 'user/marked',
          payload: {
            type,
            id,
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              if(jump === 1){
                return router.push("/approval/reimbursementform/list",{id:bussiness_id});
              }
              return router.push("/approval/myapproval/approvalcheck",{record:{billId:bussiness_id,processInstanceId:processid}});
            }
          }
        });
        break;
      case 9:
        dispatch({
          type: 'user/marked',
          payload: {
            type,
            id,
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              if(jump === 1){
                return router.push("/approval/travel/list",{id:bussiness_id});
              }
              return router.push("/approval/travelbusiness/check",{record:{billId:bussiness_id,processInstanceId:processid}});
            }
          }
        });
        break;
    }
    this.setState({
      popupVisible:false
    })
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  onNoticeVisibleChange = (visible)=>{
    this.setState({
      popupVisible:visible
    })
  };

  phoneModalVisible = ()=>{
    const { dispatch } = this.props;
    const { userInfo } = this.state;
    dispatch({
      type:'user/queryUserById',
      payload:{
        reqData:{
          id:userInfo.id
        }
      },
      callback:(res)=>{
        if(res && res.resData && res.resData.length){
          this.setState({
            phone:res.resData[0].phone,
            editVisible:true
          })
        }else{
          message.error("未绑定手机号，无法修改")
        }
      }
    });
  }

  render() {
    const {
      currentUser,
      fetchingNotices,
      //onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
      userTaskMsg1,
      userTaskMsg2,
      userTaskMsg3,
      userTaskMsg4,
      userTaskMsg5,
      userTaskMsg6,
      userTaskMsg7,
      userTaskMsg8,
      userTaskMsg9,
      avatar,
    } = this.props;
    const { personState,modalVisible,editVisible,phone } = this.state;

    if(personState){
      changestate(userTaskMsg1.data)
      changestate(userTaskMsg2.data)
      changestate(userTaskMsg3.data)
      changestate(userTaskMsg4.data)
      changestate(userTaskMsg5.data)
      changestate(userTaskMsg6.data)
      changestate(userTaskMsg7.data)
      changestate(userTaskMsg8.data)
      changestate(userTaskMsg9.data)
    }

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item onClick={() => this.handleModalVisible(true)}  key='user'>
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        {/*<Menu.Item key="PhoneOutlined" onClick={ this.phoneModalVisible} >
          <Icon type="phone" />
          <FormattedMessage id="menu.account.phone" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          <FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />
        </Menu.Item>
        <Menu.Divider />*/}
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }


    const phoneData = {
      visible:editVisible,
      record:{
        phone
      }
    };
    const onPhone = {
      onOk:(res,clear)=>{
        console.log("res",res)
        const { dispatch } = this.props;
        dispatch({
          type:'user/setPhone',
          payload:{
            reqData:{
              ...res,
            }
          },
          callback:(res)=>{
            console.log("res",res)
            if(res.errMsg === '成功'){
              message.success("编辑成功",1,()=>{
                clear();
                this.setState({
                  editVisible:false
                })
              })
            }else{
              clear(1);
              message.error("编辑失败")
            }
          }
        });
      },
      handleCancel:(clear)=>{
        clear();
        this.setState({
          editVisible:false,
        })
      }
    };

    return (
      <div className={className}>
        {/*<HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder={formatMessage({ id: 'component.globalHeader.search' })}
          dataSource={[
            formatMessage({ id: 'component.globalHeader.search.example1' }),
            formatMessage({ id: 'component.globalHeader.search.example2' }),
            formatMessage({ id: 'component.globalHeader.search.example3' }),
          ]}
          onSearch={value => {
            console.log('input', value); // eslint-disable-line
          }}
          onPressEnter={value => {
            console.log('enter', value); // eslint-disable-line
          }}
        />*/}

        {personState?<NoticeIcon
          className={styles.action}
          count={
            userTaskMsg1.unreadCount + userTaskMsg2.unreadCount+ userTaskMsg3.unreadCount+ userTaskMsg4.unreadCount
            + userTaskMsg5.unreadCount+ userTaskMsg6.unreadCount+ userTaskMsg7.unreadCount+ userTaskMsg8.unreadCount+ userTaskMsg9.unreadCount
          }
          onItemClick={(item, tabProps) => {

            this.changeReadState(item, tabProps);
          }} //标记消息已读
          locale={{
            emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),

          }}
          //onClear={onNoticeClear} //点击清空时的回调
          onPopupVisibleChange={this.onNoticeVisibleChange}
          popupVisible={this.state.popupVisible}
          loading={fetchingNotices}
        >
          <NoticeIcon.Tab
            count={userTaskMsg1.unreadCount}
            list={userTaskMsg1.data}
            title='合同审核'
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            showClear={false}
          />
          <NoticeIcon.Tab
            count={userTaskMsg2.unreadCount}
            list={userTaskMsg2.data}
            title='合同变更审核'
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            showClear={false}
          />
          <NoticeIcon.Tab
            // count={unreadMsg.notification}
            count={userTaskMsg3.unreadCount}
            list={userTaskMsg3.data}
            title='立项审核'
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            showClear={false}
          />
          <NoticeIcon.Tab
            count={userTaskMsg4.unreadCount}
            list={userTaskMsg4.data}
            title='立项变更审核'
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            showClear={false}
          />
          <NoticeIcon.Tab
            count={userTaskMsg5.unreadCount}
            list={userTaskMsg5.data}
            title='项目里程碑'
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            showClear={false}
          />
          <NoticeIcon.Tab
            count={userTaskMsg6.unreadCount}
            list={userTaskMsg6.data}
            title='营销里程碑'
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            showClear={false}
          />
          <NoticeIcon.Tab
            count={userTaskMsg7.unreadCount}
            list={userTaskMsg7.data}
            title='结项审核'
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            showClear={false}
          />
          <NoticeIcon.Tab
            count={userTaskMsg8.unreadCount}
            list={userTaskMsg8.data}
            title='报销单审核'
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            showClear={false}
          />
          <NoticeIcon.Tab
            count={userTaskMsg9.unreadCount}
            list={userTaskMsg9.data}
            title='差旅费审核'
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            showClear={false}
          />
        </NoticeIcon>:''}
        {this.state.userInfo.userName ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              {/*<Avatar size="small" className={styles.avatar}   alt="avatar" />*/}
              <span className={styles.name}>{this.state.userInfo.userName}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        <SelectLang className={styles.action} />
        <CreateForm  {...parentMethods} modalVisible={modalVisible}  ax={this.props}/>

        {/*<Phone on={onPhone} data={phoneData}/>*/}

      </div>
    );
  }
}

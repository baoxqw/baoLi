import React, { PureComponent, useState } from 'react';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import {
  Card,
  Tabs,
  Divider,
  Button,
  Avatar,
  Calendar,
  Badge,
  Icon,
  Row,
  Col,
  Modal,
  List,
  TreeSelect,
  Empty,
} from 'antd';
import { Bar } from '@/components/Charts';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import storage from '@/utils/storage'
import Context from '@/layouts/MenuContext';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
const themeColor = '#F5222D';
const { TabPane } = Tabs;
// 标题图标面板
const IconCard = ({ children, type, title }) => {
  const cardTitle = (
    <Row>
      <Icon type={type} style={{ color: '#F5222D', marginRight: '10px' }} />
      <Col>{title}</Col>
    </Row>
  );

  return (
    <Card title={cardTitle} className="mg-b">
      {children}
    </Card>
  );
};
// 项目柱状图面板
const ProjectBarCard = props => {
  const { data, onChange } = props;
  return (
    <Card>
      <Tabs onChange={onChange}>
        {data.map((item, index) => (
          <TabPane tab={item.name} key={String(index)}>
            {item.data.length ? (
              <Bar
                height={300}
                data={item.data.map(({ name, count }) => ({ x: name, y: count }))}
              />
            ) : (
              <Empty />
            )}
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
};

// 数据排名
const Ranking = ({ info: { data, name } }) => {
  return (
    <Card title={name}>
      {data.length ? (
        data
          .sort((a, b) => b.count - a.count)
          .map((item, index) => (
            <div className="flex flex-between" >
              <div className="mg-b" style={{display:'flex',alignItems:'center'}}>
                <CircleNum num={index + 1} style={{ marginRight: '10px' }} />
                <span>{item.name}</span>
              </div>
              <div>{item.count}</div>
            </div>
          ))
      ) : (
        <Empty />
      )}
    </Card>
  );
};

// 圆形数字标识
const CircleNum = ({ num, style, className, size = 20 }) => {
  const circleStyle = {
    backgroundColor: themeColor,
    color: '#fff',
    borderRadius: '50%',
    display: 'inline-flex',
    width: `${size}px`,
    height: `${size}px`,
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <Row style={{ ...circleStyle, ...style }} className={className}>
      <Col>{num}</Col>
    </Row>
  );
};
@connect(({ user, menu ,projectDashboard: { dashboardData }}) => ({
  ...user,
  dashboardData,
  ...menu,
}))
class ManagerCenter extends PureComponent {
  state = {
    // navigations: ['财务审批', '财务审批', '财务审批', '财务审批', '财务审批', '财务审批'],
    navigations: [],
    selectpath:[],
    selectname:[],
    selectedKey: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const userinfo = storage.get("userinfo")
    const userid = userinfo.id;
    /*  const aaa = da.map((item)=>{
        return {
          name: item.name,
          path: item.url
        }
      })*/
    dispatch({
      type: 'projectDashboard/fetchProjectDashboard',
    });
    dispatch({
      type:'user/userFetchFind',
      payload:{id:userid},
      callback:(res)=>{
        if(res.resData){
          this.setState({
            navigations:res.resData
          })
        }
      }
    })
    // 获取进行中项目
    dispatch({
      type: 'user/fetchUserDashboard',
    });
    // 获取日程
    this.fetchUserSchedule();
    // 获取消息
    this.fetchTaskMsg();
    this.fetchAfterInvestMsg();
  }

  // 获取投后信息列表
  fetchAfterInvestMsg = (pageIndex = 0) => {
    const { dispatch } = this.props;
    const payload = {
      pageSize: 10,
      pageIndex,
      reqData: {
        type: 2,
      },
    };
    dispatch({
      type: 'user/fetchUserAfterInvestMsg',
      payload,
    });
  };

  // 获取任务信息列表
  fetchTaskMsg = (pageIndex = 0) => {
    const { dispatch } = this.props;
    const payload = {
      pageSize: 10,
      pageIndex,
      reqData: {
        type: 1,
      },
    };
    dispatch({
      type: 'user/fetchUserTaskMsg',
      payload,
    });
  };

  fetchUserSchedule = (date = moment()) => {
    const { dispatch } = this.props;
    const payload = {
      reqData: {
        year: date.format('YYYY'),
        month: date.format('MM'),
      },
    };
    dispatch({
      type: 'user/fetchUserSchedule',
      payload,

    });
  };

  toProject = (record) => {
    if(record.project_status == '初始状态'){
      record.project_status = 'INITIAL'
    }else if(record.project_status == '完善项目信息'){
      record.project_status = 'FILL'
    }else if(record.project_status == '投决会'){
      record.project_status = 'ICM'
    }else if(record.project_status == '项目决策'){
      record.project_status = 'ID'
    }else if(record.project_status == '确定投资计划'){
      record.project_status = 'CIP'
    }else if(record.project_status == '投后管理'){
      record.project_status = 'POST'
    }
    this.props.history.push("/projectmanagement/ongoingproject/checklist", {
      query: record
    });
  }
  handleBarChange = key => {
    const { selectedKey } = this.state;
    if (key === selectedKey) return;
    this.setState({
      selectedKey: key,
    });
  };
  changedata=(navigations,selectname,selectpath)=>{
    console.log('navigations333',navigations)
    console.log('selectname333',selectname)
    console.log('selectpath333',selectpath)
    const { dispatch } = this.props;
    dispatch({
      type:'user/menuData',
      payload:{
        reqDataList:[
          ...navigations
        ]
      },
      callback:(res)=>{
        let arr =[];
        for (let i = 0;i<navigations.length;i++){
          arr.push({
            name:navigations[i].name,
            url:navigations[i].path,
          })
        }
        this.setState({
          navigations:arr,
          selectname,
          selectpath,
        })
      }
    })
  }

  render() {
    const { navigations,selectname,selectpath,value,selectedKey } = this.state;
    const { userDashboard, userSchedule } = this.props;
    const { dashboardData } = this.props;
    if (!dashboardData) return null;
    const { roi, invest, fundnet, projectCount } = dashboardData;
    const statisticsChart = [
      {
        // name: '项目ROI',
        name: formatMessage({ id: 'validation.project.ROI' }),
        data: roi.statistics,
      },
      {
        //name: '投资金额',
        name: formatMessage({ id: 'validation.Investment.amount' }),
        data: invest.investInStatistics,
      },
      {
        //name: '退出金额',
        name: formatMessage({ id: 'valid.exit.amount' }),
        data: invest.investOutStatistics,
      },
    ];
    const upOrDown = number => (
      <>
        <span>{number}% </span>
        {number !== 0 && (
          <span style={{ color: number > 0 ? 'lightgreen' : 'red' }}>{number > 0 ? '▲' : '▼'}</span>
        )}
      </>
    );
    return (
      <React.Fragment>
        <StatisticCard {...this.props} />
        <Row gutter="32">
          <Col span="8">
            {/*项目数量*/}
            <IconCard type="pay-circle" title={formatMessage({ id: 'valid.project.amount' })}>
              <h3>{projectCount}</h3>
            </IconCard>
          </Col>
          <Col span="8">
            {/*总投资数*/}
            <IconCard type="pay-circle" title={formatMessage({ id: 'valid.investment.amount' })}>
              <h3>￥{numeral(invest.amount).format('0,0')}</h3>
            </IconCard>
          </Col>
          <Col span="8">
            {/*基金总净值*/}
            <IconCard type="pay-circle" title='总合同数'>
              <h3>{numeral(fundnet).format('0,0')}</h3>
            </IconCard>
          </Col>
          {/*          <Col span="6">
            平均ROI
            <IconCard type="pay-circle" title={formatMessage({ id: 'valid.average.ROI' })}>
              <h3>{roi.average}%</h3>
              <div>
                周环比
                <san>周环比{upOrDown(roi.week)}</san>
                <san style={{ margin: '0 2px' }}>|</san>
                日环比
                <san>日环比 {upOrDown(roi.day)}</san>
              </div>
            </IconCard>
          </Col>*/}
          <Col span="17">
            <ProjectBarCard data={statisticsChart} onChange={this.handleBarChange} />
          </Col>
          <Col span="6">
            <NavigationCard navigations={navigations}  selectname={selectname} selectpath={selectpath} change={this.changedata}/>
            {/*<Ranking info={statisticsChart[selectedKey]} />*/}
          </Col>
          <Col span="17" style={{marginTop:'40px'}}>
            <CalendarCard
              {...{
                userSchedule,
                onChange: this.fetchUserSchedule,
              }}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default ManagerCenter;

// 个人统计面板
function StatisticCard({ currentUser, avatar, userDashboard }) {
  const { name } = currentUser;
  const { projectVisitCount, projectCount, teamCount, teamRanking } = userDashboard;
  const StatisticItem = ({ divider = true, title, children }) => (
    <React.Fragment>
      <Row className="mg-h">
        <p>{title}</p>
        {children}
      </Row>
      {divider && <Divider type="vertical" style={{ height: '60%' }} />}
    </React.Fragment>
  );

  return (
    <Card style={{ margin: '-24px -24px 24px' }}>
      <Row type="flex" justify="space-between" >
        <Row>
          <Avatar src={avatar} icon="use" size={64} className="mg-r" />
          <Col>{name}</Col>
        </Row>
        <Row className="flex flex-v-center text-center">
          {/*项目数量*/}
          <StatisticItem title={formatMessage({id:'project.number'})}>
            <h1>{projectCount}</h1>
          </StatisticItem>
          {/*团队国内排名*/}
          <StatisticItem title={formatMessage({id:'project.ranking.china'})}>
            <h1>
              <Col>{teamRanking}</Col>
            </h1>
          </StatisticItem>
          {/*项目访问*/}
          <StatisticItem title={formatMessage({id:'project.access'})} divider={false}>
            <h1>{numeral(projectVisitCount).format('0,0')}</h1>
          </StatisticItem>
        </Row>
      </Row>
    </Card>
  );
}

// 快捷导航面板
function NavigationCard({ navigations,selectname,selectpath, change }) {
  const [modalShow, changeModalShow] = useState(false);

  const margin = isNegative => {
    const value = 16;
    return {
      margin: `${isNegative ? -value : value}px`,
    };
  };

  const addNavigation = () => {
    changeModalShow(true);
  };

  const handleTreeSelectChange =(selectedKeys, info) => {
    selectname = info;
    selectpath = selectedKeys;
  };

  // 格式化 menu 数据为 TreeSelect 组件数据格式

  const formatMenuData = data => {
    const result = data.map(({ name, url, children }) => {
      const formatedItem = {
        title: name,
        value: url,
        key: url,
      };

      if (children && children.length) {

        formatedItem.children = formatMenuData(children);
      }

      return formatedItem;

    });

    return result;
  };

  function go(value){
    router.push(value)
  }
  // 设置导航
  const setNavigations = () => {
    changeModalShow(false);
    let navigations = [];
    for(let i=0;i<selectname.length;i++){
      if(selectname[i].length>0){
        navigations.push({
          name:selectname[i],
          path:selectpath[i]
        })
      }
    }
    change(navigations,selectname,selectpath)
  };

  //对已选中的掉接口传去的数据格式化
  const valueList = formatMenuData(navigations);
  //得到处理后的key数组
  const valueKey = valueList.map((item)=>{
    return item.key
  });

  return (
    //快速开始/便捷导航
    <Card title={formatMessage({id:'project.quick.start'})} style={{ width: 300 }}>
      <Modal
        title='添加导航'
        visible={modalShow}
        onOk={setNavigations}
        destroyOnClose
        onCancel={() => changeModalShow(false)}
      >
        <Context.Consumer>
          {({ menuData }) => (
            <TreeSelect
              defaultValue={valueKey}
              treeData={formatMenuData(menuData)}
              style={{ width: '100%' }}
              treeCheckable
              onChange={handleTreeSelectChange}
            />

          )}
        </Context.Consumer>
      </Modal>
      {/*style={margin()*/}
      <Row  style={margin(true)}>
        <Row style={{display:'flex',flexWrap:'wrap',alignItems:'center',width:'100%'}}>
          {navigations.map((item,index) => (
            <div style={{cursor:'pointer',width:'20%',margin:'3%',textAlign:'center'}} key={index} onClick={()=> go(item.url)}>
              {item.name}
            </div>
          ))}
          <div style={{with:'20%'}}>
            <Button size="small"  onClick={addNavigation}>
              {/*+ 添加*/}
              {formatMessage({id:'project.add'})}
            </Button>
          </div>

        </Row>

      </Row>
    </Card>
  );
}

// 正在进行中面板
function OngoingCard({ projectOngoing = [],toProject }) {
  const toJump = ()=>{
    router.push("/projectmanagement/ongoingproject/list")
  }
  let aa = ''
  for(let i=0;i<projectOngoing.length;i++){
    if(projectOngoing[i].project_status == 'INITIAL'){
      projectOngoing[i].project_status = '初始状态'

    }else if(projectOngoing[i].project_status == 'FILL'){
      projectOngoing[i].project_status = '完善项目信息'

    }else if(projectOngoing[i].project_status == 'ICM'){
      projectOngoing[i].project_status= '投决会'

    }else if(projectOngoing[i].project_status == 'ID'){
      projectOngoing[i].project_status= '项目决策'

    }else if(projectOngoing[i].project_status == 'CIP'){
      projectOngoing[i].project_status = '确定投资计划'

    }else if(projectOngoing[i].project_status == 'POST'){
      projectOngoing[i].project_status = '投后管理'
    }
  }
  return (
    <Card title={formatMessage({id:'project.ongoing.project'})} extra={<Button onClick={toJump}>{formatMessage({id:'project.look.all'})}</Button>} className="mg-b">
      {projectOngoing.map(
        (item, index) => (
          <Card.Grid key={String(index)} >
            <Row className="flex flex-column flex-between" onClick={()=>toProject(item)}>
              <Row>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <h4>{item.project_name}</h4>
                  <p>{moment(item.createdate).fromNow()}</p>
                </div>
                <div style={{height:'60px'}}>
                  {item.subjectdesc?<Ellipsis length={25} tooltip>
                    {item.subjectdesc}
                  </Ellipsis>:'暂无备注信息'}
                </div>
              </Row>
              <Row className="flex flex-between">
                {/*项目状态*/}
                <b>{formatMessage({id:'validation.projectstatus'})}：</b>
                <b>{item.project_status}</b>
              </Row>
            </Row>
          </Card.Grid>
        )
      )}
    </Card>
  );
}

// 消息面板
function MessageCard({ onChange, userAfterInvestMsg, userTaskMsg, dispatch }) {
  // const MessageList = ({ data = [] }) => (
  //   <React.Fragment>
  //     {data.map((item, index) => (
  //       <div key={String(index)} onClick={() => handleMsgClick(item)}>
  //         <div>
  //           <h4>{item.content}</h4>
  //           <p style={{ fontSize: '12px' }}>{moment(item.senddate).fromNow()}</p>
  //           {index + 1 !== data.length && <Divider />}
  //         </div>
  //       </div>
  //     ))}
  //   </React.Fragment>
  // );

  const MessageList = ({ data, onClick, total }) => {
    if (!data) {
      data = []
    }
    const handleMsgClick = ({ content, id, state }, index) => {
      Modal.info({
        content,
      });
      if (onClick && state === 0) onClick(id, index);
    };
    return (
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item onClick={() => handleMsgClick(item, index)}>
            <List.Item.Meta title={item.content} description={moment(item.senddate).fromNow()} />
            {item.state === 0 && <Badge status="error" style={{ transform: 'scale(2)' }} />}
          </List.Item>
        )}
        pagination={{
          size: 'small',
          total,
        }}
      />
    );
  };

  const handleMsgClick = (id, index, type) => {
    console.log('type',type)
    /* dispatch({
       type: 'user/markRead',
       payload: {
         index,
         type,
         id,
       },
     });*/
  };

  return (
    <Card className="mg-b">
      <Tabs onChange={onChange}>
        {/*个人任务信息提醒*/}
        <TabPane tab={<Badge count={userTaskMsg.unreadCount}>{formatMessage({id:'project.Personal.information'})}</Badge>} key="1">
          <MessageList
            data={userTaskMsg.data}
            total={userTaskMsg.total}
            onClick={(id, index) => handleMsgClick(id, index, 'task')}
          />
        </TabPane>
        <TabPane
          tab={<Badge count={userAfterInvestMsg.unreadCount}>{formatMessage({id:'project.investment.information'})}</Badge>}
          key="2"
        >
          <MessageList
            data={userAfterInvestMsg.data}
            total={userAfterInvestMsg.total}
            onClick={(id, index) => handleMsgClick(id, index, 'afterInvest')}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
}

// 日历面板
function CalendarCard({ userSchedule = [], onChange }) {
  const renderCellContent = momentDate => {
    // 找到日期匹配日程
    const scheduleFinded = userSchedule.find(item => item.date === momentDate.format('YYYY-MM-DD'));
    if (!scheduleFinded) return null;

    return (
      <Row>
        <Badge status="warning" text={scheduleFinded.schedule} />
      </Row>
    );
  };
  const handlePanelChange = (momentDate, mode) => {
    if (mode === 'month') {
      onChange(momentDate);
    }
  };

  return (
    <Card>
      <Calendar dateCellRender={renderCellContent} onPanelChange={handlePanelChange} />
    </Card>
  );
}

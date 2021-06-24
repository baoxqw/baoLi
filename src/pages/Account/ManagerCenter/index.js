import React, { PureComponent } from 'react';
import { Card, Tabs, Divider, Button, Avatar } from 'antd';

const { TabPane } = Tabs;

export default class ManagerCenter extends PureComponent {
  data = {
    msg: [
      [
        {
          message: '出差',
          date: '一天前',
        },
        {
          message: '出差',
          date: '一天前',
        },
        {
          message: '出差',
          date: '一天前',
        },
      ],
    ],
    navigations: ['财务审批', '财务审批', '财务审批', '财务审批', '财务审批', '财务审批'],
  };

  render() {
    const { msg, navigations } = this.state;
    return (
      <React.Fragment>
        <StatisticCard />
        <div className="flex flex-v-start">
          <div className="mg-r flex1">
            <OngoingCard />
            <MessageCard msg={msg} />
          </div>
          <NavigationCard navigations={navigations} />
        </div>
      </React.Fragment>
    );
  }
}

// 个人统计面板
function StatisticCard() {
  const StatisticItem = ({ divider = true, title, num }) => (
    <React.Fragment>
      <div className="mg-h">
        <p>{title}</p>
        <h2>{num}</h2>
      </div>
      {divider && <Divider type="vertical" style={{ height: '60%' }} />}
    </React.Fragment>
  );

  return (
    <Card style={{ margin: '-24px -24px 24px' }}>
      <div className="flex flex-between">
        <div>
          <Avatar icon="use" size={64} className="mg-r" />
          <span>名字</span>
        </div>
        <div className="flex flex-v-center text-center">
          <StatisticItem title="项目数量" num="50" />
          <StatisticItem title="项目数量" num="50" />
          <StatisticItem title="项目数量" num="50" divider={false} />
        </div>
      </div>
    </Card>
  );
}

// 快捷导航面板
function NavigationCard({ navigations }) {
  const margin = isNegative => {
    const value = 16;
    return {
      margin: `${isNegative ? -value : value}px`,
    };
  };

  return (
    <Card title="快速开始/便捷导航" style={{ width: 300 }}>
      <div className="flex flex-between flex-wrap" style={margin(true)}>
        {navigations.map(item => (
          <span style={margin()} key={item}>
            {item}
          </span>
        ))}
        <Button size="small" style={margin()}>
          + 添加
        </Button>
      </div>
    </Card>
  );
}

// 正在进行中面板
function OngoingCard() {
  return (
    <Card title="进行中的项目" className="mg-b">
      {Array(7)
        .fill()
        .map(() => (
          <Card.Grid>
            <div className="flex flex-column flex-between">
              <div>
                <h4>项目1</h4>
                <p>这是描述。。。</p>
              </div>
              <div className="flex flex-between">
                <div>阶段</div>
                <div>17分钟前</div>
              </div>
            </div>
          </Card.Grid>
        ))}
    </Card>
  );
}

// 消息面板
function MessageCard({ onChange, msg }) {
  const MessageList = ({ data }) => (
    <React.Fragment>
      {data.map((item, index) => (
        <div key={item.message}>
          <h4>{item.message}</h4>
          <p style={{ fontSize: '12px' }}>{item.date}</p>
          {index + 1 !== data.length && <Divider />}
        </div>
      ))}
    </React.Fragment>
  );

  return (
    <Card>
      <Tabs onChange={onChange}>
        <TabPane tab="个人任务信息提醒" key="1">
          <MessageList data={msg[0]} />
        </TabPane>
        <TabPane tab="投后项目信息提醒" key="2">
          Content of Tab Pane 1
        </TabPane>
      </Tabs>
    </Card>
  );
}

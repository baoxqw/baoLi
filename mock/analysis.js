import moment from 'moment';
import { mock } from 'mockjs';

const mockNetFund = (req, res) => {
  const data = Array(100)
    .fill()
    .map((item, i) => ({
      key: i + 1,
      name: `基金 ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
      isPublished: [true, false][Math.floor(2 * Math.random())],
      finance: [0, 1, 2][Math.floor(3 * Math.random())],
      manageEnv: [0, 1, 2][Math.floor(3 * Math.random())],
      manage: [0, 1, 2][Math.floor(3 * Math.random())],
      govern: [0, 1, 2][Math.floor(3 * Math.random())],
      toMarket: [0, 1, 2][Math.floor(3 * Math.random())],
      income: [0, 1, 2][Math.floor(3 * Math.random())],
      total: [0, 1, 2][Math.floor(3 * Math.random())],
      status: ['发布中', '未发布'][Math.floor(2 * Math.random())],
      date: moment(new Date()).format('YYYY-MM'),
      count: Math.floor(Math.random() * 10),
      money: Math.floor(Math.random() * 100000),
      percentage: `${Math.floor(Math.random() * 100)}%`,
      fundName: `基金 ${i}`,
      projectName: ['区块链', 'SAAS服务', '比特币'][Math.floor(3 * Math.random())],
      tag: `TAG ${i}`,
      person: `人物${i}`,
    }));

  console.log(data, 'mockdata');
  return res.json(data);
};

const mockRiskStatus = (req, res) => {
  let data;
  return res.json(data);
};

const projectDashboardData = mock({
  fundnet: '@integer(1000,10000)',
  projectCount: '@integer(10,100)',
  invest: {
    count: '@integer(1000, 10000)',
    'investInStatistics|9': [
      {
        name: '@cname',
        count: '@integer(100,1000)',
      },
    ],
    'investOutStatistics|9': [
      {
        name: '@cname',
        count: '@integer(100,1000)',
      },
    ],
  },
  roi: {
    week: '@float(-10, 10, 2, 2)',
    day: '@float(-10, 10, 2, 2)',
    average: '@integer(0, 200)',
    'statistics|9': [
      {
        name: '@cname',
        count: '@integer(100, 1000)',
      },
    ],
  },
});

const areaProjectData = mock({
  'areaData|4-12': [
    {
      province: '@province',
      projectCount: '@integer(10,100)',
    },
  ],
});

const projectStageData = mock({
  'project|5': [{ stage: '@cname', count: '@integer(10,100)' }],
});

const projectRiskData = mock({
  'data|20': [
    {
      projectId: '@id',
      projectName: '@ctitle',
      'riskOverall|1': ['high', 'normal', 'low'],
      'earningManagement|1': ['high', 'normal', 'low'],
      'marketProgress|1': ['high', 'normal', 'low'],
      'governance|1': ['high', 'normal', 'low'],
      'operateManagement|1': ['high', 'normal', 'low'],
      'operateEnv|1': ['high', 'normal', 'low'],
      'finance|1': ['high', 'normal', 'low'],
      basedate: '@date',
      publishStatus: '@boolean',
      memo: '@ctitle',
    },
  ],
  total: '@integer(100,200)',
});

const fundProjectData = mock({
  'data|20': [
    {
      fundName: '@ctitle',
      tag: '@ctitle',
      average: '@integer(0,100)',
      count: '@integer(10,100)',
      countPercentage: '@integer(1,100)',
      sum: '@integer(10000,100000)',
      sumPercentage: '@integer(1,100)',
    },
  ],
  total: '@integer(100,200)',
});

const fundNetListData = mock({
  'data|5': [
    {
      id: '@id',
      fundName: '@cname',
      CEO: '@cname',
      mainBusiness: '@ctitle',
      netFund: '@integer(100000,200000)',
      capital: '@integer(1000000,2000000)',
      setupDate: '@date',
    },
  ],
  total: '@integer(100,200)',
});

const fundNetProjectListData = mock({
  'data|5': [
    {
      projectName: '@ctitle',
      manager: '@cname',
      mainBusiness: '@ctitle',
      investDate: '@date',
      projectStatus: '@cword(6,10)',
      assessment: '@integer(100000,200000)',
    },
  ],
  total: '@integer(10, 100)',
});

const fundNetLpListData = mock({
  'data|5': [
    {
      lpName: '@cname',
      percentage: '@integer(1,100)',
    },
  ],
  total: '@integer(10, 100)',
});
export default {
  'GET /api/analysis/netFund': mockNetFund,
  'GET /api/analysis/fetchRiskStatus': mockRiskStatus,
  'GET /dashboard/project': projectDashboardData,
  'GET /analysis/areaStatistics': areaProjectData,
  'GET /analysis/projectStageStatistics': projectStageData,
  'POST /analysis/projectRisk': projectRiskData,
  'POST /analysis/fundProject': fundProjectData,
  'POST /analysis/fundNet/list': fundNetListData,
  'POST /analysis/fundNet/projectList': fundNetProjectListData,
  'POST /analysis/fundNet/lpList': fundNetLpListData,
};

import mock from 'mockjs';

const mockApprovalPerson = mock.mock({
  'list|20': [
    {
      'key|+1': 1,
      title: '@cname',
      description: '@cparagraph',
    },
  ],
});

export default {
  'GET /api/approvalPerson': mockApprovalPerson,
};

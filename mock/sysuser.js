import { parse } from 'url';

const mockData = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `角色 ${i}`,
    description: `description of content${i + 1}`,
  });
}

function assignsss(req, res, u,b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;

  return res.json(mockData);
}



export default {
  'POST /rest/user/query': assignsss,
};

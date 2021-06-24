export default {
  'GET /api/postmanagement': {
    list:[
      {'id':1,'name':'aa','uploader':'aa','state':1},
      {'id':2,'name':'aa','uploader':'aa','state':1},
      {'id':3,'name':'aa','uploader':'aa','state':1},
      {'id':4,'name':'aa','uploader':'aa','state':1},
      {'id':5,'name':'aa','uploader':'aa','state':1},
      {'id':6,'name':'aa','uploader':'aa','state':1},
      {'id':7,'name':'aa','uploader':'aa','state':1},
      {'id':8,'name':'aa','uploader':'aa','state':1},
      {'id':9,'name':'aa','uploader':'aa','state':1},
      {'id':10,'name':'aa','uploader':'aa','state':1},
      {'id':11,'name':'aa','uploader':'aa','state':1},
    ],
    pagination: {
      total: 11,
      pageSize: 10,
      current: 1,
    },
  },

  'GET /api/postmanagement/1': {
    'name':'aa'
  },

  'GET /api/postmanagement/1/corpinfo': {
    'name':'wawkak',
    'regDate':'2018-10-10'
  },

  'GET /api/postmanagement/1/investment': {
    list:[
    {'id':1,'investDate':'2018-10-10','fundName':'月月增利','investType':1,'investTool':'现金','shareHolder':10,'ctrAmount':12,'ctrCurrency':'CNY','fundAmount':123,'fundCurrency':'USD'},
    {'id':2,'investDate':'2018-10-10','fundName':'月月增利','investType':1,'investTool':'现金','shareHolder':10,'ctrAmount':12,'ctrCurrency':'CNY','fundAmount':123,'fundCurrency':'USD'},
    {'id':3,'investDate':'2018-10-10','fundName':'月月增利','investType':1,'investTool':'现金','shareHolder':10,'ctrAmount':12,'ctrCurrency':'CNY','fundAmount':123,'fundCurrency':'USD'},
    {'id':4,'investDate':'2018-10-10','fundName':'月月增利','investType':1,'investTool':'现金','shareHolder':10,'ctrAmount':12,'ctrCurrency':'CNY','fundAmount':123,'fundCurrency':'USD'},
    {'id':5,'investDate':'2018-10-10','fundName':'月月增利','investType':1,'investTool':'现金','shareHolder':10,'ctrAmount':12,'ctrCurrency':'CNY','fundAmount':123,'fundCurrency':'USD'},
  ]},


};
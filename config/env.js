let env = '';
switch (process.env.API_ENV) {
  case 'test': //测试环境
    env = 'http://49.234.209.104:8080';
    break;
  case 'dev': //开发环境
    //env = 'http://127.0.0.1:8080';
    env = 'http://192.168.2.147:8080';
    //env = 'http://192.168.32.22:8000';
    break;
  case 'produce': //生产环境
    env = 'https://www.leapingtech.com/nienboot-0.0.1-SNAPSHOT';
    break;
}

export default env

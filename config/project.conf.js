module.exports = {
  // server name
  name: 'i18n-service',

  // koa keys
  keys: ['i18n-service secrect', 'hello i18n-service'],
  
  // session encrypt password
  sessionPass: 'hello',

  // 客户端
  clients: {
    test: {
      appsecret: '123456'
    }
  }
};
/**
 * session
 * 配置参考：https://github.com/koajs/session
 */

var session = require('koa-session');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    keys: ["You're right, taht's me !"]
  }, options);

  app.keys = options.keys;
  app.use(session(app));
  
}

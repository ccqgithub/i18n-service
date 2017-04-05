/**
 * 日志
 * 配置参考：https://github.com/koa-modules/morgan
 */

var morgan = require('koa-morgan');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    format: 'combined',
    options: {},
  }, options);

  app.use(morgan.middleware(options.format, options.options));

}

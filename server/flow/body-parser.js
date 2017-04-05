/**
 * body parser
 * 配置参考：https://github.com/dlau/koa-body
 */

var bodyParser = require('koa-body');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    multipart: true,
  }, options);

  app.use(bodyParser({
    multipart: options.multipart
  }));

}

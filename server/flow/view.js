/**
 * 视图
 * 配置参考：https://github.com/queckezz/koa-views
 */

var views = require('koa-views');
var path = require('path');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    root: path.join(__dirname, '../public/_view'),
    opts: {
      extension: 'html',
      map: {
        html: 'ejs'
      }
    }
  }, options);

  app.use(views(options.root, options.opts));

}

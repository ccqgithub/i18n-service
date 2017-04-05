/**
 * 静态文件
 * 配置参考：https://github.com/koajs/static
 */

var staticServe = require('koa-static');
var path = require('path');
var clone = require('clone');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    roots: [], // 目录列表
    opts: {}, // 配置项
  }, options);

  options.roots.forEach(function(root) {
    app.use(staticServe(root, clone(options.opts)));
  });

}

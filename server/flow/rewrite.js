/**
 * 重写url
 * 配置参考：https://github.com/koajs/rewrite
 **/

var rewrite = require('koa-rewrite');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    rewrites: [],
  }, options);

  options.rewrites.forEach(function(item) {
    var from = item[0];
    var to = item[1];

    app.use(rewrite(from, to));
  });
  
}

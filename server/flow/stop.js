/**
 * 拦截请求
 * 这些路径到此为止，不要往后找了
 */

var path = require('path');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    paths: [], // 拦截路径列表, 正则
    status: 404, // 返回状态码
    body: null, // 返回内容
  }, options);

  app.use(function * (next) {
    var curPath = this.request.path;
    var stop = false;

    options.paths.forEach(function(p) {
      if (stop) return;
      stop = p.test(curPath);
    });

    // 不拦截
    if (!stop) return yield next;

    this.body = options.body;
    this.status = options.status;
  });

}

/**
 * 路径跳转
 */

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    redirects: [
      // [/fromPattern/, 'to', status]
    ],
  }, options);

  app.use(function * (next) {
    var curPath = this.request.path;
    var find = null;

    options.redirects.forEach(function(item) {
      if (find) return;
      if (item[0].test(curPath)) find = item;
    });

    // 不拦截
    if (!find) return yield next;

    this.status = find[2] || 302;
    this.redirect(curPath.replace(find[0], find[1]));
  });

}

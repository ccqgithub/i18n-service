/**
 *  结果处理, 统一输出ajax结果
 */

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    //
  }, options);

  app.use(function * (next) {
    var isAjax = this.request.headers['x-requested-with'] && this.request.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest';

    yield next;

    if (isAjax) {
      this.status = this.state.status || 200;
      this.body = {
        status: 200,
        result: this.state.result,
        message: this.state.message || 'ok'
      };
    }
  });

}

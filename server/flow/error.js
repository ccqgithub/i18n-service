/**
 *  错误处理
 */

var path = require('path');
var fs = require('fs');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    //
  }, options);

  app.use(function * (next) {
    var isAjax = this.request.headers['x-requested-with'] && this.request.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest';
    var status, message;

    try {
      yield next;
    } catch (e) {
      console.log(`${e.status}: ${e.message}`);
      console.log(e.stack || e);

      if (typeof e == 'object' && typeof e.message != 'undefined') {
        status = e.status || 500;
        message = e.message;
      } else {
        status = 500;
        message = e;
      }

      if (!isAjax) {
        this.status = 500;
        this.body = message;
      } else {
        this.body = {
          code: status,
          message: message
        };
      }
    }
  });
}

var crypto = require('crypto');
var clients = require('../config/client');

/**
 * 中间件：判断API签名
 */

module.exports = function() {
  return function * (next) {
    var appid = this.request.query.appid;
    var timestamp = this.request.query.timestamp;
    var sinature = this.request.query.sinature;

    if (!appid || !clients[appid]) {
      this.throw('无效请求');
    }

    if (!timestamp || !sinature) {
      this.throw('签名不对');
    }

    if (new Date().getTime() - timestamp > 120 * 1000) {
      this.throw('请求过期');
    }

    var client = clients[appid];
    var sha1 = crypto.createHash('sha1');

    sha1.update('i18n-service@' + appid + client.appsecret + timestamp);

    if (sha1.digest('hex').toLowerCase() != sinature.toLowerCase()) {
      this.throw('签名错误');
    }

    yield next;
  }
}

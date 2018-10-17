const crypto = require('crypto');
const clients = require('../config/client');

/**
 * 中间件：判断API签名
 */

module.exports = function() {
  return async (ctx, next) => {
    let appid = ctx.request.query.appid;
    let timestamp = ctx.request.query.timestamp;
    let sinature = ctx.request.query.sinature;

    if (!appid || !clients[appid]) {
      ctx.throw('无效请求');
    }

    if (!timestamp || !sinature) {
      ctx.throw('签名不对');
    }

    if (new Date().getTime() - timestamp > 120 * 1000) {
      ctx.throw('请求过期');
    }

    let client = clients[appid];
    let sha1 = crypto.createHash('sha1');

    sha1.update('i18n-service@' + appid + client.appsecret + timestamp);

    if (sha1.digest('hex').toLowerCase() != sinature.toLowerCase()) {
      ctx.throw('签名错误');
    }

    return next();
  }
}

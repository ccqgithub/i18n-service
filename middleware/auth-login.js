'use strict';

/**
 * 中间件：判断用户是否登陆
 */

module.exports = function() {
  return function * (next) {
    if (!this.session.user) {
      if (!this.state.remote.isAjax ) {
        var redirect_url = this.request.href;
        return this.redirect('/login?redirect_url=' + encodeURIComponent(redirect_url));
      } else {
        this.throw('未登录或者登录过期', 410);
        return;
      }
    }

    yield next;
  }
}

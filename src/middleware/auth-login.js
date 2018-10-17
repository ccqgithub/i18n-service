/**
 * 中间件：判断用户是否登陆
 */

module.exports = function() {
  return async (ctx, next) => {
    if (!ctx.session.user) {
      if (!ctx.state.isAjax ) {
        let redirect_url = ctx.request.href;
        return ctx.redirect('/login?redirect_url=' + encodeURIComponent(redirect_url));
      } else {
        ctx.throw('未登录或者登录过期', 410);
        return;
      }
    }

    return next();
  }
}

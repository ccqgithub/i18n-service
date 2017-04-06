/**
 * 准备，比如预定义一些变量等
 */

var path = require('path');
// var LocaleHelper = require('../helper/locale');
var MockHelper = require('../helper/mock');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    translates: ['com'],
  }, options);

  app.use(function * (next) {
    this.state.isAjax = this.request.headers['x-requested-with'] && this.request.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest';
    // this.state.remoteIp = 11111;

    // helpers
    // this.state.localeHelper = new LocaleHelper(path.join(this.app.root, './locale'), options.translates, this.state.locale);
    // this.state.i18n = function(msgid, msgctx, params) {
    //   return this.state.localeHelper.i18n(msgid, msgctx, params);
    // }.bind(this);

    this.state.mockHelper = new MockHelper({
      mockDir: path.join(__dirname, '../mock'),
      locale: this.state.locale,
    });

    // locals
    this.state.locals = this.state.locals || {};
    this.state.locals.locales = this.state.locales;
    this.state.locals.locale = this.state.locale;
    // this.state.locals.localeData = this.state.localeHelper.getLangSet();
    this.state.locals.baseUrl = this.origin + '/';
    this.state.locals.baseUrlWithLocale = this.state.hasLocale ? this.state.locals.baseUrl + this.locale + '/' : this.state.locals.baseUrl;
    this.state.locals.fullUrl = this.request.href;
    this.state.locals.canonicalUrl = this.url;

    yield next;
  });
}

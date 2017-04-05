/**
 * 本地语言化
 */

var rewrite = require('koa-rewrite');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    // 支持的语言
    locales: ['en', 'zh-cn'],
    // 排除中英文的
    excludes: [
      // /pattern/
    ],
    forceSlash: true
  }, options);

  app.use(function * (next) {
    var acceptLangs = this.request.headers['accept-language'].toLowerCase();
    var urlPath = this.request.path;
    var langPattern, browserLang, urlLang, locale, i;

    this.state.locales = options.locales;

    // 浏览器语言
    i = Infinity;
    options.locales.forEach(function(item) {
      var j;

      item = item.toLowerCase();
      j = acceptLangs.indexOf(item);

      if (j >= 0 && j < i) {
        i = j;
        browserLang = item;
      }
    });

    // 路径中语言
    options.locales.forEach(function(item) {
      item = item.toLowerCase();
      if (urlPath.toLowerCase().indexOf(`/${item}/`) == 0 || urlPath == `/${item}`) {
        urlLang = item;
      }
    });

    this.state.locale = urlLang || browserLang || options.locales[0];

    // 无语言参数
    if (!urlLang) {
      // if not in excludes
      // redirect to locale page
      if (!options.excludes.some(function(item) {
        return item.test(urlPath);
      })) {
        this.redirect('/' + this.state.locale + urlPath);
        return;
      }
      // hasLocale ?
      this.state.hasLocale = false;
    } else {
      // http://test.com/zh-cn => http://test.com/zh-cn/
      if (options.forceSlash && urlPath == `/${urlLang}`) {
        this.redirect('/' + urlLang + '/');
        return;
      }
      // hasLocale ?
      this.state.hasLocale = true;
    }

    yield next;
  });

  // rewrite locale page to router
  langPattern = new RegExp('^\\/(' + options.locales.join('|') + ')(\\/.*|$)');
  app.use(rewrite(langPattern, '$2'));

}

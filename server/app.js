"use strict";

/**
 * 项目主文件
 */

var program = require('commander');
var fs = require('fs');
var path = require('path');

// 参数
program
  .option('--env [env]', '[koa server:] Specify the env(local by default)')
  .parse(process.argv);

// 配置
var configFile = path.join(__dirname, './config', (program.env || 'local') + '.js');
var config = require(configFile);

// env
process.env.DEBUG = config.debug;

var koa = require('koa');
var logger = require('koa-logger');
var morgan = require('koa-morgan');
var session = require('koa-session');
var staticServe = require('koa-static');
var views = require('koa-views');
var bodyParser = require('koa-body');
var conditional = require('koa-conditional-get');
var compress = require('koa-compress')
var etag = require('koa-etag');
var rewrite = require('koa-rewrite');
var debug = require('debug')('app:boot');

// new app
var app = koa();

app.name = 'i18n-service';
app.proxy = true; //如果为 true，则解析 "Host" 的 header 域，并支持 X-Forwarded-Host
app.subdomainOffset = 2; //默认为2，表示 .subdomains 所忽略的字符偏移量。

// err events
// app.on('error', function(err){
//     console.log(err);
// });

// compress
app.use(compress({
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}));
// use it upstream from etag so
// that they are present
app.use(conditional());
// add etags
app.use(etag());

// 静态文件
app.use(staticServe(path.join(__dirname, '../public')));

// 开启访问日志
// app.use(logger());
app.use(morgan.middleware('combined', {
  skip: function (req, res) {
    // return res.statusCode == 200;
  }
}));

// 开启session
app.keys = ["You're right, taht's me !"];
app.use(session(app));

// 总入口
app.use(function * (next) {
  var
    status,
    message;

  this.compress = true;
  this.state.config = config;
  this.state.remote = {};
  this.state.locals = {};

  // is ajax xhr
  this.state.remote.isAjax = this.request.headers['x-requested-with'] && this
    .request
    .headers['x-requested-with']
    .toLowerCase() == 'xmlhttprequest';

  // locale
  this.state.locals.baseUrl = this.request.protocol + '://' + this.request.host + '/' + this.state.locale + '/';

  try {
    yield next;

    if (this.state.remote.isAjax) {
      this.body = {
        status: 200,
        result: this.state.result,
        message: this.state.message || 'ok'
      };
    }
  } catch (e) {
    e.message && console.log(e.message);
    console.log(e.stack || e);

    if (typeof e == 'object' && typeof e.message != 'undefined') {
      status = e.status || 500;
      message = e.message;
    } else {
      status = 500;
      message = e;
    }

    if (!this.state.remote.isAjax) {
      yield this.render('exception', {});
    } else {
      this.body = {
        code: status || 500,
        expose: this.state.expose,
        message: message
      };
    }
  }
});

// body
app.use(bodyParser({
  multipart: true
}));

// views
app.use(views(path.join(__dirname, '../public/_view'), {
  extension: 'html',
  map: {
    html: 'ejs'
  }
}));

// 加载路由
app.use(require('./router/main').routes());

// 404
app.use(function * (next) {
  this.throw('Not Found', 404);
});

// 开启监听服务
var server = app.listen(config.serverPort);

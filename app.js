"use strict";

/**
 * 项目主文件
 */

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

var env = process.env.NODE_SITE_ENV || 'local';
var config = require(path.join(__dirname, './config/env', env + '.js'));

// env
process.env.DEBUG = config.debug;

var url = require('url');
var koa = require('koa');
var cors = require('koa-cors');
var morgan = require('koa-morgan');
var session = require('koa-session');
var staticServe = require('koa-static');
var views = require('koa-views');
var bodyParser = require('koa-body');
var conditional = require('koa-conditional-get');
var compress = require('koa-compress')
var etag = require('koa-etag');
var rewrite = require('koa-rewrite');
var prerender = require('koa-prerender-m');
var debug = require('debug')('app:boot');

// new app
var app = koa();

app.env = env;
app.name = 'i18n-service';
app.proxy = true; //如果为 true，则解析 "Host" 的 header 域，并支持 X-Forwarded-Host
app.subdomainOffset = 2; //默认为2，表示 .subdomains 所忽略的字符偏移量。
app.root = __dirname;

// err events
app.on('error', function(err){
  console.log(err);
});

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

// 跨域配置
app.use(cors({
  origin: function(request) {
    return '*';
  }
}));

// 静态文件
app.use(staticServe(path.join(__dirname, './static'), {
  maxage: 1000,
}));

// 开启访问日志
// app.use(logger());
app.use(morgan.middleware('combined', {
  skip: function (req, res) {
    // return res.statusCode == 200;
  }
}));

// 开启session
app.keys = ["You're right, i am i18n-service !"];
app.use(session(app));

// 总入口
app.use(function * (next) {
  var self = this,
    status,
    message;

  this.compress = true;
  this.state.config = config;
  this.state.remote = this.state.remote || {};
  this.state.locals = this.state.locals || {};

  // is ajax xhr
  this.state.remote.isAjax = this.request.headers['x-requested-with'] && this
    .request
    .headers['x-requested-with']
    .toLowerCase() == 'xmlhttprequest';

  // locals
  this.state.locals.baseUrl = '/';

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
      status = status || 500;
      message = e;
    }

    if (!this.state.remote.isAjax) {
      this.status = 500;
      this.body = message;
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
app.use(views(path.join(__dirname, './view'), {
  extension: 'html',
  map: {
    html: 'ejs'
  }
}));

// router
app.use(require('./router/main').routes());
app.use(require('./router/client').routes());

// 404
app.use(function * (next) {
  this.throw('Not Found', 404);
});

// 开启监听服务
var server = app.listen(config.port);

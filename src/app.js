/**
 * 项目主文件
 */
const path = require('path');
const http = require('http');
const Koa = require('koa');
const morgan = require('morgan');
const session = require('koa-session');
const staticServe = require('koa-static');
const helmet = require('koa-helmet');
const ipFilter = require('koa-ip');
const bodyParser = require('koa-body');
const conditional = require('koa-conditional-get');
const compress = require('koa-compress');
const etag = require('koa-etag');
const views = require('koa-views');
const cors = require('@koa/cors');
const mongoose = require('mongoose');
// const rewrite = require('koa-rewrite');

const prjConf = require('../config/project.conf');
const config = require('../config/env.conf');
const loadRouter = require('./lib/load-router');

// env
process.env.DEBUG = config.debug;

// new app
const app = new Koa();

// mongoose
mongoose.set('bufferCommands', false);

// app property
app.name = `${prjConf.name}-server`;
app.keys = prjConf.keys || [];
app.env = process.env.NODE_ENV;
app.appENV = process.env.APP_ENV;
// 如果为 true，则解析 "Host" 的 header 域，并支持 X-Forwarded-Host
app.proxy = true;
// 默认为2，表示 .subdomains 所忽略的字符偏移量。
app.subdomainOffset = 2;

// not caught errors
app.on('error', (err, ctx) => {
  console.log(err);
  console.log(err.stack);
});

// 开启访问日志
const morganFn = morgan('combined', {});
app.use(async (ctx, next) => {
  return new Promise((resolve, reject) => {
    morganFn(ctx.req, ctx.res, (err) => {
      return err ? reject(err) : resolve(ctx);
    });
  }).then(next);
});

// ip filter
app.use(
  ipFilter({
    whitelist: ['[0-9]*\\.[0-9]*\\.[0-9]*\\.[0-9]*'],
    blacklist: ['127\\.110\\.0\\.\\[0-9]*'],
    handler: async (ctx) => {
      console.log(ctx.ip);
      ctx.status = 403;
    },
  }),
);

// cors 跨域
app.use(
  cors({
    // allowHeaders: [],
    // exposeHeaders: [],
  }),
);

// helmet, add security headers
app.use(
  helmet({
    frameguard: false,
  }),
);

// 开启session
app.use(
  session(
    {
      maxAge: 1000 * 3600 * 24 * 7,
      httpOnly: true,
      signed: true,
      renew: true,
    },
    app,
  ),
);

// static files
app.use(staticServe(path.resolve(__dirname, './static/')));

// process
app.use(async (ctx, next) => {
  try {
    // ajax
    ctx.state.isAjax = ctx.request.headers['x-requested-with'] && ctx
      .request
      .headers['x-requested-with']
      .toLowerCase() == 'xmlhttprequest';

    // config
    ctx.state.config = config;
    
    await next();

    // use state.result as body
    if (!ctx.body && ctx.state.result) {
      ctx.body = {
        error: null,
        result: ctx.state.result,
      };
    }
  } catch (err) {
    // log exceptions
    console.log(err);

    // headers
    ctx.set(err.headers || {});

    // status
    ctx.status = http.STATUS_CODES[err.status] ? err.status : 500;

    // default err info
    let errInfo = {
      status: err.status || 500,
      message: err.message || 'Server Error',
      info: err.info || null,
    };

    // error body
    ctx.body = {
      error: errInfo,
      result: null,
    };
  }
});

// compress
app.use(
  compress({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH,
  }),
);
// use it upstream from etag so
// that they are present
app.use(conditional());
// add etags
app.use(etag());

// i18n 国际化
// app.use(
//   require('./lib/i18n')({
//     def: 'zh-CN',
//   }),
// );

// body
app.use(
  bodyParser({
    multipart: true,
    jsonLimit: '1mb',
    formLimit: '500kb',
  }),
);

// db connection
app.use(async (ctx, next) => {
  ctx.getDB = () => {
    if (!app.dbConnection) {
      app.dbConnection = mongoose.createConnection(config.mongodbServer).then(
        (data) => data,
        (err) => {
          console.log(err);
          return Promise.reject(new Error('db connect error'));
        },
      );
    }
    return app.dbConnection;
  };
  return next();
});

// views
app.use(views(path.resolve(__dirname, './view'), {
  extension: 'html',
  map: {
    html: 'ejs'
  }
}));

// 加载路由
loadRouter(app, {
  dir: path.resolve(__dirname, './router'),
  deep: true,
});

// not found
app.use(async (ctx, next) => {
  console.log('404', ctx.path);
  ctx.throw('Not Found!', 404);
});

// 开启监听服务
app.listen(config.port);
console.log(`http://127.0.0.1:${config.port}/`);
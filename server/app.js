var program = require('commander');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

// 启动参数
program
  .option('--env [env]', '[koa server:] Specify the env(local by default)')
  .parse(process.argv);

// 加载配置
var appEnv = program.env || 'local';
var appConfigAll = yaml.load(
  fs.readFileSync(path.join(__dirname, '../config.yaml'), 'utf8')
);
var appConfig = appConfigAll[appEnv];

// process env 参数
Object.assign(process.env, appConfig.env || {});

// new app
var koa = require('koa');
var app = koa();

app.name = 'koa-site-start';
app.proxy = true; //如果为 true，则解析 "Host" 的 header 域，并支持 X-Forwarded-Host
app.subdomainOffset = 2; //默认为2，表示 .subdomains 所忽略的字符偏移量。
app.root = __dirname;
app.config = appConfig;

/**==============flow start============**/
require('./util/flow')(app, [

  // 路径重写
  {
    flow: 'rewrite',
    options: {
      rewrites: [
        [/^\/home\/?$/, '/'],
      ]
    }
  },

  // 网络优化
  {
    flow: 'network-optimize',
    options: {
      etag: true,
      compress: true,
    }
  },

  // 静态资源
  {
    flow: 'static',
    options: {
      roots: [
        path.join(__dirname, '../public'),
        path.join(__dirname, './storage'),
      ]
    }
  },

  // 拦截请求
  {
    flow: 'stop',
    options: {
      paths: [
        /^\/static|static2\//
      ]
    }
  },

  // 开启日志记录
  {
    flow: 'log',
    options: {}
  },

  // 路径跳转
  {
    flow: 'redirect',
    options: {
      redirects: [
        // [fromPattern, 'replaceTo', status]
      ]
    }
  },

  // 本地化 or 国际化
  {
    flow: 'locale',
    options: {
      locales: ['zh-cn', 'en'],
      excludes: [
        /\/sitemap\.xml/
      ],
    }
  },

  // 预渲染，针对搜索引擎,
  // 不需要就不设，配置错误的话，搜索引擎将抓不到任何数据
  // {
  //   flow: 'prerender',
  //   options: {
  //     prerender: 'http://prerender.github.com:8080/',
  //     username: 'test',
  //     password: '123456',
  //   }
  // },

  // 开启session
  {
    flow: 'session',
    options: {
      keys: ['koa-site-session-key1']
    }
  },

  // 错误捕获处理
  {
    flow: 'error',
    options: {}
  },

  // 结果捕获
  {
    flow: 'ajax-result',
    options: {}
  },

  // 常用状态准备
  {
    flow: 'prepare-state',
    options: {}
  },

  // post 数据解析
  {
    flow: 'body-parser',
    options: {}
  },

  // 模板渲染
  {
    flow: 'view',
    options: {
      root: path.join(__dirname, '../public/_view/'),
      opts: {
        extension: 'html',
        map: {
          html: 'ejs' // html文件当做ejs模板
        }
      }
    }
  },

  // 加载路由
  {
    flow: 'router',
    options: {
      dir: path.join(__dirname, './router'),
      deep: false,
    }
  }
]);

/**==============flow end============**/

// 默认404
app.use(function * (next) {
  this.throw('Not Found', 404);
});

// 开启监听服务
var server = app.listen(appConfig.port);

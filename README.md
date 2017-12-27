# i18n-service

> 前端 i18n 微服务， 帮组管理语言翻译文件

## 依赖

- `node@lts`, nodejs 环境
- `mongodb@3`, mogodb 服务

## 配置

> 新增一个发布环境时， 修改下面这三个文件。

- `build/pm2.config.js`: pm2启动服务器配置
```
SITE_PROD_ENV 用于区分不同发布环境，加载不同配置参数
```

- `config/env`: 配置不同发布环境的相关参数，对应`process.env.SITE_PROD_ENV`, 如果`SITE_PROD_ENV`为local, 则会加载`config/env/local.js`

```txt
  服务端口(port)、mongodb server连接配置(mongoServer)、配置页面登录用户名(loginUser)密码(loginPass)等……详情见`config/env/locale.js`。
```

- `package.json > scripts`: 配置便捷发布

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "pm2 startOrRestart build/pm2.config.js --only=i18n-service-local",
  "release-prod": "pm2 startOrRestart build/pm2.config.js --only=i18n-service-prod",
  "pass": "node script/generate-pass.js"
},
```

## 启动service

```sh
# 进入目录
cd i18n-service

# 安装依赖
npm install

# 启动本地开发
npm run dev

# 或者发布生产
npm run release-prod

# 查看日志
tail -f log/pm2.log
```

## 用户名密码

> `config/env/xxx.js`

- `loginUser`
- `loginPass`, 加密过的密码

## 获取加密密码

```
npm run pass -- --pass=your_password
```

## client api 接口

> `BASE_URL`: i18n-service 服务域名地址

- `BASE_URL/client/mark?site=site&locale=locale&key=key`, `get`, 标识为翻译的key, 参数会被`decodeURIComponent`。

- `BASE_URL/client/js?site=site&locale=locale&varname=varname`, `get`, 将所有的翻译输出为js，用于开发过程中实时调用。

```js
// result
window['varname'] = {
  "test": {
    "key": "value"
  }
}
```

- `BASE_URL/client/json?site=site&locale=locale`, `get`, 将所有的翻译输出为json，一般翻译稳定后，发布时获取json保存项目本地。

```js
// result
{
  status: 200,
  result: {
    "test": {
      "key": "value"
    }
  }
}
```

## 辅助工具: [i18n-service-download](https://github.com/ccqgithub/i18n-service/tree/master/tool/i18n-service-download)

> 下载反应json文件辅助工具

安装

```sh
npm i i18n-service-download -S
```

使用: write the scripts in your js, then run that js

```
const path = require('path');
const download = require('i18n-service-download');

const dir = path.resolve(__dirname, '../server/i18n/temp/');

download({
  server: 'http://8.8.8.8:50011/',
  locales: ['zh-CN', 'en'],
  site: 'test',
  dir: dir
}).then(data => {
  console.log('download i18n success');
}).catch(err => {
  console.log(err)
  console.log('download i18n error');
});
```

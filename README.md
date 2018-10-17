# i18n-service

> 前端 i18n 微服务， 帮组管理语言翻译文件

## 依赖

- `node@lts`, nodejs 环境
- `mongodb@3`, mogodb 服务

## 配置

> 新增一个发布环境时， 修改下面这三个文件。

- `config/pm2.config.js`: pm2启动服务器配置

```js
process.env.NODE_ENV  // 开发版 development，生产环境 production
process.env.APP_ENV // 用于区分不同发布环境，加载不同配置参数
```

- `config/env.conf.js`: 配置不同发布环境的相关参数，对应`process.env.APP_ENV`

- `package.json > scripts`: 配置便捷发布

## 启动service

```sh
# 进入目录
cd i18n-service

# 安装依赖
npm install

# 启动本地开发
npm run dev

# 或者发布生产
npm run deploy-prod

# 查看日志
tail -f log/pm2.log

# or
pm2 log
```

## 用户名密码

> `config/env/xxx.js`

- `loginUser` 登录用户名 默认：admin
- `loginPass`, 加密过的密码 默认：123456

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

## 辅助工具

- 下载json：[./tool/](https://github.com/ccqgithub/i18n-service/tree/master/service).
- 密码工具：[./tool/](https://github.com/ccqgithub/i18n-service/tree/master/pass).
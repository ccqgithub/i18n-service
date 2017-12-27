# i18n-service-download

> download json from i18n-service

## 安装

```sh
npm i i18n-service-download -S
```

## 使用: write the scripts in your js, then run that js
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
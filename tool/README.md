# i18n-service tools

> `npm i i18n-service-tool -S`

## download

write the scripts in your js, then run that js

```js
const path = require('path');
const download = require('i18n-service-tool/download');

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

## pass

```js
const pass = require('i18n-service-tool/pass');

// 生成密码
let hash = pass.generate('password');

// 对比密码
let isPasswprdRight = pass.compare('password', hash);
```
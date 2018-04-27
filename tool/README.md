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
  // 将指定的context设为公共context，下载的时候打平到json，便于调用
  // {"com": {"a": 1, "b": 2}, "c": 3} => {"a": 1, "b": 2, "c": 3}
  flatContext: 'com', 
  ext: '.json',
  transform: function(data) { return data },
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
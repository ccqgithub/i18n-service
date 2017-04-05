/**
 * 重写
 *  配置参考：https://github.com/ccqgithub/koa-prerender-m
 */

var prerender = require('koa-prerender-m');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    prerender: 'http://prerender.github.com:8080/',
    username: 'test',
    password: '123456',
  }, options);

  app.use(prerender(options));

}

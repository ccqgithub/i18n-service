/**
 * 优化
 * 配置参考：
 * https://github.com/koajs/conditional-get
 * https://github.com/koajs/compress
 * https://github.com/koajs/etag
 **/

var conditional = require('koa-conditional-get');
var compress = require('koa-compress')
var etag = require('koa-etag');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    etag: true,
    compress: true,
  }, options);

  // compress
  if (options.compress) {
    app.use(function * (next) {
      this.compress = true;
      yield next;
    });
    app.use(compress({
      threshold: 2048,
      flush: require('zlib').Z_SYNC_FLUSH
    }));
  }

  // use it upstream from etag so
  // that they are present
  app.use(conditional());

  // add etags
  if (options.etag) {
    app.use(etag());
  }
  
}

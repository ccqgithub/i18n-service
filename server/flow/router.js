/**
 * 自动加载路由
 */

var path = require('path');
var fs = require('fs');

module.exports = function(app, options={}) {

  // options
  var options = Object.assign({
    dir: path.join(__dirname, '../router'),
    deep: true,
  }, options);

  function walk(p) {
    var dirList = fs.readdirSync(p);

    dirList.forEach(function(item) {
      var f = p + '/' + item;

      if (fs.statSync(f).isDirectory()) {
        options.deep && walk(p + '/' + item);
      } else if (fs.statSync(f).isFile()) {
        app.use(require(f).routes());
      }
    });
  }

  walk(options.dir);
}

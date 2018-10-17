// 自动加载路由
// 配置参考：
const path = require('path');
const fs = require('fs');

module.exports = function loadRouter(app, opts = {}) {
  const options = Object.assign(
    {
      dir: path.join(__dirname, '../router'),
      deep: true,
    },
    opts,
  );

  function walk(p) {
    let dirList = fs.readdirSync(p);

    dirList.forEach((item) => {
      let f = `${p}/${item}`;

      if (fs.statSync(f).isDirectory()) {
        if (options.deep) walk(`${p}/${item}`);
      } else if (fs.statSync(f).isFile()) {
        app.use(require(f).routes());
        app.use(require(f).allowedMethods());
      }
    });
  }

  walk(options.dir);
};
/**
 * 配置pm2发布
 */
const path = require('path');

const serverRoot = path.join(__dirname, '../src');
const prjConf = require('./project.conf');

/* ==== config start ==== */
const COMMON_CONF = {
  // server 的根目录
  cwd: serverRoot,
  // pm2 实例名称
  name: `${prjConf.name}-dev`,
  // server 入口
  script: path.join(serverRoot, './app.js'),
  // 是否watch，文件改动server重启
  watch: false,
  // 环境变量
  env: {},
  // error日志目录
  error_file: path.resolve(serverRoot, '../log/pm2.log'),
  // 日志目录
  out_file: path.join(serverRoot, '../log/pm2.log'),
  // 排除watch的文件
  ignore_watch: ['i18n'],
  // 合并日志
  combine_logs: true,
};

const ENV_CONF = {
  // dev
  dev: {
    name: `${prjConf.name}-dev`,
    watch: true,
  },
  // prod
  prod: {
    name: `${prjConf.name}-prod`,
    watch: false,
  },
};
/* ==== config end ==== */

// exports
module.exports = {
  apps: Object.keys(ENV_CONF).map((key) => {
    return Object.assign({}, COMMON_CONF, ENV_CONF[key]);
  }),
};

// console.log(module.exports.apps);
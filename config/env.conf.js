/**
 * 配置server端，不同发布环境的一些信息
 */

const APP_ENV = process.env.APP_ENV || 'dev';

/* ==== config start ==== */
const COMMON_CONF = {
  env: APP_ENV,
  debug: 'app:*',
};

const ENV_CONF = {
  // dev
  dev: {
    port: '50011',
    mongodbServer: 'mongodb://test:123456@127.0.0.1:27017/i18n-service',
    // login
    loginUser: 'admin',
    loginPass: '$2a$08$o.DiinIdVy6RiUx1gqkD2OPrCL14w0zoJb.NBYhEEJ3T1aAvvyMJa',
  },
  // prod
  prod: {
    port: '50011',
    mongodbServer: 'mongodb://test:123456@127.0.0.1:27017/i18n-service',
    // login
    loginUser: 'admin',
    loginPass: '$2a$08$o.DiinIdVy6RiUx1gqkD2OPrCL14w0zoJb.NBYhEEJ3T1aAvvyMJa',
  },
};
/* ==== config end ==== */

module.exports = Object.assign({}, COMMON_CONF, ENV_CONF[APP_ENV]);
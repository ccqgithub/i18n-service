"use strict"

/**
 * 主路由
 */

var os = require('os');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var router = require('koa-router')();
var debug = require('debug')('app:router-main');
var authLogin = require('../middleware/auth-login');

// 首页
router.get('/', authLogin(), function * (next) {
  yield this.render('index', this.state.locals);
});

// login
router.get('/login', function * (next) {
  yield this.render('login', this.state.locals);
});

// login
router.post('/api/login', function * (next) {
  var data = this.request.body;
  var sha1 = crypto.createHash('sha1');
  var password;

  sha1.update(data.password + 'ooxxxx');
  password = sha1.digest('hex');

  if (
    this.state.config.loginUser != data.username ||
    this.state.config.loginPass != password
  ) {
    this.throw('用户名或密码不对');
  }

  this.session.user = {id: data.username, username: data.username};
  this.state.result = this.session.user;
});

module.exports = router;

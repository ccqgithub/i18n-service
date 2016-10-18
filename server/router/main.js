"use strict"

/**
 * 主路由
 */

var os = require('os');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var parse = require('co-body');
var parseBus = require('co-busboy');
var router = require('koa-router')();
var send = require('koa-send');
var debug = require('debug')('app:router-main');

var storagePath = path.join(__dirname, '../storage');
var dirTool = require('../lib/dir');

// 首页
router.get('/', function * (next) {
  var sites = dirTool.getSubDirs(storagePath);
  this.state.locals.pageData = {
    sites: sites
  };
  yield this.render('index', this.state.locals);
});

module.exports = router;

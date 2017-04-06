"use strict"

/**
 * api
 */

var os = require('os');
var fs = require('fs');
var path = require('path');
var router = require('koa-router')();

// 首页
router.get('/api/query', function * (next) {
  var client = this.request.query.client;
  var context = this.request.query.context;

  yield this.render('index', this.state.locals);
});

module.exports = router;

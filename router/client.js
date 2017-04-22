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
var LocaleService = require('../service/locale-service');

// mark
router.get('/client/mark', function * (next) {
  var site = this.request.query.site;
  var locale = this.request.query.locale;
  var context = this.request.query.context;
  var key = this.request.query.key;
  var exist = LocaleService.checkExist(this, site, locale);

  if (!exist) {
    this.throw('locale not exist');
  }

  var result = yield LocaleService.mark(this, {
    site: site.trim(),
    locale: locale.trim(),
    context: context.trim(),
    key: key.trim(),
  });

  this.body = {status: 200};
});

// js
router.get('/client/js', function * (next) {
  var site = decodeURIComponent(this.request.query.site);
  var locale = decodeURIComponent(this.request.query.locale);
  var varName = decodeURIComponent(this.request.query.varname);
  var result = yield LocaleService.getJson(this, site, locale);

  this.set('Content-type', 'application/javascript;charset=utf-8');
  this.body = `window['${varName}']=${JSON.stringify(result, null, 2)}`;
});

// json
router.get('/client/json', function * (next) {
  var site = this.request.query.site;
  var locale = this.request.query.locale;
  var result = yield LocaleService.getJson(this, site, locale);

  this.body = {
    status: 200,
    result: result
  };
});

module.exports = router;

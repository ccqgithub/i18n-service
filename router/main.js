var os = require('os');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcryptjs');
var router = require('koa-router')();
var debug = require('debug')('app:router-main');
var authLogin = require('../middleware/auth-login');
var LocaleService = require('../service/locale-service');

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
  var hash = this.state.config.loginPass;
  var isPasswordRight = bcrypt.compare(data.password, hash);

  if (
    this.state.config.loginUser != data.username ||
    !isPasswordRight
  ) {
    this.throw('用户名或密码不对');
  }

  this.session.user = {id: data.username, username: data.username};
  this.state.result = this.session.user;
});

// siteList
router.get('/api/sites', authLogin(), function * (next) {
  this.state.result = yield LocaleService.siteList(this);
});

// localeList
router.get('/api/locales', authLogin(), function * (next) {
  var site = this.request.query.site;
  this.state.result = yield LocaleService.siteLocaleList(this, site);
});

// contexts
router.get('/api/contexts', authLogin(), function * (next) {
  var site = this.request.query.site;
  var locale = this.request.query.locale;
  this.state.result = yield LocaleService.siteLocaleContextList(this, site, locale);
});

// translates
router.get('/api/translates', authLogin(), function * (next) {
  this.state.result = yield LocaleService.siteLocaleTranslateList(this, this.request.query);
});

// import json
router.post('/api/importJson', authLogin(), function * (next) {
  var site = this.request.body.site;
  var locale = this.request.body.locale;
  var data = this.request.body.data;

  this.state.result = yield LocaleService.importJson(this, site, locale, JSON.parse(data));
});

// edit item
router.post('/api/editItem', authLogin(), function * (next) {
  var _id = this.request.body._id;
  var value = this.request.body.value;

  this.state.result = yield LocaleService.editItem(this, {
    _id: _id,
    value: value,
  });
});

// delete item
router.post('/api/deleteItem', authLogin(), function * (next) {
  var _id = this.request.body._id;
  this.state.result = yield LocaleService.deleteItem(this, _id);
});

// add item
router.post('/api/addItem', authLogin(), function * (next) {
  var data = this.request.body;
  this.state.result = yield LocaleService.addNewItem(this, data);
});

// add locale
router.post('/api/addLocale', authLogin(), function * (next) {
  var data = this.request.body;
  this.state.result = yield LocaleService.addLocale(this, data);
});

// 导出
router.get('/api/exportJson', authLogin(), function * (next) {
  var site = this.request.query.site;
  var locale = this.request.query.locale;
  var result = yield LocaleService.getJson(this, site, locale);

  this.set('Content-disposition', `${site}-${locale}-locale.json`);
  this.set('Content-type', 'application/json;charset=utf-8');
  this.body = JSON.stringify(result, null, 2);
});

module.exports = router;

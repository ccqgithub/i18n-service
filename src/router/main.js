const bcrypt = require('bcryptjs');
const router = require('koa-router')();
const authLogin = require('../middleware/auth-login');
const LocaleService = require('../service/locale-service');

// 首页
router.get('/', authLogin(), async (ctx, next) => {
  await ctx.render('index', ctx.state.locals);
  ctx.state.result = 'ok';
});

// login
router.get('/login', async (ctx, next) => {
  await ctx.render('login', ctx.state.locals);
  ctx.state.result = 'ok';
});

// login
router.post('/api/login', async (ctx, next) => {
  let data = ctx.request.body;
  let hash = ctx.state.config.loginPass;
  let isPasswordRight = bcrypt.compare(data.password, hash);

  if (
    ctx.state.config.loginUser != data.username ||
    !isPasswordRight
  ) {
    ctx.throw('用户名或密码不对');
  }

  ctx.session.user = {id: data.username, username: data.username};
  ctx.state.result = ctx.session.user;
});

// siteList
router.get('/api/sites', authLogin(), async (ctx, next) => {
  ctx.state.result = await LocaleService.siteList(ctx);
});

// localeList
router.get('/api/locales', authLogin(), async (ctx, next) => {
  let site = ctx.request.query.site;
  ctx.state.result = await LocaleService.siteLocaleList(ctx, site);
});

// contexts
router.get('/api/contexts', authLogin(), async (ctx, next) => {
  let site = ctx.request.query.site;
  let locale = ctx.request.query.locale;
  ctx.state.result = await LocaleService.siteLocaleContextList(ctx, site, locale);
});

// translates
router.get('/api/translates', authLogin(), async (ctx, next) => {
  ctx.state.result = await LocaleService.siteLocaleTranslateList(ctx, ctx.request.query);
});

// import json
router.post('/api/importJson', authLogin(), async (ctx, next) => {
  let site = ctx.request.body.site;
  let locale = ctx.request.body.locale;
  let data = ctx.request.body.data;

  ctx.state.result = await LocaleService.importJson(ctx, site, locale, JSON.parse(data));
});

// edit item
router.post('/api/editItem', authLogin(), async (ctx, next) => {
  let _id = ctx.request.body._id;
  let value = ctx.request.body.value;

  ctx.state.result = await LocaleService.editItem(ctx, {
    _id: _id,
    value: value,
  });
});

// delete item
router.post('/api/deleteItem', authLogin(), async (ctx, next) => {
  let _id = ctx.request.body._id;
  ctx.state.result = await LocaleService.deleteItem(ctx, _id);
});

// add item
router.post('/api/addItem', authLogin(), async (ctx, next) => {
  let data = ctx.request.body;
  ctx.state.result = await LocaleService.addNewItem(ctx, data);
});

// add locale
router.post('/api/addLocale', authLogin(), async (ctx, next) => {
  let data = ctx.request.body;
  ctx.state.result = await LocaleService.addLocale(ctx, data);
});

// 导出
router.get('/api/exportJson', authLogin(), async (ctx, next) => {
  let site = ctx.request.query.site;
  let locale = ctx.request.query.locale;
  let result = await LocaleService.getJson(ctx, site, locale);

  ctx.set('Content-disposition', `attachment; filename="${site}-${locale}-locale.json"`);
  ctx.set('Content-type', 'application/json;charset=utf-8');
  ctx.body = JSON.stringify(result, null, 2);
});

module.exports = router;

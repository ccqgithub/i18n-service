/**
 * 主路由
 */

const router = require('koa-router')();
const LocaleService = require('../service/locale-service');

// mark
router.get('/client/mark', async (ctx, next) => {
  let site = ctx.request.query.site;
  let locale = ctx.request.query.locale;
  let context = ctx.request.query.context;
  let key = ctx.request.query.key;
  let exist = LocaleService.checkExist(ctx, site, locale);

  if (!exist) {
    ctx.throw('locale not exist');
  }

  await LocaleService.mark(ctx, {
    site: site.trim(),
    locale: locale.trim(),
    context: context.trim(),
    key: key.trim(),
  });

  ctx.body = {status: 200};
});

// js
router.get('/client/js', async (next) => {
  let site = decodeURIComponent(ctx.request.query.site);
  let locale = decodeURIComponent(ctx.request.query.locale);
  let varName = decodeURIComponent(ctx.request.query.varname);
  let result = await LocaleService.getJson(ctx, site, locale);

  ctx.set('Content-type', 'application/javascript;charset=utf-8');
  ctx.body = `window['${varName}']=${JSON.stringify(result, null, 2)}`;
});

// json
router.get('/client/json', async (next) => {
  let site = ctx.request.query.site;
  let locale = ctx.request.query.locale;
  let result = await LocaleService.getJson(ctx, site, locale);

  ctx.body = {
    status: 200,
    result: result
  };
});

module.exports = router;

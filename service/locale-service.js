var mongoose = require('mongoose');
var co = require('co');
var LocaleSchema = require('../db/schema/locale');

var LocaleService = module.exports = {};

// 标注未识别翻译
LocaleService.mark = co.wrap(function * (app, data) {
  var connection = mongoose.createConnection(app.state.config.mongoServer);
  var LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  var find = yield LocaleModel.findOne({
    $and: [
      { site: { $eq: data.site } },
      { locale: { $eq: data.locale } },
      { context: { $eq: data.context } },
      { key: { $eq: data.key } }
    ]
  }).exec();

  if (find) return true;

  var result = yield LocaleModel.create({
    site: data.site,
    locale: data.locale,
    context: data.context,
    key: data.key,
    value: '',
  });

  return true;
});

// 获取站点列表
LocaleService.siteList = co.wrap(function * (app) {
  var connection = mongoose.createConnection(app.state.config.mongoServer);
  var LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  var sites = yield LocaleModel.distinct('site').exec();

  return sites;
});


// 获取某一站点的语言列表
LocaleService.siteLocaleList = co.wrap(function * (app, site) {
  var connection = mongoose.createConnection(app.state.config.mongoServer);
  var LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  var locales = yield LocaleModel.distinct('locale', {site: site}).exec();

  return locales;
});

// 获取某一站点的语言列表
LocaleService.siteLocaleContextList = co.wrap(function * (app, site, locale) {
  var connection = mongoose.createConnection(app.state.config.mongoServer);
  var LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  var contexts = yield LocaleModel.distinct('context', {
    site: site,
    locale: locale,
  }).exec();

  return contexts;
});

// 获取某一站点，某一语言的所有翻译
// site, locale, type, context, keyword
LocaleService.siteLocaleTranslateList = co.wrap(function * (app, params) {
  var connection = mongoose.createConnection(app.state.config.mongoServer);
  var LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  var search = [
    { site: { $eq: params.site } },
    { locale: { $eq: params.locale } },
  ];

  if (params.type == 'TRANSLATED') {
    search.push({ value: { $ne: '' } });
  } else if (params.type == 'NOT_TRANSLATED') {
    search.push({ value: { $eq: '' } });
  }

  if (params.context) {
    search.push({ context: { $eq: params.context } });
  }

  if (params.keyword) {
    search.push({
      $where: `this.key.indexOf('${params.keyword}') != -1 || this.value.indexOf('${params.keyword}') != -1`
    });
  }

  var translates = yield LocaleModel.find({
    $and: search
  }).exec();

  return translates;
});

// 保存item
LocaleService.editItem = co.wrap(function * (app, data) {
  var connection = mongoose.createConnection(app.state.config.mongoServer);
  var LocaleModel = connection.model('Locale', LocaleSchema, 'locale');

  var updateResult = yield LocaleModel.update({
    _id: data._id
  }, {
    value: data.value
  }).exec();

  return true;
});

// 删除item
LocaleService.deleteItem = co.wrap(function * (app, id) {
  var connection = mongoose.createConnection(app.state.config.mongoServer);
  var LocaleModel = connection.model('Locale', LocaleSchema, 'locale');

  var updateResult = yield LocaleModel.deleteOne({
    _id: id
  }).exec();

  return true;
});

// 添加item
LocaleService.addNewItem = co.wrap(function * (app, data) {
  var connection = mongoose.createConnection(app.state.config.mongoServer);
  var LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  var find = yield LocaleModel.findOne({
    $and: [
      { site: { $eq: data.site } },
      { locale: { $eq: data.locale } },
      { context: { $eq: data.context } },
      { key: { $eq: data.key } }
    ]
  }).exec();

  if (find) {
    throw new Error('内容已存在！');
  };

  var result = yield LocaleModel.create({
    site: data.site,
    locale: data.locale,
    context: data.context,
    key: data.key,
    value: data.value,
  });

  return result;
});

// 获取某一站点，某一语言的所有翻译
LocaleService.getJson = co.wrap(function * (app, site, locale) {
  var connection = mongoose.createConnection(app.state.config.mongoServer);
  var LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  var result = {};
  var translates = yield LocaleModel.find({
    $and: [
      { site: { $eq: site } },
      { locale: { $eq: locale } },
    ]
  }).exec();

  translates.forEach(function(item) {
    if (!result[item.context]) result[item.context] = {};
    result[item.context][item.key] = item.value;
  });

  return result;
});

// 导入json
LocaleService.importJson = co.wrap(function * (app, site, locale, data) {
  var connection = mongoose.createConnection(app.state.config.mongoServer);
  var LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  var sources = [];
  var exists = [];
  var inserts = [];
  var updates = [];
  var existsObj = {};

  Object.keys(data).forEach(function(context) {
    var obj = data[context];
    Object.keys(obj).forEach(function(key) {
      var value = obj[key];
      sources.push({
        site: site,
        locale: locale,
        context: context,
        key: key,
        value: value,
      });
    });
  });

  // exists
  exists =  yield LocaleModel.find({
    $and: [
      { site: { $eq: site } },
      { locale: { $eq: locale } },
    ]
  }).exec();

  exists.forEach(function(item) {
    if (!existsObj[item.context]) existsObj[item.context] = {};
    existsObj[item.context][item.key] = item;
  });

  sources.forEach(function(item) {
    if (existsObj[item.context] && existsObj[item.context][item.key]) {
      updates.push({
        source: item,
        exist: existsObj[item.context][item.key],
      });
    } else {
      inserts.push(item);
    }
  });

  // inserts
  var insertResult = yield LocaleModel.create(inserts);

  // updates
  for (var i = 0, l = updates.length; i < l; i++) {
    var updateResult = yield LocaleModel.update({
      _id: updates[i].exist._id
    }, updates[i].source).exec();
  }

  return true;
});

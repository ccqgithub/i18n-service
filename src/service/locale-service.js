const LocaleSchema = require('../db/schema/locale');

const LocaleService = module.exports = {};

// check exists
LocaleService.checkExist = async (app, site, locale) => {
  const connection = await app.getDB();
  const LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  let find = await LocaleModel.findOne({
    $and: [
      { site: { $eq: site } },
      { locale: { $eq: locale } },
    ]
  }).exec();

  return !!find;
};

// 标注未识别翻译
LocaleService.mark = async (app, data) => {
  let connection = await app.getDB();
  let LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  let find = await LocaleModel.findOne({
    $and: [
      { site: { $eq: data.site } },
      { locale: { $eq: data.locale } },
      { context: { $eq: data.context } },
      { key: { $eq: data.key } }
    ]
  }).exec();

  if (find) return true;

  let result = await LocaleModel.create({
    site: data.site,
    locale: data.locale,
    context: data.context,
    key: data.key,
    value: '',
  });

  return true;
};

// 获取站点列表
LocaleService.siteList = async (app) => {
  let connection = await app.getDB();
  let LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  let sites = await LocaleModel.distinct('site').exec();

  return sites;
};

// 获取某一站点的语言列表
LocaleService.siteLocaleList = async (app, site) => {
  let connection = await app.getDB();
  let LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  let locales = await LocaleModel.distinct('locale', {site: site}).exec();

  return locales;
};

// 获取某一站点的语言列表
LocaleService.siteLocaleContextList = async (app, site, locale) => {
  let connection = await app.getDB();
  let LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  let contexts = await LocaleModel.distinct('context', {
    site: site,
    locale: locale,
  }).exec();

  return contexts;
};

// 获取某一站点，某一语言的所有翻译
// site, locale, type, context, keyword
LocaleService.siteLocaleTranslateList = async (app, params) => {
  let connection = await app.getDB();
  let LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  let search = [
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

  let translates = await LocaleModel.find({
    $and: search
  }).exec();

  return translates;
};

// 保存item
LocaleService.editItem = async (app, data) => {
  let connection = await app.getDB();
  let LocaleModel = connection.model('Locale', LocaleSchema, 'locale');

  let updateResult = await LocaleModel.update({
    _id: data._id
  }, {
    value: data.value
  }).exec();

  return true;
};

// 删除item
LocaleService.deleteItem = async (app, id) => {
  let connection = await app.getDB();
  let LocaleModel = connection.model('Locale', LocaleSchema, 'locale');

  let updateResult = await LocaleModel.deleteOne({
    _id: id
  }).exec();

  return true;
};

// 添加item
LocaleService.addNewItem = async (app, data) => {
  let connection = await app.getDB();
  let LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  let find = await LocaleModel.findOne({
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

  let result = await LocaleModel.create({
    site: data.site,
    locale: data.locale,
    context: data.context,
    key: data.key,
    value: data.value,
  });

  return result;
};

// 添加 locale
LocaleService.addLocale = async (app, data) => {
  let connection = await app.getDB();
  let LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  let find = await LocaleModel.findOne({
    $and: [
      { site: { $eq: data.site } },
      { locale: { $eq: data.locale } },
    ]
  }).exec();

  if (find) {
    throw new Error('语言已存在！');
  };

  let result = await LocaleModel.create({
    site: data.site,
    locale: data.locale,
    context: 'test',
    key: 'test',
    value: 'test',
  });

  return result;
};


// 获取某一站点，某一语言的所有翻译
LocaleService.getJson = async (app, site, locale) => {
  let connection = await app.getDB();
  let LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  let result = {};
  let translates = await LocaleModel.find({
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
};

// 导入json
LocaleService.importJson = async (app, site, locale, data) => {
  let connection = await app.getDB();
  let LocaleModel = connection.model('Locale', LocaleSchema, 'locale');
  let sources = [];
  let exists = [];
  let inserts = [];
  let updates = [];
  let existsObj = {};

  Object.keys(data).forEach(function(context) {
    let obj = data[context];
    Object.keys(obj).forEach(function(key) {
      let value = obj[key];
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
  exists =  await LocaleModel.find({
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
  let insertResult = await LocaleModel.create(inserts);

  // updates
  for (var i = 0, l = updates.length; i < l; i++) {
    let updateResult = await LocaleModel.update({
      _id: updates[i].exist._id
    }, updates[i].source).exec();
  }

  return true;
};

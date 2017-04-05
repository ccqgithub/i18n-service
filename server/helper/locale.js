var path = require('path');
var fs = require('fs');

/**
 * 本地化翻译
 */
var LocaleHelper = function(localeDir, files, lang) {
  var self = this;

  // langSets
  this.langSet = {};

  files.forEach(function(item) {
    var file = path.join(localeDir, lang, item + '.json');
    var str = fs.readFileSync(file, 'utf-8');
    var obj = JSON.parse(str.trim());

    Object.keys(obj).forEach(function(ctx) {
      var set = obj[ctx];

      if (!self.langSet[ctx]) self.langSet[ctx] = {};

      Object.keys(set).forEach(function(msgid) {
        self.langSet[ctx][msgid] = set[msgid];
      });
    });
  });
}

LocaleHelper.prototype = {
  // 获取语言资源
  getLangSet: function() {
    return this.langSet;
  },

  // 替换变量
  formatString: function(string, vars) {
    var vars = vars || {};
    Object.keys(vars).forEach(function(key) {
      string = string.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), vars[key]);
    });
    return string;
  },

  // 搜索翻译
  searchTranslate: function(msgid, msgctxt) {
    var
      self = this,
      set,
      find;

    set = this.langSet;

    Object.keys(set).forEach(function(ctx) {
      var obj = set[ctx];
      Object.keys(obj).forEach(function(id) {
        if (msgctxt == ctx && msgid == id) {
          find = obj[id];
        }
      });
    });

    // 没找到翻译返回id
    if (!find) {
      console.log('未翻译：' + msgctxt + ', ' + msgid);
      find = msgid;
    }

    return find;
  },

  // 翻译函数
  i18n: function(msgid, msgctxt, params) {
    var msgctxt = msgctxt || 'com';
    var params = params || {};
    var lang = lang || 'zh-cn';
    var rst = this.searchTranslate(msgid, msgctxt);

    if (Array.isArray(rst)) {
      rst = rst.map(function(item) {
        return this.formatString(item, params);
      });
    } else {
      rst = this.formatString(rst, params);
    }

    return rst;
  }
}

module.exports = LocaleHelper;

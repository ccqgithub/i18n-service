var path = require('path');
var fs = require('fs');

/**
 config:
 {
   locale: 'en-us'
 }
 */
var Mock = function(options) {
  this.mockDir = options.mockDir;
  this.locale = options.locale || '';
}

Mock.prototype = {
  get: function(name) {
    var file = path.join(this.mockDir, this.locale, name + '.json');
    return require(file);
  }
}

module.exports = Mock;

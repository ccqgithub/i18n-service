var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocaleSchema = new Schema({
  site: String,
  locale: String,
  context: String,
  key: String,
  value: String,
});

module.exports = LocaleSchema;

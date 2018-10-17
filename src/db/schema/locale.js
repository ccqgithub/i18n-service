const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocaleSchema = new Schema({
  site: String,
  locale: String,
  context: String,
  key: String,
  value: String,
});

module.exports = LocaleSchema;

var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var dbFile = path.join(__dirname, '../db/i18n.db');
var db = new sqlite3.Database(dbFile);

var initSql = `
  CREATE TABLE i18n (
    client VARCHAR(255),
    locale VARCHAR(255),
    context VARCHAR(255),
    key TEXT,
    value TEXT,
    fallback TEXT
  )
`;

db.run(initSql, {}, function(err, result) {
  if (err) {
    return console.error(err);
  }
  db.close();
  console.log(result);
});

var crypto = require('crypto');
var program = require('commander');

program
  .option('--pass [pass]', 'password')
  .parse(process.argv);

var sha1 = crypto.createHash('sha1');

sha1.update(program.pass + 'ooxxxx');

console.log(program.pass);
console.log(sha1.digest('hex'));

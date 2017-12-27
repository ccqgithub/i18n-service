var pass = require('i18n-service-tool/pass');
var program = require('commander');

program
  .option('--pass [pass]', 'password')
  .parse(process.argv);

var hash = pass.generate(program.pass, 8);

console.log(program.pass);
console.log(hash);

var program = require('commander');
var run = require('./lib');

// 参数
program
  .option('--env [env]', 'Specify the env(local by default)')
  .option('--watch [watch]', 'Specify the watch(false by default)')
  .parse(process.argv);

run(program.env || 'local', program.watch)

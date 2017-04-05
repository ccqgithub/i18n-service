var pm2 = require('pm2');
var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs');
var childProcess = require('child_process');

var serverDir = path.join(__dirname, '../');
var config = yaml.load(
  fs.readFileSync(path.join(serverDir, '../config.yaml'), 'utf8')
);

function run(env, watch, callback) {
  var name = config[env].serverName || 'koa-site-server';

  // install pacakgers
  console.log('==>>server: npm install start...');
  childProcess.execSync('npm install', {
    stdio: 'inherit',
    cwd: serverDir,
  });
  console.log('==>>server: npm install success...');

  console.log('==>>server: pm2 start...');
  pm2.connect(function(err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    pm2.delete(name, function(err, apps) {
      if (err) {
        console.error(err);
      }

      pm2.start({
        name: name,
        script: path.join(serverDir, 'app.js'),
        // exec_mode: 'cluster',
        // instances: 4,
        max_memory_restart: '100M',
        output: 'log/pm2.log',
        mergeLogs: true,
        watch: watch,
        ignore_watch: ['log/**'],
        args: '--env ' + env,
        cwd: serverDir,
      }, function(err, apps) {
        if (err) throw err;

        pm2.list(function(err, processDescriptionList) {
          pm2.disconnect();
          console.log('==>>server: pm2 success...');
          callback && callback();
          if (err) throw err
        });
      });
    });
  });
}

module.exports = run;

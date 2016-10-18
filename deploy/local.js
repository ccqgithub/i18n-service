var childProcess = require('child_process');
var program = require('commander');
var path = require('path');
var fs = require('fs');

var projectPath = path.join(__dirname, '../');

// 创建目录
function mkdirsSync(dirname, mode) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname), mode)) {
      fs.mkdirSync(dirname, mode);
      return true;
    }
  }
}

function stopServer() {
  var fisCommand = 'pm2 delete i18n-service';
  var child;

  try {
    child = childProcess.execSync(fisCommand, {
      stdio: 'inherit'
    });
  } catch (e) {
    console.log(e.message);
  }
}

// 启动pm2
function startServer() {
  var serverJs = path.join(projectPath, 'server/app.js');
  var logFile = path.join(projectPath, 'server/log/pm2.log');
  var fisCommand = 'pm2 start '+ serverJs +' --name i18n-service -f --log='+ logFile + ' -- ' + '--env local';
  var child;

  mkdirsSync(path.dirname(logFile));
  child = childProcess.execSync(fisCommand, {
    stdio: 'inherit'
  });
}

// release
function release() {
  var child = childProcess.spawn('fis3', [
    'release', 'local', '-c', '-w'
  ], {stdio: 'inherit'});
}

stopServer();
startServer();
release();

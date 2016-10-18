var fs = require('fs');
var path = require('path');
var dir = module.exports = {};

// 获取子目录
dir.getSubDirs = function(p) {
  var dirs = [];
  var dirList = fs.readdirSync(p);
	dirList.forEach(function(item){
		if(fs.statSync(p + '/' + item).isDirectory()){
			dirs.push(item);
		}
	});
  return dirs;
}

// 获取文件列表
dir.getSubFiles = function(p) {
  var files = [];
  var dirList = fs.readdirSync(p);
	dirList.forEach(function(item){
		if(!fs.statSync(p + '/' + item).isDirectory()){
			files.push(item);
		}
	});
  return files;
}

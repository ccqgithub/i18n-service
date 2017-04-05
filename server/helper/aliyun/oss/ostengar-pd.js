var ALY = require('aliyun-sdk');
var uploadStream = require('./upload-stream');
var debug = require('debug')('app:oss');

var bucketName = 'bucket-name';
var accessKeyId = 'access-key-id';
var secretAccessKey = 'secret-access-key';
var endpoint = 'http://oss-cn-hangzhou.aliyuncs.com';
var imgServer = 'http://bucket-name.img-cn-hangzhou.aliyuncs.com';

// oss cient
exports.client = function() {
    var oss = new ALY.OSS({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        endpoint: endpoint,
        apiVersion: '2013-10-15'
    });

    return oss;
}

// 初始化bucket
exports.createBucket = function() {
    var oss = exports.client();
    return new Promise(function(resolve, reject) {
        oss.createBucket({
            Bucket: bucketName
        }, function(err, data) {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
}

// getBucketAcl
exports.getBucketAcl = function() {
    var oss = exports.client();
    return new Promise(function(resolve, reject) {
        oss.getBucketAcl({
            Bucket: bucketName
        }, function(err, data) {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
}

// getBucketAcl
exports.putBucketAcl = function() {
    var oss = exports.client();
    return new Promise(function(resolve, reject) {
        oss.putBucketAcl({
            Bucket: bucketName,
            ACL: 'public-read'
        }, function(err, data) {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
}

// 列出
exports.listBuckets = function() {
    var oss = exports.client();
    return new Promise(function(resolve, reject) {
        oss.listBuckets(function(err, data) {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
}


exports.uploadStream = function(stream, filename, mime) {
    var oss = exports.client();
    var ossStream = uploadStream(oss);

    return new Promise(function(resolve, reject) {
        var startTime = new Date();
        var upload = ossStream.upload({
            ACL: 'public-read',
            Bucket: bucketName,
            Key: filename,
            ContentType: mime,
            // ContentDisposition: ''
            //CacheControl: '',
            //ContentEncoding: '',
            //Expires: '',
            //ServerSideEncryption: ''
        });

        upload.on('error', function(error) {
            debug('upload error: %s', error);
            reject(error);
        });

        upload.on('part', function(part) {
            debug('part: %s', part);
        });

        upload.on('uploaded', function(details) {
            var s = (new Date() - startTime) / 1000;
            debug('upload success: %s', details);
            debug('upload total time: %s', s);
            resolve(details);
        });

        stream.pipe(upload);
    });
}

// 获取图片地址
exports.getImgUrl = function(filename) {
    return imgServer + '/' + filename;
}

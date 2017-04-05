'use strict'

/**
 * API基类
 */

var debug = require('debug')('app:api-hub');
var crypto = require('crypto');
var request = require('request');
var ServerError = require('../../lib/server-error');

/**
 config:
 {
   server: '',
   locale: '',
   token: ''
 }
 */
var API = function(config) {
  var localeMap = {
    'en': 'en_US',
    'zh-cn': 'zh_CN'
  }

  this.config = config || {};
  this.server = this.config['server'];
  this.locale = localeMap[this.config['locale']];
  this.token = this.config['token'];
}

API.prototype = {
  _buildParams: function(name, params) {
    return params;
  },

  parseResponse: function(error, response, result, name) {
    var headers = {};

    if (error) {
      console.log('接口请求错误: ' + name);
      console.log(response.statusCode);
      console.log(error);
      return {
        status: 1,
        result: new ServerError('接口错误:' + error, response.statusCode)
      }
    }

    if (response.statusCode == 404) {
      console.log('接口不存在: ' + name);
      return {
        status: 1,
        result: new ServerError('接口错误：可能在部署，稍后再试', response.statusCode)
      }
    }

    if (response.statusCode != 200) {
      console.log('HUB接口请求错误: ' + name);
      console.log(response.statusCode);
      return {
        status: 1,
        result: new ServerError('接口错误: ' + response.statusCode, response.statusCode)
      }
    }

    if (!result || !result.code) {
      console.log('接口返回格式错误: ' + name);
      console.log(response.statusCode);
      console.log(result);
      return {
        status: 1,
        result: new ServerError('接口错误: 返回格式不正确', response.statusCode)
      }
    }

    if (result.code != 200) {
      return {
        status: 1,
        result: new ServerError(result.msg || '接口错误：未知错误', result.code)
      }
    }

    ['header_security_token'].forEach(function(key) {
      headers[key] = response.headers[key];
    });

    return {
      status: 0,
      result: {
        result: result.result,
        headers: headers
      }
    }
  },

  /**
   * get请求 结果json
   * @param  {[type]} name   [description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  get: function(name, params) {
    var self = this;

    params = this._buildParams(name, params);

    return new Promise(function(resolve, reject) {
      request({
        baseUrl: self.server,
        url: name,
        method: 'GET',
        qs: params,
        json: true,
        headers: {
          'Locale': self.locale,
          'HEADER_SECURITY_TOKEN': self.token
        }
      }, function(error, response, result) {
        var data = self.parseResponse(error, response, result, name);
        if (data.status == 1) {
          return reject(data.result);
        }
        resolve(data.result);
      });
    });
  },

  /**
   * post 请求，body为json字符串， 结果json
   * @param  {[type]} name   [description]
   * @param  {[type]} params [description]
   * @param  {[type]} data   [description]
   * @return {[type]}        [description]
   */
  post: function(name, params, data) {
    var self = this;

    params = this._buildParams(name, params);

    return new Promise(function(resolve, reject) {
      request({
        baseUrl: self.server,
        url: name,
        method: 'POST',
        qs: params,
        body: data,
        json: true,
        headers: {
          'Locale': self.locale,
          'HEADER_SECURITY_TOKEN': self.token
        }
      }, function(error, response, result) {
        var data = self.parseResponse(error, response, result, name);
        if (data.status == 1) {
          return reject(data.result);
        }
        resolve(data.result);
      });
    });
  },

  /**
   * form 请求，结果json
   * Content-type: application/x-www-form-urlencoded
   * @param  {[type]} name   [description]
   * @param  {[type]} params [description]
   * @param  {[type]} data   [description]
   * @return {[type]}        [description]
   */
  form: function(name, params, data) {
    var self = this;

    params = this._buildParams(name, params);

    return new Promise(function(resolve, reject) {
      request({
        baseUrl: self.server,
        url: name,
        method: 'POST',
        qs: params,
        form: data,
        json: true,
        headers: {
          'Locale': self.locale,
          'HEADER_SECURITY_TOKEN': self.token
        }
      }, function(error, response, result) {
        var data = self.parseResponse(error, response, result, name);
        if (data.status == 1) {
          return reject(data.result);
        }
        resolve(data.result);
      });
    });
  }
}

module.exports = API;

// 自定义error 对象 处理exception


// ServiceError
function ServiceError(message, status, expose) {
  this.message = message;
  this.status = status || -1;
  this.expose = expose || {};
  this.stack = (expose && expose.stack) || (new Error).stack;
}

ServiceError.prototype = {
  toString: function() {
    return this.message + '; ' + this.status + '; ' + this.expose() + '; ' + this.stack;
  }
}

module.exports = ServiceError;

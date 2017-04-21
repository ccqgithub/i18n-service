(function(window, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    window.I18nService.signature = factory();
  }
})(this, function() {
  //module ...
});

var Vue = require('vue');
var $ = require('jquery');

var app = new Vue({
  el: '#app',
  data: function() {
    return {
      sites: window.pageData.sites
    }
  }
});

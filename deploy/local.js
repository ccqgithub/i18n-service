var server = require('../server/deploy/lib');

var env = 'local';
var watch = true;

server(env, watch, function() {
  fe(env, watch);
});

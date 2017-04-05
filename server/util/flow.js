var fs = require('fs');
var path = require('path');
var flowDir = path.join(__dirname, '../flow/');

/**
 * 加载app flow
 * flow(this.app, [
 *   {
 *     flow: 'error',
 *     options: {
 *       //
 *     }
 *   }
 * ]);
 */
module.exports = function(app, flows=[]) {
  flows.forEach(function(item) {
    var flow = path.join(flowDir, item.flow);
    require(flow)(app, item.options || []);
  });
}

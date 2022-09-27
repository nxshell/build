/*var fs = require('fs'),
    path = require('path');

['server', 'client', 'Agents'].forEach(function(f) {
  var exp = require(__dirname + '/lib/' + f),
      keys = Object.keys(exp);
  for (var i = 0, len = keys.length; i < len; ++i)
    exports[keys[i]] = exp[keys[i]];
});

exports.auth = {};

fs.readdirSync(__dirname + '/lib/auth').forEach(function(f) {
  exports.auth[path.basename(f, '.js')] = require(__dirname + '/lib/auth/' + f);
});
*/

const server = require('./lib/server');
const auth = require('./lib/auth/None');

module.exports = {
  auth: {'None': auth},
  createServer: server.createServer
}


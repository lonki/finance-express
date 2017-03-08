var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 8080;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
port = process.env.OPENSHIFT_NODEJS_PORT || port;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'crawler-express'
    },
    port: port,
    ip: ipaddress
  },

  test: {
    root: rootPath,
    app: {
      name: 'crawler-express'
    },
    port: port,
    ip: ipaddress
  },

  production: {
    root: rootPath,
    app: {
      name: 'crawler-express'
    },
    port: port,
    ip: ipaddress
  }
};

module.exports = config[env];

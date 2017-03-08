var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';
var server_port = process.env.PORT || 8080;
var server_ip_address = process.env.IP || '0.0.0.0';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'crawler-express'
    },
    port: server_port,
    ip: server_ip_address
  },

  test: {
    root: rootPath,
    app: {
      name: 'crawler-express'
    },
    port: server_port,
    ip: server_ip_address
  },

  production: {
    root: rootPath,
    app: {
      name: 'crawler-express'
    },
    port: server_port,
    ip: server_ip_address
  }
};

module.exports = config[env];

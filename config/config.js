var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 8080;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'crawler-express'
    },
    port: port
  },

  test: {
    root: rootPath,
    app: {
      name: 'crawler-express'
    },
    port: port
  },

  production: {
    root: rootPath,
    app: {
      name: 'crawler-express'
    },
    port: port
  }
};

module.exports = config[env];

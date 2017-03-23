var express = require('express'),
  config = require('./config/config');

var app = express();

module.exports = require('./config/express')(app, config);

app.listen(config.port, config.ip, function () {

  console.log("Listening to " + config.ip + ":" + config.port + "...");
});


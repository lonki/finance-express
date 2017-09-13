var express = require('express');
var glob = require('glob');
var cors = require('cors');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');

module.exports = function(app, config, linebot) {
  var bot = linebot({
    channelId: config.lineBot.id,
    channelSecret: config.lineBot.secret,
    channelAccessToken: config.lineBot.accessToken,
    verify: config.lineBot.verify
  });
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.set('views', config.root + 'client/views');
  app.set('view engine', 'ejs');
  app.set('json spaces', 2);

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json({
    verify: function (req, res, buf, encoding) {
      req.rawBody = buf.toString(encoding);
    }
  }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  if (env === 'development') {
    app.use(cors());
  }

  var controllers = glob.sync(config.root + '/server/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  var lineControllers = glob.sync(config.root + '/server/lineControllers/*.js');
  lineControllers.forEach(function (controller) {
    require(controller)(app, bot);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

  // handle all uncaught exceptions
  // see - https://nodejs.org/api/process.html#process_event_uncaughtexception
  process.on('uncaughtException', err => console.error('uncaught exception:', err));
  // handle all unhandled promise rejections
  // see - http://bluebirdjs.com/docs/api/error-management-configuration.html#global-rejection-events
  // or for latest node - https://nodejs.org/api/process.html#process_event_unhandledrejection
  process.on('unhandledRejection', error => console.error('unhandled rejection:', error));

  return app;
};

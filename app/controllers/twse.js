var express = require('express'),
  router = express.Router(),
  ParseTWSE = require('../models/parseTWSE'),
  csv = require('express-csv');

function loadMops(req, res, next) {
  var stockId = req.query.stockId;
  var year = req.query.year;
  var TWSE = new ParseTWSE();
  TWSE.getMOPS(stockId, year, next, req);
}

function loadFinancial(req, res, next) {
  var stockId = req.query.stockId;
  var year = req.query.year;
  var TWSE = new ParseTWSE();
  TWSE.getFinancial(stockId, year, next, req);
}

/*
  /twse/mops
*/
router.get('/mops', loadMops, function(req, res) {
  var stockId = req.query.stockId;
  var year = req.query.year;
  var type = req.query.type;
  var json = req.json;
  var fileName = 'mops_' + stockId + '_' + year + '.csv';

  if (type === 'j') {
    res.json(json);
  } else {
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.set('Content-Type', 'text/csv');
    res.csv(json);
  }

});

router.get('/mops/financial', loadFinancial, function(req, res) {
  var stockId = req.query.stockId;
  var year = req.query.year;
  var type = req.query.type;
  var json = req.json;
  var fileName = 'mops_financial_' + stockId + '_' + year + '.csv';

  if (type === 'j') {
    res.json(json);
  } else {
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.set('Content-Type', 'text/csv');
    res.csv(json);
  }
});

module.exports = function (app) {
  app.use('/twse', router);
};

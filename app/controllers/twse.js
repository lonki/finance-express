var express = require('express'),
  router = express.Router(),
  ParseTWSE = require('../models/parseTWSE'),
  csvbig5 = require('express-csv-big5');

function loadMops(req, res, next) {
  var stockId = req.query.stockId;
  var year = req.query.year;
  var TWSE = new ParseTWSE();
  TWSE.getMOPS(stockId, year, next, req);
}

/*
  /twse/mops
*/
router.get('/mops', loadMops, function(req, res) {
  var stockId = req.query.stockId;
  var year = req.query.year;
  var json = req.json;
  var fileName = 'mops_' + stockId + '_' + year + '.csv';

  res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
  res.set('Content-Type', 'text/csv');
  res.csvbig5(json);
});

module.exports = function (app) {
  app.use('/twse', router);
};

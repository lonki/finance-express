var express = require('express'),
  router = express.Router(),
  Article = require('../models/article'),
  ParseTWSE = require('../models/parseTWSE'),
  json2csv = require('json2csv'),
  iconv = require('iconv-lite'),
  csvbig5 = require('express-csv-big5');

function loadMops(req, res, next) {
  var stockId = req.query.stockId;
  var year = req.query.year;
  var TWSE = new ParseTWSE();
  TWSE.getMOPS(stockId, year, next, req);
}


module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  var articles = [new Article(), new Article()];
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
});

router.get('/twse/mops', loadMops, function(req, res) {
    var stockId = req.query.stockId;
    var year = req.query.year;
    var json = req.json;
    var fileName = 'mops_' + stockId + '_' + year + '.csv';
    // var csv = json2csv({ data: json, fields: ['0','1','2','3','4','5','6'] });

    // fs.writeFile(
    //   'mops_'+stockId+'_'+year+'.csv',
    //   iconv.encode(csv, 'big5'),
    //   function(err) {
    //   if (err) throw err;
    //   console.log('file saved');
    // });

    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.set('Content-Type', 'text/csv');
    res.csvbig5(json);
});

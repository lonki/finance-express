var express = require('express'),
  router = express.Router(),
  ParseTWSE = require('../models/parseTWSE'),
  csv = require('express-csv'),
  csvbig5 = require('express-csv-big5');

const asyncRequest = (asyncFn, req, res) =>
    asyncFn(req, res)
    .catch(e => res.status(500).json({message: e.message}));

const handleResponse = (json, res, type, fileName) => {
  fileName = fileName + '.csv';

  if (type === 'j') {
    res.json(json);
  } else if (type === 'big5') {
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.set('Content-Type', 'text/csv');
    res.csvbig5(json);
  } else {
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.set('Content-Type', 'text/csv');
    res.csv(json);
  }
};

const handleStockMonth = async (req, res) => {
  const {
    stockId,
    year,
    months,
    type,
  } = req.query;

  const monthsAry = months.split(",");
  const TWSE = new ParseTWSE();
  let result = [];
  const data = await Promise.all(monthsAry.map(async (month, index) => {
    let json = await TWSE.getStockMonth(stockId, year, month);

    if (index === 0) {
      json.splice(0, 1);
    } else {
      json.splice(0, 2);
    }
    return json;
  }));

  data.forEach((entry, i) => {
    result = result.concat(result, entry);
  });

  const fileName = `stock_${stockId}_${year}_${months}`;

  handleResponse(result, res, type, fileName);
};


/*
  /twse/stockMonth
*/
router.get('/stockMonth', asyncRequest.bind(null, handleStockMonth));

module.exports = function (app) {
  app.use('/twse', router);
};

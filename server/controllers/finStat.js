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

const handleMops = async (req, res) => {
  const {
    stockId,
    year,
    TYPEK,
    type,
  } = req.query;
  const TWSE = new ParseTWSE();
  const json = await TWSE.getMOPS(stockId, year, TYPEK);
  const fileName = `mops_${stockId}_${year}`;

  handleResponse(json, res, type, fileName);
};

const handleFinancial = async (req, res) => {
  const {
    stockId,
    year,
    TYPEK,
    type,
  } = req.query;
  const TWSE = new ParseTWSE();
  const json = await TWSE.getFinancial(stockId, year, TYPEK);
  const fileName = `mops_financial_${stockId}_${year}`;

  handleResponse(json, res, type, fileName);
};

const handleGrossProfit = async (req, res) => {
  const {
    stockId,
    year,
    type,
  } = req.query;
  const TWSE = new ParseTWSE();
  const json = await TWSE.getGrossProfit(stockId, year);
  const fileName = `mops_grossProfit_${stockId}_${year}`;

  handleResponse(json, res, type, fileName);
};

const handleInventory = async (req, res, next) => {
  const {
    stockId,
    year,
    type,
  } = req.query;
  const TWSE = new ParseTWSE();
  const json = await TWSE.getInventory(stockId, year);
  const fileName = `mops_inventory_${stockId}_${year}`;

  handleResponse(json, res, type, fileName);
}

const handleAverageCollection = async (req, res, next) => {
  const {
    stockId,
    year,
    type,
  } = req.query;
  var TWSE = new ParseTWSE();
  const json = await TWSE.getAverageCollection(stockId, year);
  const fileName = `mops_average_collection_${stockId}_${year}`;

  handleResponse(json, res, type, fileName);
}

/*
  /twse/mops
*/
router.get('/mops', asyncRequest.bind(null, handleMops));

router.get('/mops/financial', asyncRequest.bind(null, handleFinancial));

router.get('/mops/grossProfit', asyncRequest.bind(null, handleGrossProfit));

router.get('/mops/inventoryTurnover', asyncRequest.bind(null, handleInventory));

router.get('/mops/averageCollectionTurnover', asyncRequest.bind(null, handleAverageCollection));

module.exports = function (app) {
  app.use('/twse', router);
};

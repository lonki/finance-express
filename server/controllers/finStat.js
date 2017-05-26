var express = require('express'),
  router = express.Router(),
  ParseTWSE = require('../models/parseTWSE'),
  csv = require('express-csv'),
  csvbig5 = require('express-csv-big5'),
  nodeCache = require( "node-cache" );

const cache = new nodeCache({ stdTTL: 5000 });
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

const handleBalance = async (req, res, next) => {
  const {
    stocks,
    year,
    type,
  } = req.query;
  let result = new Map();
  const TWSE = new ParseTWSE();
  const stocksAry = stocks.split(",");
  const filter = ['公司代號', '公司名稱', '每股參考淨值'];
  const season = ['01', '02', '03', '04'];
  const fileName = `mops_balance_${year}`;
  const cacheKey = `balance_${year}`;
  const cacheValue = cache.get(cacheKey);
  let data = null;
  if (cacheValue) {
    data = cacheValue;
  } else {
    data = await Promise.all(season.map(async (q, index) => {
      const json = await TWSE.getBalance(year, q, filter);
      return json;
    }));

    cache.set(cacheKey, data);
  }

  if (data.length > 0) {
    data.forEach((qData, i) => {
      stocksAry.forEach((stock, i) => {
        const findDataByStock = qData.find(item => item['0'] == stock);

        if (!findDataByStock) {
          return;
        }

        if (!result.has(stock)) {
          findDataByStock['count'] = 1;
          result.set(stock, findDataByStock);
        } else {
          const temp = result.get(stock);
          temp['2'] = parseFloat(temp['2']) + parseFloat(findDataByStock['2']);
          temp['count'] += 1;
          result.set(stock, temp);
        }
      });
    });
  }

  result = Array.from(result).reduce((obj, [key, value]) => {
    value["2"] = value["2"] / value["count"];
    obj[key] = value;
    return obj;
  }, {});

  handleResponse(result, res, type, fileName);
}

const handleStatementOfComprehensiveIncome = async (req, res, next) => {
  const {
    stocks,
    year,
    type,
  } = req.query;
  let result = new Map();
  const TWSE = new ParseTWSE();
  const stocksAry = stocks.split(",");
  const filter = ['公司代號', '公司名稱', '基本每股盈餘（元）'];
  const season = ['01', '02', '03', '04'];
  const fileName = `mops_statement_comprehensive_income_${year}`;
  const cacheKey = `StatementOfComprehensiveIncome_${year}`;
  const cacheValue = cache.get(cacheKey);
  let data = null;
  if (cacheValue) {
    data = cacheValue;
  } else {
    data = await Promise.all(season.map(async (q, index) => {
      const json = await TWSE.getStatementOfComprehensiveIncome(year, q, filter);
      return json;
    }));

    cache.set(cacheKey, data);
  }

  if (data.length > 0) {
    data.forEach((qData, i) => {
      stocksAry.forEach((stock, i) => {
        const findDataByStock = qData.find(item => item['0'] == stock);

        if (!findDataByStock) {
          return;
        }

        if (!result.has(stock)) {
          findDataByStock['count'] = 1;
          result.set(stock, findDataByStock);
        } else {
          const temp = result.get(stock);
          temp['2'] = parseFloat(temp['2']) + parseFloat(findDataByStock['2']);
          temp['count'] += 1;
          result.set(stock, temp);
        }
      });
    });
  }

  result = Array.from(result).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});

  handleResponse(result, res, type, fileName);
}

/*
  /twse/mops
*/
router.get('/mops', asyncRequest.bind(null, handleMops));

router.get('/mops/financial', asyncRequest.bind(null, handleFinancial));

router.get('/mops/grossProfit', asyncRequest.bind(null, handleGrossProfit));

router.get('/mops/inventoryTurnover', asyncRequest.bind(null, handleInventory));

router.get('/mops/averageCollectionTurnover', asyncRequest.bind(null, handleAverageCollection));

router.get('/mops/balance', asyncRequest.bind(null, handleBalance));

router.get('/mops/statementOfComprehensiveIncome', asyncRequest.bind(null, handleStatementOfComprehensiveIncome));

module.exports = function (app) {
  app.use('/twse', router);
};

var express = require('express'),
  router = express.Router(),
  parseLotto = require('../models/parseLotto');

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

const handleLotto = async (req, res) => {
  const {
    start,
    end,
    type,
  } = req.query;

  const fileName = `big_lotto_${start}_${end}`;
  const Lotto = new parseLotto();
  const json = await Lotto.getLotto(start, end);
  
  handleResponse(json, res, type, fileName);
};

const handlePower = async (req, res) => {
  const {
    start,
    end,
    type,
  } = req.query;

  const fileName = `big_lotto_${start}_${end}`;
  const Lotto = new parseLotto();
  const json = await Lotto.getLotto(start, end, 2);
  
  handleResponse(json, res, type, fileName);
};


/*
  /lotto/big
*/
router.get('/big', asyncRequest.bind(null, handleLotto));

/*
  /lotto/power
*/
router.get('/power', asyncRequest.bind(null, handlePower));

module.exports = function (app) {
  app.use('/lotto', router);
};

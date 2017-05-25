var Crawler = require("crawler");
var url = require('url');
var tabletojson = require('tabletojson');
var TwseAPI = require('../services/twseAPI');

function processTableHtmlToJson($, table) {
  var _th_rowspan_number = 0;
  var _th_colspan_number = 0;
  table.find("tr").each(function(i, item) {
    if(i > 0) {
      var _td = $(item).find("td");
      var _th = $(item).find("th");
      if(typeof _th.attr("rowspan") != "undefined"){
        _th_rowspan_number = parseInt(_th.attr("rowspan")) - 1;
        return;
      }

      if(typeof _td.attr("colspan") != "undefined"){
        _th_colspan_number = parseInt(_th.attr("colspan")) - 1;
        return;
      }

      if (_th_rowspan_number > 0) {
        $(item).prepend('<td></td>');
        _th_rowspan_number--;
      }

      if (_th_colspan_number > 0) {
        $(item).prepend('<td></td>');
        _th_colspan_number--;
      }
    }
  });

  table = table.html();
  table = (table) ? table: '';

  var tableHtml = '<table>' + table.replace(/\<th/g,"<td").replace(/\<\/th>/g,"</td>") + '</table>';
  var json = tabletojson.convert(tableHtml.toString());

  return json[0];
}

function filterJson(filter, json) {
  let findIndexAry = [];

  json.forEach((item, index) => {
    if (index === 0) {
      for (let [k, v] of Object.entries(item)) {
        if (filter.includes(v)) {
          findIndexAry.push(k);
        }
      }
    }

    Object.keys(item)
    .filter(key => !findIndexAry.includes(key))
    .forEach(key => delete item[key]);

    Object.keys(item)
    .forEach((key) => {
      const index = findIndexAry.findIndex(k => k == key);

      if (!(index in item)) {
        item[index] = item[key];
        delete item[key];
      }
    });
  });
}

module.exports = function() {
    this.c = new Crawler({
      maxConnections : 10
    });

    this.TwseAPI = new TwseAPI();

    // ************財務報表************
    // 營益分析表
    // http://mops.twse.com.tw/mops/web/t163sb08
    this.getMOPS = function(co_id, year, TYPEK) {
      TYPEK = (TYPEK)? TYPEK: 'sii';
      const query = {
        co_id,
        year,
        TYPEK,
      };
      const mopsAPI = this.TwseAPI.getTwseAPI('MOPS', query);

      return new Promise(r => {
        this.c.queue([{
          uri: mopsAPI.url,
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: mopsAPI.formData,
          callback: function (error, res, done) {
            let json = {};

            if (!error) {
              const $ = res.$;
              const table = $("table.hasBorder");
              json = processTableHtmlToJson($, table);
            }

            done();
            r(json);
          }
        }]);
      });
    };

    // 財務分析表
    // http://mops.twse.com.tw/mops/web/ajax_t05st22
    this.getFinancial = function(co_id, year, TYPEK) {
      TYPEK = (TYPEK)? TYPEK: 'sii';
      const query = {
        co_id,
        year,
        TYPEK,
      };
      const FinancialAPI = this.TwseAPI.getTwseAPI('Financial', query);

      return new Promise(r => {
        this.c.queue([{
          uri: FinancialAPI.url,
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: FinancialAPI.formData,
          callback: function (error, res, done) {
            let json = {};

            if (!error) {
              const $ = res.$;
              const tableLength = $("table").length;
              const table = $("table").eq(tableLength - 1);
              json = processTableHtmlToJson($, table);
            }

            done();
            r(json);
          }
        }]);
      });
    };

    // 毛利率
    // http://mops.twse.com.tw/mops/web/ajax_t163sb09
    this.getGrossProfit = function(co_id, year) {
      const query = {
        co_id,
        year,
      };
      const grossProfitAPI = this.TwseAPI.getTwseAPI('GrossProfit', query);

      return new Promise(r => {
        this.c.queue([{
          uri: grossProfitAPI.url,
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: grossProfitAPI.formData,
          callback: function (error, res, done) {
            let json = {};

            if (!error) {
              const $ = res.$;
              const tableLength = $("table").length;
              const table = $("table").eq(tableLength - 1);
              json = processTableHtmlToJson($, table);
            }
            done();
            r(json);
          }
        }]);
      });
    };

    // 存貨週轉率
    // http://mops.twse.com.tw/mops/web/ajax_t05st25
    this.getInventory = function(co_id, year) {
      const query = {
        co_id,
        year,
      };
      const inventoryAPI = this.TwseAPI.getTwseAPI('Inventory', query);

      return new Promise(r => {
        this.c.queue([{
          uri: inventoryAPI.url,
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: inventoryAPI.formData,
          callback: function (error, res, done) {
            let json = {};

            if (!error) {
              const $ = res.$;
              const tableLength = $("table").length;
              const table = $("table").eq(tableLength - 1);
              json = processTableHtmlToJson($, table);
            }
            done();
            r(json);
          }
        }]);
      });
    };

    //應收帳款週轉率
    //http://mops.twse.com.tw/mops/web/ajax_t05st26
    this.getAverageCollection = function(co_id, year) {
      const query = {
        co_id,
        year,
      };
      const averageCollectionAPI = this.TwseAPI.getTwseAPI('AverageCollection', query);

      return new Promise(r => {
        this.c.queue([{
          uri: averageCollectionAPI.url,
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: averageCollectionAPI.formData,
          callback: function (error, res, done) {
            let json = {};

            if (!error) {
              var $ = res.$;
              var tableLength = $("table").length;
              var table = $("table").eq(tableLength - 1);
              json = processTableHtmlToJson($, table);
            }
            done();
            r(json);
          }
        }]);
      });
    };

    //資產負債表-拿每股淨值
    //http://mops.twse.com.tw/mops/web/t163sb05
    this.getBalance = function(year, season, filter) {
      const query = {
        season,
        year,
      };

      const balanceAPI = this.TwseAPI.getTwseAPI('Balance', query);

      return new Promise(r => {
        this.c.queue([{
          uri: balanceAPI.url,
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: balanceAPI.formData,
          callback: function (error, res, done) {
            let json = [];

            if (!error) {
              const $ = res.$;
              for (let i=0; i < $("table").length; i++) {
                if (i === 0) continue;

                const table = $("table").eq(i);
                const jsonData = processTableHtmlToJson($, table);
                filterJson(filter, jsonData);
                if (json.length > 0) {
                  jsonData.splice(0, 1);
                }
                json = json.concat(jsonData);
              }
            }
            done();
            r(json);
          }
        }]);
      });
    };

    //綜合損益表-拿EPS
    //http://mops.twse.com.tw/mops/web/t163sb04
    this.getStatementOfComprehensiveIncome = function(year, season, filter) {
      const query = {
        season,
        year,
      };

      const statementOfComprehensiveIncomeAPI = this.TwseAPI.getTwseAPI('StatementOfComprehensiveIncome', query);

      return new Promise(r => {
        this.c.queue([{
          uri: statementOfComprehensiveIncomeAPI.url,
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          form: statementOfComprehensiveIncomeAPI.formData,
          callback: function (error, res, done) {
            let json = [];

            if (!error) {
              const $ = res.$;
              for (let i=0; i < $("table").length; i++) {
                if (i === 0) continue;

                const table = $("table").eq(i);
                const jsonData = processTableHtmlToJson($, table);
                filterJson(filter, jsonData);
                if (json.length > 0) {
                  jsonData.splice(0, 1);
                }
                json = json.concat(jsonData);
              }
            }
            done();
            r(json);
          }
        }]);
      });
    };

    // ************個股************
    // 上市個股日成交資訊
    // http://www.tse.com.tw/zh/page/trading/exchange/STOCK_DAY.html
    this.getStockMonth = function(CO_ID, query_year, query_month) {
      const leftPad = (number, targetLength) => {
        let output = number + '';

        while (output.length < targetLength) {
          output = '0' + output;
        }
        return output;
      };
      const numberWithCommas = (x) => {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      const query = {
        date: `${query_year}${leftPad(query_month, 2)}01`,
        stockNo: CO_ID,
      };
      const uri = this.TwseAPI.getTwseQueryAPI('StockMonth', query);

      return new Promise(r => {
        this.c.queue([{
          uri,
          method: 'GET',
          callback: function (error, res, done) {
            let json = [];
            if (!error) {
              let jsonData = JSON.parse(res.body);
              const { fields, data } = jsonData;
              json.push({
                0: '日期',
                1: '成交股數',
                2: '成交金額',
                3: '開盤價',
                4: '最高價',
                5: '最低價',
                6: '收盤價',
                7: '漲跌價差',
                8: '成交筆數',
              });

              data.forEach((entry, i) => {
                // 單位是成交千股
                let stockNum = entry[1].replace(/,/g, '') * 1000;
                // 單位是成交千元
                let stockCost = entry[2].replace(/,/g, '') * 1000;

                json.push({
                  0: entry[0],
                  1: numberWithCommas(stockNum),
                  2: numberWithCommas(stockCost),
                  3: entry[3],
                  4: entry[4],
                  5: entry[5],
                  6: entry[6],
                  7: entry[7],
                  8: entry[8],
                })
              });
            }

            done();
            r(json);
          }
        }]);
      });
    };

    // 上櫃個股日成交資訊
    // http://www.tpex.org.tw/web/stock/aftertrading/daily_trading_info/st43.php?l=zh-tw
    this.getOTCStockMonth = function(CO_ID, query_year, query_month) {
      const leftPad = (number, targetLength) => {
        let output = number + '';

        while (output.length < targetLength) {
          output = '0' + output;
        }
        return output;
      };
      const numberWithCommas = (x) => {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      const year = query_year - 1911;
      const query = {
        d: `${year}/${leftPad(query_month, 2)}/01`,
        stkno: CO_ID,
      };
      const uri = this.TwseAPI.getTwseQueryAPI('OTCStockMonth', query);

      return new Promise(r => {
        this.c.queue({
          uri,
          method: 'GET',
          callback: function (error, res, done) {
            let json = [{
              0: '日期',
              1: '成交股數',
              2: '成交金額',
              3: '開盤價',
              4: '最高價',
              5: '最低價',
              6: '收盤價',
              7: '漲跌價差',
              8: '成交筆數',
            }];

            if (!error) {
              let data = JSON.parse(res.body);
              data = data.aaData;
              data.forEach((entry, i) => {
                // 單位是成交千股
                let stockNum = entry[1].replace(/,/g, '') * 1000;
                // 單位是成交千元
                let stockCost = entry[2].replace(/,/g, '') * 1000;

                json.push({
                  0: entry[0],
                  1: numberWithCommas(stockNum),
                  2: numberWithCommas(stockCost),
                  3: entry[3],
                  4: entry[4],
                  5: entry[5],
                  6: entry[6],
                  7: entry[7],
                  8: entry[8],
                })
              });
            }

            done();
            r(json);
          }
        });
      });
    };
};

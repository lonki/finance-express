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

    // ************個股************
    // 營益分析表
    // http://www.tse.com.tw/ch/trading/exchange/STOCK_DAY/STOCK_DAYMAIN.php
    this.getStockMonth = function(CO_ID, query_year, query_month) {
      const query = {
        query_year,
        query_month,
        CO_ID,
      };
      const mopsAPI = this.TwseAPI.getTwseAPI('StockMonth', query);

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
              const table = $("table").eq(0);
              json = processTableHtmlToJson($, table);
            }

            done();
            r(json);
          }
        }]);
      });
    };
};

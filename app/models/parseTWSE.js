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

    /*
      營益分析表
      http://mops.twse.com.tw/mops/web/t163sb08
    */
    this.getMOPS = function(co_id, year, TYPEK, next, req) {
      TYPEK = (TYPEK)? TYPEK: 'sii';
      var query = {
        co_id,
        year,
        TYPEK,
      };
      var mopsAPI = this.TwseAPI.getTwseAPI('MOPS', query);

      this.c.queue([{
        uri: mopsAPI.url,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: mopsAPI.formData,
        callback: function (error, res, done) {

          if (!error) {
            try {
              var $ = res.$;
              var table = $("table.hasBorder");
              req.json = processTableHtmlToJson($, table);
            } catch(err) {
              req.json = {};
              throw new Error("mopsAPI failed: " + err);
            }
          }
          done();
          next();
        }
      }]);
    };

    // 財務分析表
    // http://mops.twse.com.tw/mops/web/ajax_t05st22
    this.getFinancial = function(co_id, year, TYPEK, next, req) {
      TYPEK = (TYPEK)? TYPEK: 'sii';
      var query = {
        co_id,
        year,
        TYPEK,
      };
      var FinancialAPI = this.TwseAPI.getTwseAPI('Financial', query);

      this.c.queue([{
        uri: FinancialAPI.url,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: FinancialAPI.formData,
        callback: function (error, res, done) {

          if (!error) {
            try {
              var $ = res.$;
              var tableLength = $("table").length;
              var table = $("table").eq(tableLength - 1);
              req.json = processTableHtmlToJson($, table);
            } catch(err) {
              req.json = {};
              throw new Error("mopsAPI failed: " + err);
            }
          }
          done();
          next();
        }
      }]);
    };

    // 毛利率
    // http://mops.twse.com.tw/mops/web/ajax_t163sb09
    this.getGrossProfit = function(co_id, year, next, req) {
      var query = {
        co_id,
        year,
      };
      var grossProfitAPI = this.TwseAPI.getTwseAPI('GrossProfit', query);

      this.c.queue([{
        uri: grossProfitAPI.url,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: grossProfitAPI.formData,
        callback: function (error, res, done) {

          if (!error) {
            try {
              var $ = res.$;
              var tableLength = $("table").length;
              var table = $("table").eq(tableLength - 1);
              req.json = processTableHtmlToJson($, table);
            } catch(err) {
              req.json = {};
              throw new Error("mopsAPI failed: " + err);
            }
          }
          done();
          next();
        }
      }]);
    };

    // 存貨週轉率
    // http://mops.twse.com.tw/mops/web/ajax_t05st25
    this.getInventory = function(co_id, year, next, req) {
      var query = {
        co_id,
        year,
      };
      var inventoryAPI = this.TwseAPI.getTwseAPI('Inventory', query);

      this.c.queue([{
        uri: inventoryAPI.url,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: inventoryAPI.formData,
        callback: function (error, res, done) {

          if (!error) {
            try {
              var $ = res.$;
              var tableLength = $("table").length;
              var table = $("table").eq(tableLength - 1);
              req.json = processTableHtmlToJson($, table);
            } catch(err) {
              req.json = {};
              throw new Error("mopsAPI failed: " + err);
            }
          }
          done();
          next();
        }
      }]);
    };

    //應收帳款週轉率
    //http://mops.twse.com.tw/mops/web/ajax_t05st26
    this.getAverageCollection = function(co_id, year, next, req) {
      var query = {
        co_id,
        year,
      };
      var averageCollectionAPI = this.TwseAPI.getTwseAPI('AverageCollection', query);

      this.c.queue([{
        uri: averageCollectionAPI.url,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: averageCollectionAPI.formData,
        callback: function (error, res, done) {

          if (!error) {
            try {
              var $ = res.$;
              var tableLength = $("table").length;
              var table = $("table").eq(tableLength - 1);
              req.json = processTableHtmlToJson($, table);
            } catch(err) {
              req.json = {};
              throw new Error("mopsAPI failed: " + err);
            }
          }
          done();
          next();
        }
      }]);
    };
};

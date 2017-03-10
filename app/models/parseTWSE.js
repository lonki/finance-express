var Crawler = require("crawler");
var url = require('url');
var tabletojson = require('tabletojson');

function processTableHtml($, table) {
  return processTableHtml($,table,0);
}

function processTableHtml($, table, headershiftNum) {
  let target = 0;
  let shiftNum = parseInt(headershiftNum);
  table.find("tr").each(function(i, item) {
    if(i == 0 && shiftNum > 0){
      for (let j = 0; j < shiftNum; j++) { 
          $(item).prepend('<td></td>');
      }
    }else if(i > 0) {
      var _th = $(item).find("th");
      if(typeof _th.attr("rowspan") != "undefined"){
        target = parseInt(_th.attr("rowspan")) - 1;
        return;
      }
      if (target > 0) {
        $(item).prepend('<td></td>');
        target--;
      }
    }
  });
  return table;
}

module.exports = function() {
    this.c = new Crawler({
      maxConnections : 10
    });

    /*
      營益分析表
      http://mops.twse.com.tw/mops/web/t163sb08
    */
    this.getMOPS = function(stockId, year, next, req) {
      const url = 'http://mops.twse.com.tw/mops/web/ajax_t163sb08';
      const data = {
        encodeURIComponent : 1,
        step : 1,
        firstin : 1,
        off : 1,
        keyword4 : '',
        code1 : '',
        TYPEK2 : '',
        checkbtn : '',
        queryName : 'co_id',
        t05st29_c_ifrs :'N',
        t05st30_c_ifrs : 'N',
        inpuType : 'co_id',
        TYPEK : 'all',
        isnew : false,
        co_id : stockId,
        year : year
      };

      this.c.queue([{
        uri: url,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: data,
        callback: function (error, res, done) {
          if(error){
          }else{
            var $ = res.$;
            var table = $("table.hasBorder");
            table = processTableHtml($, table).html();
            var tableHtml = '<table>' + table.replace(/\<th/g,"<td").replace(/\<\/th>/g,"</td>") + '</table>';
            var json = tabletojson.convert(tableHtml.toString());
            req.json = json[0];
          }
          done();
          next();
        }
      }]);
    };

    // 財務分析表
    // http://mops.twse.com.tw/mops/web/ajax_t05st22
    this.getFinancial = function(stockId, year, next, req) {
      const url = 'http://mops.twse.com.tw/mops/web/ajax_t05st22';
      const data = {
        encodeURIComponent:1,
        step : 1,
        firstin : 1,
        off : 1,
        keyword4 : '',
        code1 : '',
        TYPEK2 : '',
        checkbtn : '',
        queryName : 'co_id',
        t05st29_c_ifrs : 'N',
        t05st30_c_ifrs : 'N',
        inpuType : 'co_id',
        TYPEK : 'all',
        isnew : false,
        co_id : stockId,
        year : year
      };

      this.c.queue([{
        uri: url,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: data,
        callback: function (error, res, done) {
          if(error){
          }else{
            var $ = res.$;
            var table = $("table").eq(3);
            table = processTableHtml($, table).html();
            var tableHtml = '<table>' + table.replace(/\<th/g,"<td").replace(/\<\/th>/g,"</td>") + '</table>';
            var json = tabletojson.convert(tableHtml.toString());
            req.json = json[0];
          }
          done();
          next();
        }
      }]);
    };

    // 毛利率
    // http://mops.twse.com.tw/mops/web/ajax_t163sb09
    this.getGrossProfit = function(stockId, year, next, req) {
      const url = 'http://mops.twse.com.tw/mops/web/ajax_t163sb09';
      const data = {
        encodeURIComponent:1,
        step : 1,
        firstin : 1,
        off : 1,
        keyword4 : '',
        code1 : '',
        TYPEK2 : '',
        checkbtn : '',
        queryName : 'co_id',
        t05st29_c_ifrs : 'N',
        t05st30_c_ifrs : 'N',
        inpuType : 'co_id',
        TYPEK : 'all',
        isnew : false,
        co_id : stockId,
        year : year
      };

      this.c.queue([{
        uri: url,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: data,
        callback: function (error, res, done) {
          if(error){
          }else{
            var $ = res.$;
            var table = $("table").eq(2);
            table = processTableHtml($, table,1).html();
            var tableHtml = '<table>' + table.replace(/\<th/g,"<td").replace(/\<\/th>/g,"</td>") + '</table>';
            var json = tabletojson.convert(tableHtml.toString());
            req.json = json[0];
          }
          done();
          next();
        }
      }]);
    };

    // 存貨週轉率
    // http://mops.twse.com.tw/mops/web/ajax_t05st25
    this.getInventory = function(stockId, year, next, req) {
      const url = 'http://mops.twse.com.tw/mops/web/ajax_t05st25';
      const data = {
        encodeURIComponent:1,
        run : 'Y',
        ifrs : 'Y',
        step : 1,
        firstin : 1,
        off : 1,
        keyword4 : '',
        code1 : '',
        TYPEK2 : '',
        checkbtn : '',
        queryName : 'co_id',
        t05st29_c_ifrs : 'N',
        t05st30_c_ifrs : 'N',
        inpuType : 'co_id',
        TYPEK : 'all',
        isnew : false,
        co_id : stockId,
        year : year
      };

      this.c.queue([{
        uri: url,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: data,
        callback: function (error, res, done) {
          if(error){
          }else{
            var $ = res.$;
            var table = $("table").eq(2);
            table = processTableHtml($, table, 1).html();
            var tableHtml = '<table>' + table.replace(/\<th/g,"<td").replace(/\<\/th>/g,"</td>") + '</table>';
            var json = tabletojson.convert(tableHtml.toString());
            req.json = json[0];
          }
          done();
          next();
        }
      }]);
    };

    //應收帳款週轉率
    //http://mops.twse.com.tw/mops/web/ajax_t05st26
    this.getAverageCollection = function(stockId, year, next, req) {
      const url = 'http://mops.twse.com.tw/mops/web/ajax_t05st26';
      const data = {
        encodeURIComponent:1,
        run : 'Y',
        ifrs : 'Y',
        step : 1,
        firstin : 1,
        off : 1,
        keyword4 : '',
        code1 : '',
        TYPEK2 : '',
        checkbtn : '',
        queryName : 'co_id',
        t05st29_c_ifrs : 'N',
        t05st30_c_ifrs : 'N',
        inpuType : 'co_id',
        TYPEK : 'all',
        isnew : false,
        co_id : stockId,
        year : year
      };

      this.c.queue([{
        uri: url,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        form: data,
        callback: function (error, res, done) {
          if(error){
          }else{
            var $ = res.$;
            var table = $("table").eq(2);
            table = processTableHtml($, table, 1).html();
            var tableHtml = '<table>' + table.replace(/\<th/g,"<td").replace(/\<\/th>/g,"</td>") + '</table>';
            var json = tabletojson.convert(tableHtml.toString());
            req.json = json[0];
          }
          done();
          next();
        }
      }]);
    };
};

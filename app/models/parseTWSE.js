var Crawler = require("crawler");
var url = require('url');
var tabletojson = require('tabletojson');

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
        isnew : true,
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
            console.log(error);
          }else{
            var $ = res.$;
            var table = $("table.hasBorder");
            table.find("tr").each(function(i, item) {
              if(i > 0) {
                var _th = $(item).find("th");
                if (_th.length == 1) {
                  $(item).prepend('<td></td>');
                }
              }
            });

            table = table.html();
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

const Crawler = require("crawler");
const url = require('url');

function processBigLottoHtmlToJson($, table) {
  const tbody = table.eq(3).find("tbody").eq(1);
  let json = [];
  tbody.find("tr").each(function(i, item) {
    let record = {
      serial: '',
      numbers: [],
      special: '',
    };
    $(item).find("td").each(function(j, td) {
      if (j === 0) {
        record.serial = $(td).find('div').eq(0).text();
      }
      if ($(td).attr('id') == 'h6') {
        record.numbers.push($(td).text());
      }
      if ($(td).attr('id') == 'h7') {
        record.special = $(td).text();
      }
    });
    json.push(record);
  });

  return json;
}

module.exports = function() {
    this.c = new Crawler({
      maxConnections : 10
    });

    // ************大樂透************
    // http://www.9800.com.tw/trend.asp
    this.getBigLotto = function(start, end) {
      return new Promise(r => {
        this.c.queue([{
          uri: `http://www.9800.com.tw/trend.asp?p1=${start}&p2=${end}&te=1&l=0&type=1`,
          method: 'GET',
          callback: function (error, res, done) {
            let json = {};

            if (!error) {
              const $ = res.$;
              const table = $("table");
              json = processBigLottoHtmlToJson($, table);
            }

            done();
            r(json);
          }
        }]);
      });
    };
};

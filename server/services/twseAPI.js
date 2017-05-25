module.exports = function () {
  const Settings = {
    MOPS: {
      url: 'http://mops.twse.com.tw/mops/web/ajax_t163sb08',
      formData: {
        encodeURIComponent : 1,
        run: 'Y',
        step : 1,
        TYPEK : 'sii',
        isnew : false,
        firstin : 1,
        off : 1,
        keyword4 : '',
        ifrs: 'Y',
      }
    },
    Financial: {
      url: 'http://mops.twse.com.tw/mops/web/ajax_t05st22',
      formData: {
        encodeURIComponent:1,
        run: 'Y',
        step : 1,
        TYPEK: 'sii',
        firstin: 1,
        off: 1,
        isnew : false,
        ifrs: 'Y',
      }
    },
    GrossProfit: {
      url: 'http://mops.twse.com.tw/mops/web/ajax_t163sb09',
      formData: {
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
      }
    },
    Inventory: {
      url: 'http://mops.twse.com.tw/mops/web/ajax_t05st25',
      formData: {
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
      }
    },
    AverageCollection: {
      url: 'http://mops.twse.com.tw/mops/web/ajax_t05st26',
      formData: {
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
      }
    },
    StockMonth: (params) => {
      const { date, stockNo } = params;
      return `http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${date}&stockNo=${stockNo}`;
    },
    OTCStockMonth: (params) => {
      const { d, stkno } = params;
      return `http://www.tpex.org.tw/web/stock/aftertrading/daily_trading_info/st43_result.php?l=zh-tw&d=${d}&stkno=${stkno}`;
    },
  }

  this.getTwseAPI = function (type, req){
    let formData = Settings[type];
    formData.formData = { ...formData.formData, ...req };
    return formData;
  }

  this.getTwseQueryAPI = function (type, req){
    return Settings[type](req);
  }
};
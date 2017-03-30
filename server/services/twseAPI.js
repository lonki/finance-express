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
    StockMonth: {
      url: 'http://www.tse.com.tw/ch/trading/exchange/STOCK_DAY/STOCK_DAYMAIN.php',
      formData: {
        'query-button': '查詢',
      }
    }
  }

  this.getTwseAPI = function (type, req){
    let formData = Settings[type];
    formData.formData = { ...formData.formData, ...req };
    return formData;
  }
};

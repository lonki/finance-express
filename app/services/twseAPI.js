module.exports = function () {
  const Settings = {
    MOPS: {
      url: 'http://mops.twse.com.tw/mops/web/ajax_t163sb08',
      formData: {
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
        isnew : true
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
        isnew : 'false',
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
    }
  }

  function merge_options(obj1, obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
  }

  this.getTwseAPI = function (type, req){
    const formData = merge_options(Settings[type].formData, req)
    return Object.assign(Settings[type], { formData });
  }
};

var path = require('path');
var rootPath = path.join(__dirname, '../../');
var env = process.env.NODE_ENV || 'development';
var server_port = process.env.PORT || 8080;
var server_ip_address = process.env.IP || '0.0.0.0';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'crawler-express'
    },
    port: server_port,
    ip: server_ip_address,
    lineBot: {
      id: '1535144800',
      secret: '95dd3ba0be81104c538c7c3e542091a3',
      accessToken: 'yG4ySXgkqL0vPDa87+QF3EmaGe8Qfzd626RPAk2RUzIc9p+rFDsUtQPtc4FO3G+RqnKAGiWmMzTx+2WrVW8EY1YO3aXAf8gZDbFPqGwMBu/AZlC1xMd9y9J3TfGK06LQN+TeWhB+heaaxEMltbdvpgdB04t89/1O/w1cDnyilFU='
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'crawler-express'
    },
    port: server_port,
    ip: server_ip_address,
    lineBot: {
      id: '1535144800',
      secret: '95dd3ba0be81104c538c7c3e542091a3',
      accessToken: 'yG4ySXgkqL0vPDa87+QF3EmaGe8Qfzd626RPAk2RUzIc9p+rFDsUtQPtc4FO3G+RqnKAGiWmMzTx+2WrVW8EY1YO3aXAf8gZDbFPqGwMBu/AZlC1xMd9y9J3TfGK06LQN+TeWhB+heaaxEMltbdvpgdB04t89/1O/w1cDnyilFU='
    }
  },

  production: {
    root: rootPath,
    app: {
      name: 'crawler-express'
    },
    port: server_port,
    ip: server_ip_address,
    lineBot: {
      id: '1535144800',
      secret: '95dd3ba0be81104c538c7c3e542091a3',
      accessToken: 'yG4ySXgkqL0vPDa87+QF3EmaGe8Qfzd626RPAk2RUzIc9p+rFDsUtQPtc4FO3G+RqnKAGiWmMzTx+2WrVW8EY1YO3aXAf8gZDbFPqGwMBu/AZlC1xMd9y9J3TfGK06LQN+TeWhB+heaaxEMltbdvpgdB04t89/1O/w1cDnyilFU='
    }
  }
};

module.exports = config[env];

var express = require('express'),
router = express.Router();



module.exports = function (app, bot) {
  bot.on('message', function(event) {
    console.log(event); //把收到訊息的 event 印出來看看
  });

  const linebotParser = bot.parser();
  
  app.post('/linewebhook', linebotParser);
};
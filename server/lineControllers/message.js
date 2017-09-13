var express = require('express'),
router = express.Router();

module.exports = function (app, bot) {
  bot.on('message', function(event) {
    if (event.message.type = 'text') {
      var msg = event.message.text;
      event.reply(msg).then(function(data) {
        // success 
        console.log(msg);
      }).catch(function(error) {
        // error 
        console.log('error');
      });
    }
  });

  const linebotParser = bot.parser();

  app.post('/linewebhook', linebotParser);
};
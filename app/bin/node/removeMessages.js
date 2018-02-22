'use strict';

var CronJobDeleteMessage = require('cron').CronJob;
const path = require('path');

const CoreHelper = require(path.join(__dirname, './../../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const Message = coreHelper.callModule(`${coreHelper.paths.MODELS}Messages.js`);
// cron.schedule('* * * * *', function(){
//     console.log('running a task every minute');
// });

//s m h d m day
//0 0 1 */3 * => 3m
var job = new CronJobDeleteMessage({
    cronTime: '* * * * *',
    onTick: function () {

        let message = new Message.class();
        message.cronDeleteMessage(function (err, modelMessage) {

            console.log('running a task every minute', err, JSON.stringify(modelMessage));
        });
    },
    start: false,
    timeZone: 'Asia/Ho_Chi_Minh'
});

job.start();
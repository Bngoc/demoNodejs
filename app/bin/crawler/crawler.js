'use strict';

let CronJobCrawler = require('cron').CronJob;
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');

const CoreHelper = require(path.join(__dirname, './../../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
// cron.schedule('* * * * *', function(){
//     console.log('running a task every minute');
// });

//s m h d m day
//0 0 1 */3 * => 3m
var job = new CronJobCrawler({
    cronTime: '* * * * *',
    onTick: function () {
        request('https://mp3.zing.vn/', function (err, resp, html) {
            if (err) {
                console.log("Error: " + err);
            } else {
                const $ = cheerio.load(html);
                let topCollectionHit = [];
                $('#widget-chart-song ul.tab-nav li').each(function (index, ele) {
                    console.log($(this));
                    let objListSong = {
                        nameSong: $(this).text(),
                        idListSong: $(this).attr('data-show'),
                        idDataPlaylistlink: $(this).attr('data-playlistlink'),
                        idDataLink: $(this).attr('data-link'),
                    };
                    topCollectionHit.push(objListSong);
                });
                var fs = require('fs');
                fs.writeFile(path.join(__dirname, '../../../tmp/test.txt'), $('html').filter('#widget-chart-song'), function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                });
                // console.log(topCollectionHit, html);
            }
        });

    },
    start: false,
    timeZone: 'Asia/Ho_Chi_Minh'
});

job.start();
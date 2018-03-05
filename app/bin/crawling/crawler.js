'use strict';

let CronJobCrawler = require('cron').CronJob;
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');

var Crawler = require("simplecrawler");


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
        var options = {
            url: 'https://mp3.zing.vn/',
            headers: {
                'User-Agent': '#Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'
            }
        };
        // var crawler = new Crawler("https://mp3.zing.vn/");
        var crawler = new Crawler("http://localhost:1234/chat");
        // crawler.maxDepth = 1;
        crawler.filterByDomain = false;
        // crawler.addFetchCondition(function (queueItem, referrerQueueItem, callback) {
        //     // We only ever want to move one step away from example.com, so if the
        //     // referrer queue item reports a different domain, don't proceed
        //     callback(null, referrerQueueItem.host === crawler.host);
        // });
        crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
            console.log("I just received %s (%d bytes)", queueItem.url, responseBuffer.length);
            console.log("It was a resource of type %s", response.headers['content-type']);

            let html = responseBuffer.toString("utf8");
            let $ = cheerio.load(html);

            let topCollectionHit = $("#widget-chart-song ul.tab-nav li").map(function () {
                return {
                    nameSong: $(this).text(),
                    idListSong: $(this).children('a').first().attr('data-show') || null,
                    idDataPlaylistlink: $(this).children('a').first().attr('data-playlistlink') || null,
                    idDataLink: $(this).find('a').first().attr('data-link') || null,
                };
            }).get();
            // let topListCollectionHit = [];
            if (topCollectionHit.length) {
                topCollectionHit.forEach(function (items) {
                    // let tmpTpListCollectionHit = Object.assign({}, items);
                    let objListSong = $(`${items.idListSong} li`).map(function () {
                        let obj = {};
                        if ($(this).has('.w260')) {
                            // obj
                            obj['rangeTop'] = $(this).find('.w260 .fn-order').first().text() || null;
                            obj['nameSong'] = $(this).find('.w260 .song-name a').first().text() || null;
                            obj['singerName'] = $(this).find('.w260 div.inblock h4').contents().map(function () {
                                    return $(this).text().replace(/[\r\n]/g, "").trim() || '';
                                }).get().join().replace(/(\r\n|\n|\r)/gm, "") || null;
                            obj['songScore'] = $(this).find('.w260 i').first().text() || null;
                        }
                        return obj;
                    }).get();

                    items['listSong'] = objListSong;
                    // tmpTpListCollectionHit['listSong'] = objListSong;
                    // topListCollectionHit.push(tmpTpListCollectionHit);
                });
            }

            // writeHtml(html);
            console.log(html);
            // console.log('topCollectionHit ==> ', JSON.stringify(topCollectionHit));
            // writeHtml(JSON.stringify(topCollectionHit));

        });

        function listener(queueItem, stateData) {
            // console.log(responseBuffer.toString("utf8"));
            // console.log(queueItem, stateData);
        }

        let conditionID = crawler.addFetchCondition(listener);
        // crawler.removeFetchCondition(conditionID);

        crawler.discoverResources = function (buffer, queueItem) {
            var $ = cheerio.load(buffer.toString("utf8"));
            // let topCollectionHit = [];
            return $("#widget-chart-song ul.tab-nav li").map(function () {
                return $(this).attr("href");
                // let objListSong = {
                //     nameSong: $(this).text(),
                //     idListSong: $(this).attr('data-show') || null,
                //     idDataPlaylistlink: $(this).attr('data-playlistlink') || null,
                //     idDataLink: $(this).attr('data-link') || null,
                // };
                // return objListSong;
            }).get();
        };


        crawler.start();

        request(options, function (err, resp, html) {
            if (err) {
                console.log("Error: " + err);
            } else {
                const $ = cheerio.load(html);
                let tmpTopCollectionHit = [];
                $('#widget-chart-song ul.tab-nav li').each(function () {
                    let objListSong = {
                        nameSong: $(this).text(),
                        idListSong: $(this).children('a').first().attr('data-show') || null,
                        idDataPlaylistlink: $(this).children('a').first().attr('data-playlistlink') || null,
                        idDataLink: $(this).find('a').first().attr('data-link') || null,
                    };

                    tmpTopCollectionHit.push(objListSong);
                });
                // writeHtml(JSON.stringify(resp))
                // writeHtml(JSON.stringify(resp))
                // console.log(JSON.stringify(resp), JSON.stringify(tmpTopCollectionHit));
            }
        });

        function writeHtml(string) {
            var fs = require('fs');
            fs.writeFile(path.join(__dirname, '../../../tmp/reqLocalhost.txt'), string, function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });
        }
    },
    start: false,
    timeZone: 'Asia/Ho_Chi_Minh'
});

job.start();
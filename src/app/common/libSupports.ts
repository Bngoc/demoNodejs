'use strict';

declare var require: any;
const mainAng = require("./../../../proxy.conf.json");
const pjson = require('./../../../package.json');
const bundles = require('./../../../bundles.angular.json');
import {isUndefined} from "util";
declare var $: any;

export abstract class libSupports {

    public urlSide() {

        return mainAng['/api/*'].target;
    }

    public intiLoadCss(isCheckWebsite = true) {
        let nameWebsite = isCheckWebsite ? 'main' : 'admin_main';
        this.loadCss(bundles.styles[nameWebsite].files);
    }

    public intiLoadScript(isCheckWebsite = true) {
        let nameWebsite = isCheckWebsite ? 'main' : 'admin_main';
        this.loadScript(bundles.scripts[nameWebsite].files.head);
        this.appendMyScript(bundles.scripts[nameWebsite].files.body);
    }

    public loadScript(urlArray) {
        if (urlArray.length) {
            urlArray.forEach(function (url, index) {
                // console.clear();
                // console.log(`preparing to load script...  ${index} of ${urlArray.length}`);
                let node = document.createElement('script');
                node.src = `assets/${url}?v=${pjson.version}`;
                node.type = 'text/javascript';
                document.getElementsByTagName('head')[0].appendChild(node);
            });
            // console.clear();
            // console.log(`Javascript is loaded successfull`);
        }
    }

    public loadCss(urlArray) {
        if (urlArray.length) {
            urlArray.forEach(function (url, index) {
                // console.clear();
                // console.log(`preparing to load css...  ${index} of ${urlArray.length}`);
                let node = document.createElement('link');
                node.href = `assets/${url}?v=${pjson.version}`;
                node.rel = 'stylesheet';
                node.type = 'text/css';
                document.getElementsByTagName('head')[0].appendChild(node);
            });
            // console.clear();
            // console.log(`Css is loaded successfull`);
        }
    }

    public appendMyScript(urlArray) {
        if (urlArray.length) {
            urlArray.forEach(function (url) {
                let script = document.createElement('script');
                script.src = `assets/${url}?v=${pjson.version}`;
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);
            });
        }
    }

    public activeLastWeek(dateCheck, nowTimestampLastWeek) {
        let timestemp = new Date(dateCheck);
        return timestemp.getTime() >= nowTimestampLastWeek;
    }

    public getDateTimeNow() {
        let timestemp = new Date();
        return timestemp.getTime();
    }

    public customDateTime(dateTime, timestampLastWeek) {
        if (dateTime == undefined) return '';
        var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let objDate = new Date(dateTime);
        let strTime = '';
        if (this.activeLastWeek(dateTime, timestampLastWeek)) {
            strTime = weekday[objDate.getDay()];
        } else {
            strTime = objDate.toLocaleString("en-us", {month: "short"}) + ' ' + objDate.getDate();
        }

        strTime += ', ' + objDate.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });

        return strTime;
    }

    public callDataJS(dataRequest, callback) {
        $.ajax({
            method: "POST",
            headers: {
                "Authorization": ('Bearer ' + (localStorage.getItem('idToken') || '')),
                "Content-type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Credentials": true,
                "withCredentials": true,
                "credentials": 'same-origin',
            },
            url: dataRequest.url,
            data: dataRequest.data,
            async: true,
            dataType: "json",
            success: function (dataResult) {
                callback(dataResult);
            },
            error: function (jqXHR, exception, error) {
                console.log('ERR Ajax 1: =>', jqXHR);
                console.log('ERR Ajax 2: =>', exception);
                console.log('ERR Ajax 3: =>', error);
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 401) {
                    // localStorage.removeItem('idToken');
                    msg = 'Login Failed. [401]';
                    if (jqXHR.responseJSON !== isUndefined) {
                        if (jqXHR.responseJSON.hasOwnProperty('url')) {
                            window.location.href = jqXHR.responseJSON.url;
                        }
                    }
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
            }
        });
    }

//convert html tag to plain text
    public convertHtmlToPlainText(strHtml) {
        var stringHtml = strHtml !== undefined ? strHtml : '';
        if (stringHtml === '') return;

        return stringHtml.replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/\n/g, '<br>');
    }

    public cnMessagesShow(arrNotify, notify, optionMultis = false) {
        var optionMulti = optionMultis !== undefined ? optionMultis : false;
        var delay = 7500;
        var result = '';
        var date = new Date();
        if (arrNotify.length == 0) {
            return result;
        }

        var type = 'notify';
        if (notify == 'e') {
            type = 'error';
        } else if (notify == 'w') {
            type = 'warnings';
        } else if (notify == 's') {
            type = 'sussce';
        } else if (notify == 'i') {
            // type = 'notification';
        }

        result += '<div class="cn_' + type + '_list">';

        $.each(arrNotify, function (key, value) {
            var nID = 'notify_' + key + date.getSeconds();
            result += '<div class="cn_' + type + '_item" id="' + nID + '"><div><b><a id="alert_pattern-number">' + value + '</a></b></div></div>';
            result += '<script type="text/javascript">this.notify_auto_hide("' + nID + '", "' + type + '", ' + delay + ');<\/script>';
            delay += 1000;
        });

        result += '</div>';
        if (optionMulti) {
            $('[id="message"]:not(#message:first)').remove();
        }

        $('#message').css('display', 'block');
        return result;
    }

    public notify_auto_hide(id, type, delay) {
        var gs = setTimeout(function () {
            $('#' + id).remove();

            if ($('.cn_' + type + '_item').length == 0) {
                $('#message').css('display', 'none');
                $('.cn_' + type + '_list').hide();
            }
        }, delay);
    }

    public ucfirst(str) {
        let string = (str !== undefined ? str : '');
        if (str === '') return '';

        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    public imageToBase64(img) {
        var canvas, ctx, dataURL, base64;
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL("image/png");
        base64 = dataURL.replace(/^data:image\/png;base64,/, "");

        return base64;
    }

    public swap(json) {
        var ret = {};
        for (var key in json) {
            ret[json[key]] = key;
        }
        return ret;
    }

    public convertDataGroupToSingleParticipant(dataRequest, dataAuthor) {
        console.log(dataRequest, dataAuthor);

        let dataResult = $.extend(true, {}, dataRequest);
        dataResult.listParticipant = [];
        dataResult.isTypeSingle = true;

        dataRequest.listParticipant.forEach(function (elem) {
            if (dataAuthor && elem.users_id == dataAuthor) {
                dataResult.listParticipant.push(elem);
            }
        });

        return dataResult
    }
}
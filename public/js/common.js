//All screen
// var io = require('socket.io-client');
var socket = io.connect(document.location.origin);

console.log('call common head', socket);

function callDataJS(dataRequest, callback) {
    $.ajax({
        url: dataRequest.url,
        method: "POST",
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
                msg = 'Login Failed. [401]';
                window.location = '/login';
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
            // $('#post').html(msg);
        }
    });
}

//convert html tag to plain text
function convertHtmlToPlainText(strHtml = '') {
    return strHtml.replace(/&/g, '&amp;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/\n/g, '<br>');
}

function cnMessagesShow(arrNotify, notify, optionMulti = false) {
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
        result += '<script type="text/javascript">notify_auto_hide("' + nID + '", "' + type + '", ' + delay + ');<\/script>';
        delay += 1000;
    });

    result += '</div>';
    if (optionMulti) {
        $('[id="message"]:not(#message:first)').remove();
    }

    $('#message').css('display', 'block');
    return result;
}

function notify_auto_hide(id, type, delay) {
    var gs = setTimeout(function () {
        $('#' + id).remove();

        if ($('.cn_' + type + '_item').length == 0) {
            $('#message').css('display', 'none');
            $('.cn_' + type + '_list').hide();
        }
    }, delay);
}


function randomStringGenerate() {
    return Math.random().toString(36).substring(2);
}
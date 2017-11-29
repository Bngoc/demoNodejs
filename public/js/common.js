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
        error: function (err) {
            console.log(err);
        },
        complete: function () {
            $('#overlay_loading_plan').hide();
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

function cnMessagesShow(arrNotify, notify) {
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
    }else if (notify == 'i') {
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

    $('[id="message"]:not(#message:first)').remove();
    $('#message').css('display', 'block');
    return result;
}

function notify_auto_hide(id, type, delay) {
    var gs = setTimeout(function () {
        $('#' + id).remove();

        if ($('.cn_' + type + '_item').length == 0) {
            $('#message').css('display', 'none');
        }
    }, delay);
}

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


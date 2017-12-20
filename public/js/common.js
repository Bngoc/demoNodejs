//All screen

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

function imageToBase64(img) {
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

// var i = document.getElementById("menu").style;
// if (document.addEventListener) {
//     document.addEventListener('contextmenu', function(e) {
//         var posX = e.clientX;
//         var posY = e.clientY;
//         menu(posX, posY);
//         e.preventDefault();
//     }, false);
//     document.addEventListener('click', function(e) {
//         i.opacity = "0";
//         setTimeout(function() {
//             i.visibility = "hidden";
//         }, 501);
//     }, false);
// } else { // IE < 9
//     document.attachEvent('oncontextmenu', function(e) {
//         var posX = e.clientX;
//         var posY = e.clientY;
//         menu(posX, posY);
//         e.preventDefault();
//     });
//     document.attachEvent('onclick', function(e) {
//         i.opacity = "0";
//         setTimeout(function() {
//             i.visibility = "hidden";
//         }, 501);
//     });
// }
//

function menu(x, y) {
    i.top = y + "px";
    i.left = x + "px";
    i.visibility = "visible";
    i.opacity = "1";
}

$(function() {
    var doubleClicked = false;
    $(document).on("contextmenu", function (e) {
        if(doubleClicked == false) {
            e.preventDefault(); // To prevent the default context menu.
            var windowHeight = $(window).height()/2;
            var windowWidth = $(window).width()/2;
            //When user click on bottom-left part of window
            if(e.clientY > windowHeight && e.clientX <= windowWidth) {
                $("#menu").css("left", e.clientX);
                $("#menu").css("bottom", $(window).height()-e.clientY);
                $("#menu").css("right", "auto");
                $("#menu").css("top", "auto");
            } else if(e.clientY > windowHeight && e.clientX > windowWidth) {
                //When user click on bottom-right part of window
                $("#menu").css("right", $(window).width()-e.clientX);
                $("#menu").css("bottom", $(window).height()-e.clientY);
                $("#menu").css("left", "auto");
                $("#menu").css("top", "auto");
            } else if(e.clientY <= windowHeight && e.clientX <= windowWidth) {
                //When user click on top-left part of window
                $("#menu").css("left", e.clientX);
                $("#menu").css("top", e.clientY);
                $("#menu").css("right", "auto");
                $("#menu").css("bottom", "auto");
            } else {
                //When user click on top-right part of window
                $("#menu").css("right", $(window).width()-e.clientX);
                $("#menu").css("top", e.clientY);
                $("#menu").css("left", "auto");
                $("#menu").css("bottom", "auto");
            }
            $("#menu").fadeIn(500, FocusContextOut());
            doubleClicked = true;
        } else {
            e.preventDefault();
            doubleClicked = false;
            $("#menu").fadeOut(500);
        }
    });

    function FocusContextOut() {
        $(document).on("click", function () {
            doubleClicked = false;
            $("#group-participant").fadeOut(500);
            $(document).off("click");
        });
    }
});

//https://stackoverflow.com/questions/4909167/how-to-add-a-custom-right-click-menu-to-a-webpage
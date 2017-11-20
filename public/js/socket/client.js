socket.on('message', function (message) {
    $('#showmsg').text('The server has a message for you: ' + message);
    console.log(message);
});

socket.on('sendDataPrivate', function (messagensp) {
    var msg = '<li class="replies">'
        + '<img src="http://emilcarlsson.se/assets/mikeross.png" alt=""/>'
        + '<p>' + messagensp + '</p></li>';

    $('#boxMsgChat').append(msg);
    $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, 500);
});
socket.on('sendDataBroadCast', function (messagensp) {
    var msg = '<li class="sent">'
        + '<img src="http://emilcarlsson.se/assets/donnapaulsen.png" alt="">'
        + '<p>' + messagensp + '</p></li>';

    $('#boxMsgChat').append(msg);

    if ($('#boxMsgChat').is(':focus')) {
        $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, 200);
    } else {
        $('#newMsgChat').delay(100).css("display", "block");
    }
});

$(document).ready(function () {
    var sendChatMessage = new SendChatMessage();
    var sendChat = sendChatMessage.eventSendMsg();
    var sendChat = sendChatMessage.getDefaultHeightMsgBox();


    // var textarea = null;
    // window.addEventListener("load", function() {
    //     textarea = window.document.querySelector("textarea");
    //     textarea.addEventListener("change, keyup, keydown, paste, cut", function() {
    //         if(textarea.scrollTop != 0){
    //             textarea.style.height = textarea.scrollHeight + "px";
    //         }
    //     }, false);
    // }, false);
});

var SendChatMessage = function () {
    this.eventSendMsg = function () {
        this.eventClickSend();
        this.eventEnterSend();
        this.eventScrollBottomBoxMsg();

        this.getDefaultHeightMsgBox = function () {
            let heightDefault = this.diffHeightBoxMsg();

            $("#boxChat").attr({'height_default': heightDefault});
            $("#boxChat").attr({'auto_height_box_msg': heightDefault});
            $("#boxChat").css({'min-height': heightDefault});

            this.diffHeightMsg((heightDefault + 26));
            $("#frameListMsg").animate({scrollTop: $("#frameListMsg").height()}, 500);
        };
    };

    // this.changeAutoHeightBoxMsg();
};

SendChatMessage.prototype.diffHeightMsg = function (diffBoxMsg, rsReplie) {
    var diffMessage = $('#frame .content').height() - $('.contact-profile').height();// - diffBoxMsg;

    if (rsReplie) {
        diffBoxMsg = diffBoxMsg - rsReplie + 20;
        $('#boxChat').val('');
        $('#boxChat').css('height', 'auto');
    }

    $('#frameListMsg').css({
        'min-height': (diffMessage - diffBoxMsg),
        'max-height': (diffMessage - diffBoxMsg ),
        // 'height': (diffMessage - diffBoxMsg)
    });
    $('#boxChat').attr('auto_height_box_msg', diffBoxMsg);
};

SendChatMessage.prototype.diffHeightBoxMsg = function () {
    return $("#messageInput").outerHeight(); // $("#boxChat").innerHeight();
};

SendChatMessage.prototype.sendMsg = function (data) {
    socket.emit('sendDataMsg', data);
    $('#boxChat').val('');
    var getH = $('#boxChat').attr('auto_height_box_msg') - $('#boxChat').attr('height_default');
    this.diffHeightMsg(this.diffHeightBoxMsg(), getH);
};

SendChatMessage.prototype.eventClickSend = function () {
    var _this = this;
    $('#sendMessageChat').on('click', function () {
        if ($.trim($('#boxChat').val())) {
            _this.sendMsg($('#boxChat').val());
        }
    });
};

SendChatMessage.prototype.eventEnterSend = function () {
    var _this = this;
    $('#boxChat').keydown(function (event) {
        try {
            if (event.keyCode == 13 && event.shiftKey) {
                _this.changeAutoHeightBoxMsg();
            } else if (event.keyCode == 13) {
                if ($.trim($(this).val())) {
                    _this.sendMsg($(this).val());
                    return false;
                }
            }
        } catch (e) {
        }
    });
};

SendChatMessage.prototype.eventScrollBottomBoxMsg = function () {
    $('#frameListMsg').bind('scroll', function () {
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            $('#newMsgChat').delay(10).css("display", "none");
        }
    });

    $('#notifyNewsSms').on('click', function () {
        $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, 1000);
        $('#newMsgChat').delay(2000).css("display", "none");
    })
};

SendChatMessage.prototype.changeAutoHeightBoxMsg = function () {
    var _this = this;

    $('#boxChat').on('change keyup keydown paste cut', function () {
        $('#boxChat').keyup(function (event) {
            if (event.keyCode != 13) {
                // var getChangeHeight = $(this).attr('auto_height_box_msg');
                // var maxHeight = parseInt($(this).style['max-height']);

                var messageInput = _this.diffHeightBoxMsg();
                _this.diffHeightMsg(messageInput);

                console.log(messageInput, '---------------------');

                console.log(event.keyCode);
            }
        });

        // var getHeight = parseInt($(this).attr('height_default'));
        // var csHeight = parseInt($(this)[0].style.height);
        // const height = $('#boxChat').innerHeight();
        //
        //
        //
        //
        // var getMaxHeight = (maxHeight > csHeight) ? maxHeight : csHeight;
        // console.log('----->', messageInput);
        // overflow-y: scroll

        /*

         var heightChange = $('#boxChat').scrollHeight;
         // var heightChange = (typeof getChangeHeight !== typeof undefined && getChangeHeight !== false) ? parseInt(getChangeHeight) : this.scrollHeight;

         // var maxHeight = Math.max(heightChange, height);
         const defineHeight = 150;
         var rsHeight = null;

         console.log(height, getChangeHeight,'_________', getHeight, '----->', csHeight);

         if (height > getChangeHeight && heightChange < defineHeight) {
         rsHeight = height;
         } else if (height > defineHeight && $(this).val() != '') {
         rsHeight = defineHeight;
         // $(this).attr('auto_height_box_msg', defineHeight);
         // $(this).css('height', defineHeight);
         // } else if ((typeof getChangeHeight !== typeof undefined && getChangeHeight !== false)) {

         } else if ($(this).val() == '') {
         // rsHeight = getHeight;
         } else {
         rsHeight = getChangeHeight;
         }

         console.log('rsHeight', rsHeight, getChangeHeight);
         // if (getChangeHeight < rsHeight)
         // $(this).attr('auto_height_box_msg', rsHeight);

         // $(this).css('height', rsHeight);
         */

    });
};

function textAreaAdjust(o) {

    o.style.height = "1px";
    console.log(o.style.height, 'lllllllllllllllllllllllll', o.scrollHeight);
    console.log(o.offsetHeight, '--------', o.scrollTop, '------', o.scrollHeight);
    o.style.height = (o.scrollHeight) + "px";
    console.log(o.style.height, '22222222222222222222222222222');
    // }
}
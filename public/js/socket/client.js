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
            let realHeghitRaw = $("#messageInput").outerHeight(true);
            let getHeightFrameListMsg = $("#frameListMsg").height();
            let minHeightBoxChat = $('#style-box-sms').attr('min-height');
            let maxHeightBoxChat = $('#style-box-sms').attr('max-height');

            $(".scrollbar").attr({'realHeghitRaw': realHeghitRaw, 'realHeghitChange': realHeghitRaw});

            $("#boxChat").attr({'height_default': heightDefault});
            $("#boxChat").attr({'auto_height_box_msg': heightDefault});
            $("#boxChat").css({'min-height': minHeightBoxChat + 'px'});


            $('#frameListMsg').css({
                'min-height': (getHeightFrameListMsg - minHeightBoxChat - 25),
                // 'max-height': (diffMessage - maxHeightBoxChat - 25),
                'height': 0
            });

            $("#frameListMsg").animate({scrollTop: $("#frameListMsg").height()}, 500);
        };
    };

    // this.changeAutoHeightBoxMsg();
};

SendChatMessage.prototype.diffHeightMsg = function () {
    const minHeightBoxChat = $('#style-box-sms').attr('min-height');
    let realheghitchange = parseInt($('.scrollbar').attr('realheghitchange')) - parseInt($('.scrollbar').attr('realheghitRaw'));

    $('#boxChat').css('height', minHeightBoxChat, '!important');
    $('#boxChat').css('min-height', minHeightBoxChat);

    let heightFrameListMsg = $('#frameListMsg').height() + realheghitchange;
    $('#frameListMsg').css({'min-height': heightFrameListMsg});


    $('.scrollbar').attr('realheghitchange', $('.scrollbar').attr('realheghitRaw'));
    $('#boxChat').val('');
    return false;
};

SendChatMessage.prototype.diffHeightBoxMsg = function () {
    return $("#messageInput").outerHeight(); // $("#boxChat").innerHeight();
};

SendChatMessage.prototype.sendMsg = function () {
    var data = $.trim($('#boxChat').val());
    if (data.length) {
        socket.emit('sendDataMsg', data);
        this.diffHeightMsg();
    }
};

SendChatMessage.prototype.eventClickSend = function () {
    var _this = this;
    $('#sendMessageChat').on('click', function () {
        _this.sendMsg();
    });
};

SendChatMessage.prototype.eventEnterSend = function () {
    var _this = this;
    // create trigger keyUpDown after check enter vs (shift + enter) in textarea
    $('#boxChat').on('keyUpDown', function (e) {
        e.stopPropagation();
        $('#boxChat').on('keyup keydown', function (evt) {
            _this.changeAutoHeightBoxMsg();
        });
    });

    $('#boxChat').on('keypress', function (evt) {
        var valTextarea = $.trim($('#boxChat').val());

        if (evt.shiftKey && evt.keyCode == 13) {
            $('#boxChat').on('keyup keydown cut paste', function (evt) {
                $(this).trigger('keyUpDown');
            });
        } else if (evt.keyCode == 13) {
            _this.sendMsg();
            return false;
        }
        $(this).trigger('keyUpDown');
    });
}

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
let scrollbar = $('.scrollbar').height();
    console.log(scrollbar);

    // var _this = this;
    // var frameListMsg = $('#frameListMsg');
    // if (frameListMsg.scrollTop() + frameListMsg.innerHeight() > frameListMsg[0].scrollHeight) {
    //     var messageInput = this.diffHeightBoxMsg();
    //     this.diffHeightMsg(messageInput);
    // }

    /*$('#boxChat').on('change keyup keydown paste cut', function () {
     $('#boxChat').keyup(function (event) {
     if (event.keyCode != 13) {
     // var getChangeHeight = $(this).attr('auto_height_box_msg');
     // var maxHeight = parseInt($(this).style['max-height']);


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

     /!*

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
     *!/

     });*/
};

$('#frameListMsg').on('changeBoxMsg', function () {
    // console.log(parseInt($('.scrollbar').attr('realheghitchange')), parseInt($('.scrollbar').attr('realheghitraw')));
    let diffChangeBoxMsg = $(this).outerHeight() - $('.scrollbar').outerHeight(true) + 12 + parseInt($('.scrollbar').attr('realheghitraw'));
    $(this).css('min-height', diffChangeBoxMsg);

    // $("#frameListMsg").animate({scrollTop: $('#frameListMsg').outerHeight()}, 1000);
});

function textAreaAdjust(o) {
    // o.style.height = "1px";
    // o.style.height = (o.scrollHeight) + "px";
    //
    // let maxHeight = parseInt($('#style-box-sms').attr('max-height'));
    // $('#boxChat').attr('auto_height_box_msg', ((o.style.height < maxHeight) ? o.style.height : maxHeight));
    //
    // let outerHeight = $('.scrollbar').outerHeight(false);
    // let getRealheghitchange = parseInt($('.scrollbar').attr('realheghitchange'));
    // let getRealheghitRaw = parseInt($('.scrollbar').attr('realheghitraw'));
    //
    // if ((outerHeight > getRealheghitchange && getRealheghitchange <= maxHeight)) {
    //     $('.scrollbar').attr('realheghitchange', (getRealheghitchange <= maxHeight) ? outerHeight : maxHeight);
    //     $('#frameListMsg').trigger('changeBoxMsg');
    // }
    // console.log($('.scrollbar').height(), $('.scrollbar').innerHeight(), $('.scrollbar').outerHeight())
}
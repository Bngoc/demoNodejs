socket.on('message', function (message) {
    $('#showmsg').text('The server has a message for you: ' + message);
});

socket.on('sendDataPrivate', function (messageReplies) {
    var msg = '<li class="replies">'
        + '<img src="http://emilcarlsson.se/assets/mikeross.png" alt=""/>'
        + '<p>' + convertHtmlToPlainText(messageReplies) + '</p></li>';

    $('#boxMsgChat').append(msg);
    $('.contact.active .preview').html('<span>You: </span>' + convertHtmlToPlainText(messageReplies));
    $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, 500);
});

socket.on('sendDataBroadCast', function (messageSent) {

    var msg = '<li class="sent">'
        + '<img src="http://emilcarlsson.se/assets/donnapaulsen.png" alt="">'
        + '<p>' + convertHtmlToPlainText(messageSent) + '</p></li>';

    $('#boxMsgChat').append(msg);

    if ($('#boxMsgChat').is(':focus')) {
        $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, 200);
    } else {
        $('#newMsgChat').delay(100).css("display", "block");
    }
});

socket.on('listUserConversation', function (listConversation) {
    // if (listConversation.isTypeSingle) {
        $('[channel="status.' + listConversation.channel_id + '"]').removeClass(listConversation.listStatus).addClass(listConversation.statusName);
    // }
});

$(document).ready(function () {

    socket.emit('user_id', $('#profile-img').attr('userid'));

    var sendChatMessage = new SendChatMessage();
    sendChatMessage.eventSendMsg();
    sendChatMessage.getDefaultHeightMsgBox();


    $(window).resize(function () {
        sendChatMessage.getDefaultHeightMsgBox();
        $("#frameListMsg").animate({scrollTop: getMinHeightFrameListMsg()}, 500);
    });

    $("#frameListMsg").animate({scrollTop: $('#frameListMsg').height()}, 500);
});

var SendChatMessage = function () {
    this.eventSendMsg = function () {
        this.eventClickSend();
        this.eventEnterSend();
        this.eventscrollTopBoxMsg();

        this.getDefaultHeightMsgBox = function () {
            let heightDefault = this.diffHeightBoxMsg();
            let realHeghitRaw = $("#messageInput").outerHeight(true);
            let minHeightBoxChat = $('#style-box-sms').attr('min-height');

            $(".scrollbar").attr({'realHeghitRaw': realHeghitRaw, 'realHeghitChange': realHeghitRaw});

            $("#boxChat").attr({'height_default': heightDefault});
            $("#boxChat").attr({'auto_height_box_msg': heightDefault});
            $("#boxChat").css({'min-height': minHeightBoxChat + 'px'});

            var minHeightFrameListMsg = getMinHeightFrameListMsg();
            $('#frameListMsg').css({
                'min-height': minHeightFrameListMsg,
                'height': minHeightFrameListMsg
            });
        };

        this.reloadContentBoxChatAjax();
    };
};

SendChatMessage.prototype.diffHeightMsg = function () {
    const minHeightBoxChat = $('#style-box-sms').attr('min-height');

    $('#boxChat').css('height', minHeightBoxChat, '!important');
    $('#boxChat').css('min-height', minHeightBoxChat);

    var minHeightFrameListMsg = getMinHeightFrameListMsg();
    $('#frameListMsg').css({'min-height': minHeightFrameListMsg});
    $('#frameListMsg').attr('box-change-msg', $('#frameListMsg').attr('box-raw-msg'));

    $('.scrollbar').attr('realheghitchange', $('.scrollbar').attr('realheghitRaw'));
    $('#boxChat').val('');
    return false;
};

SendChatMessage.prototype.diffHeightBoxMsg = function () {
    return $("#messageInput").outerHeight();
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
    $('body').on('click', '#sendMessageChat', function () {
        _this.sendMsg();
    });
};

SendChatMessage.prototype.eventEnterSend = function () {
    var _this = this;

    // create trigger keyUpDown after check enter vs (shift + enter) in textarea
    $('body').on('keyUpDown', '#boxChat', function (e) {
        e.stopPropagation();
        // $('#boxChat').on('keyup keydown', function (evt) {
        //     _this.xxxxxxxxxxxxxxxxx();
        // });
    });

    $('body').on('keypress', '#boxChat', function (evt) {
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

SendChatMessage.prototype.eventscrollTopBoxMsg = function () {
    $('body').bind('scroll', '#frameListMsg', function () {
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            $('#newMsgChat').delay(10).css("display", "none");
        }
    });

    $('body').on('click', '#notifyNewsSms', function () {
        $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, 1000);
        $('#newMsgChat').delay(2000).css("display", "none");
    })
};


SendChatMessage.prototype.reloadContentBoxChatAjax = function () {
    var _this = this;
    $('body').on('click', '#contacts li.contact', function () {
        $('li.contact').removeClass('active');
        $(this).addClass('active');

        let imgProfile = $(this).find('.wrap img').attr("src");
        let userName = $(this).find('.meta p.name').text();
        let dataChannelID = $(this).find('.wrap').attr("data-channel");
        let dataOwerID = $(this).find('.wrap').attr("data-ower");
        let dataType = $(this).find('.wrap').attr("data-type");
        let dataConversation = $(this).find('.wrap').attr("data-conversation");

        let dataRequest = {
            url: $('#contacts').attr('data-url'),
            data: {
                imgProfile: '<img src="' + imgProfile + '" alt="">',
                userName: userName,
                dataChannelID: dataChannelID,
                dataOwerID: dataOwerID,
                dataType: dataType,
                dataConversation: dataConversation,
                _method: 'post'
            }
        };

        callDataJS(dataRequest, function (dataResult) {
            if (dataResult.html) {
                $('#content-chat').html(dataResult.html);

                _this.getDefaultHeightMsgBox();
            }
        });
    });

};

$('body').on('input', 'textarea#boxChat', function () {
    $(this).outerHeight(38).outerHeight(this.scrollHeight);
    $('#frameListMsg').attr('box-change-msg', $(this).height());
    $('#frameListMsg').trigger('changeBoxMsg');
});

// add listen trigger changeBoxMsg
$('body').on('changeBoxMsg', '#frameListMsg', function () {
    var minHeightFrameListMsg = getMinHeightFrameListMsg();
    $(this).css({'min-height': minHeightFrameListMsg, 'height': minHeightFrameListMsg});

    if ($('#frameListMsg').attr('box-change-msg') > $('#frameListMsg').attr('box-raw-msg'))
        $("#frameListMsg").animate({scrollTop: getMinHeightFrameListMsg()}, 500);
});


function getMinHeightFrameListMsg() {
    return $(".content").outerHeight() - $(".contact-profile").outerHeight() - $("#messageInput").outerHeight() - 1;
}
// var  reconnection = true,
//     reconnectionDelay = 5000,
//     reconnectionTry = 0;

var socket = io.connect(document.location.origin, {
    rememberTransport: false,
    'reconnect': true,
    'reconnection delay': 500,
    'max reconnection attempts': 10,
    'secure': true,
    'pingInterval': 2000,
    'pingTimeout': 5000
});

// socket.on('disconnect', function () {
//     socket.disconnect();
//     console.log("client disconnected");
//     if (reconnection === true) {
//         setTimeout(function () {
//             console.log("client trying reconnect");
//             connectClient();
//         }, reconnectionDelay);
//     }
// });


socket.on('pong', (data) => {
    console.log('Receive "pong"', data);
});

socket.on('expiresTime60', (str) => {
    console.log('-----------------------', str);
});

socket.emit('ping', "xxxx");

socket.on('message', function (message) {
    $('#showmsg').text('The server has a message for you: ' + message);
});

let s60 = 15000;

setInterval(function () {
    socket.emit('pingServer', {isCheck: true, ttl: 3000});
}, s60);

socket.on('reload', function (data) {
    location.reload();
});

socket.on('sendDataPrivate', function (messageReplies) {
    let domLi = $('#boxMsgChat li:last-child');
    if (domLi.hasClass('replies')) {
        domLi.find('._5wd4:last-child').css({"margin-bottom": "1px"});
        domLi.find('p').css({"border-bottom-right-radius": "0px"});
        let appendMsg = '<div class="_5wd4 _1nc6">'
            + '<p style="border-top-right-radius: 0px;">' + convertHtmlToPlainText(messageReplies.valueMsg) + '</p></div>';

        domLi.find('._ua2').append(appendMsg);
    } else {

        var msg = '<li class="_4tdt replies">'
            + '<div class="_ua2"><div class="_5wd4 _1nc6">'
            + '<p>' + convertHtmlToPlainText(messageReplies.valueMsg) + '</p></div></div></li>';

        $('#boxMsgChat').append(msg);
        // $('.contact.active .preview').html('<span>You: </span>' + convertHtmlToPlainText(messageReplies.valueMsg));
    }
    $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, 500);
});

socket.on('sendDataBroadCast', function (messageSent) {
    let searchDomChannel = $('[channel="status.' + messageSent.channelId + '"]');
    if (searchDomChannel.closest('li').hasClass('active')) {
        let domLi = $('#boxMsgChat li:last-child');
        if (domLi.hasClass('author-' + messageSent.hexClassSend)) {
            domLi.find('._5wd4:last-child').css({"margin-bottom": "1px"});
            domLi.find('p').css({"border-bottom-left-radius": "0px"});

            let appendMsg = '<div class="_5wd4">'
                + '<p style="border-top-left-radius: 0px;">' + convertHtmlToPlainText(messageSent.valueMsg) + '</p></div>';

            domLi.find('._ua2').append(appendMsg);
        } else {
            var msg = '<li class="_4tdt sent author-' + messageSent.hexClassSend + '">'
                + '<div class="_31o4">'
                + '<img src="http://emilcarlsson.se/assets/donnapaulsen.png" alt=""></div>'
                + '<div class="_ua2">'
                + ((messageSent.dataType === 'group') ? ('<div class="_4tdx">' + messageSent.hexClassNameSend.split(' ')[0] + '</div>') : "")
                + '<div class="_5wd4">'
                + '<p>' + convertHtmlToPlainText(messageSent.valueMsg) + '</p>'
                + '</div></div></li>';

            $('#boxMsgChat').append(msg);
        }
        if ($('#boxMsgChat').is(':focus')) {
            $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, 200);
        } else {
            $('#newMsgChat').delay(100).css("display", "block");
        }
    } else {
        let badgesNotify = searchDomChannel.closest('.wrap').find('i.badges-notify');
        if (badgesNotify.length) {
            badgesNotify.addClass('badges-color').text('211');
        }
    }
});

socket.on('listUserConversation', function (listConversation) {
    $('[channel="status.' + listConversation.channel_id + '"]').removeClass(listConversation.listStatus).addClass(listConversation.classCurrentStatus);
});

socket.on('send-data-test', function (listConversation) {
    console.log(listConversation);
});


$(document).ready(function () {
    var sendChatMessage = new SendChatMessage();
    sendChatMessage.eventSendMsg();
    sendChatMessage.getDefaultHeightMsgBox();

    $(window).resize(function () {
        sendChatMessage.getDefaultHeightMsgBox();
        $("#frameListMsg").animate({scrollTop: getMinHeightFrameListMsg()}, 500);
    });

    sendChatMessage.scrollEndShowBoxChat(1500);
});

var SendChatMessage = function () {
    this.eventSendMsg = function () {
        this.eventClickSend();
        this.eventEnterSend();
        this.eventScrollTopBoxMsg();
        this.eventChangeStatusUser();

        this.clickContactContentChat();
        this.clickListContactContentChat();
        this.clickRightContactContentChat();
    };
};

SendChatMessage.prototype.getDefaultHeightMsgBox = function () {
    let heightDefault = this.diffHeightBoxMsg();
    let realHeightRaw = $("#messageInput").outerHeight(true);
    let minHeightBoxChat = $('#style-box-sms').attr('min-height');

    $(".scrollbar").attr({'realHeightRaw': realHeightRaw, 'realHeghitChange': realHeightRaw});

    $("#boxChat").attr({'height_default': heightDefault});
    $("#boxChat").attr({'auto_height_box_msg': heightDefault});
    $("#boxChat").css({'min-height': minHeightBoxChat + 'px'});

    var minHeightFrameListMsg = getMinHeightFrameListMsg();
    $('#frameListMsg').css({
        'min-height': minHeightFrameListMsg,
        'height': minHeightFrameListMsg
    });
};

SendChatMessage.prototype.diffHeightMsg = function () {
    const minHeightBoxChat = $('#style-box-sms').attr('min-height');

    $('#boxChat').css('height', minHeightBoxChat, '!important');
    $('#boxChat').css('min-height', minHeightBoxChat);

    var minHeightFrameListMsg = getMinHeightFrameListMsg();
    $('#frameListMsg').css({'min-height': minHeightFrameListMsg});
    $('#frameListMsg').attr('box-change-msg', $('#frameListMsg').attr('box-raw-msg'));

    $('.scrollbar').attr('realheightchange', $('.scrollbar').attr('realHeightRaw'));
    $('#boxChat').val('');

    return false;
};

SendChatMessage.prototype.diffHeightBoxMsg = function () {
    return $("#messageInput").outerHeight();
};

SendChatMessage.prototype.sendMsg = function () {
    var dataValueMsg = $.trim($('#boxChat').val());
    if (dataValueMsg.length) {
        let messageInput = $('#messageInput');
        let listPart = $.map($('[code-participant-id]'), function (ele) {
            return $(ele).attr("code-participant-id");
        });

        if (window.dataFriend === 'true') {
            let dataSendChat = {
                dataConversation: messageInput.attr('data-conversation'),
                dataChannel: messageInput.attr('data-channel'),
                dataOwer: messageInput.attr('data-owner'),
                dataType: messageInput.attr('data-type'),
                hexClassSend: $('#profile-img').attr('user-code-id'),
                hexClassNameSend: $('#profile .user-name-chat').contents().get(0).nodeValue,
                dataValueMsg: dataValueMsg,
                listCodePart: listPart.join(',')
            };

            socket.emit('sendDataMsg', dataSendChat);
            this.diffHeightMsg();
        }
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

SendChatMessage.prototype.eventScrollTopBoxMsg = function () {
    let _this = this;
    $('body').bind('scroll', '#frameListMsg', function () {
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            $('#newMsgChat').delay(10).css("display", "none");
        }
    });

    $('body').on('click', '#notifyNewsSms', function () {
        _this.scrollEndShowBoxChat(1000);
        $('#newMsgChat').delay(2000).css("display", "none");
    })
};

SendChatMessage.prototype.eventChangeStatusUser = function () {
    $('body').on('click', '#status-options .channel-status', function () {
        let dataValue = $(this).attr('data-value');
        let status = $(this).attr('status');

        if (!$('#profile-img').hasClass(status)) {
            if (typeof dataValue !== typeof undefined && dataValue !== false) {
                var dataRequest = {
                    data: {
                        status: dataValue,
                        _method: 'post'
                    }
                };

                socket.emit('updateUser', dataRequest);
                socket.on('resUpdateUserPrivate', function (resData) {
                    if (resData.status) {
                        $(this).removeClass("active");
                        $(this).addClass("active");
                        $("#profile-img").removeClass(resData.data.listStatus).addClass(resData.data.classCurrentStatus);
                        $("#user-status-current").removeClass(resData.data.listStatus + " status-hover").addClass(resData.data.classCurrentStatus);
                    }
                });
            }
            $("#status-options").removeClass("active");
        }
    });
};

SendChatMessage.prototype.scrollEndShowBoxChat = function (timeAnimal) {
    let timeAnimate = typeof timeAnimal !== 'undefined' ? parseInt(timeAnimal) : 1000;
    $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, timeAnimate);
};


SendChatMessage.prototype.clickRightContactContentChat = function () {
    let _this = this;
    $('body')
        .on("mousedown", "#group-participant .show-info-participants", function (ev) {
            if (ev.which == 1 || ev.which == 3) {
                $('.show-info-participants').removeClass('check-participant');
                $(this).addClass('check-participant');
            }

            if (ev.which == 3) {
                // let menuElement = document.getElementById("menu").style;
                // if (document.addEventListener) {
                //     $(document).on('contextmenu', '#group-participant .info-contextmenu', function (e) {
                //         var posX = e.clientX;
                //         var posY = e.clientY;
                //         _this.contextMenu(menuElement, posX, posY);
                //         e.preventDefault();
                //     }, false);
                //     $(document).on('click', "#group-participant .info-contextmenu", function (e) {
                //         menuElement.opacity = "0";
                //         setTimeout(function () {
                //             menuElement.visibility = "hidden";
                //         }, 501);
                //     }, false);
                // } else { // IE < 9
                //     document.attachEvent('oncontextmenu', function (e) {
                //         var posX = e.clientX;
                //         var posY = e.clientY;
                //         _this.contextMenu(menuElement, posX, posY);
                //         e.preventDefault();
                //     });
                //     document.attachEvent('onclick', function (e) {
                //         menuElement.opacity = "0";
                //         setTimeout(function () {
                //             menuElement.visibility = "hidden";
                //         }, 501);
                //     });
                // }
                // alert("Right mouse button clicked on element with id myId");
            }
        });
}

SendChatMessage.prototype.contextMenu = function (menuElement, x, y) {
    menuElement.top = y + "px";
    menuElement.left = x + "px";
    menuElement.visibility = "visible";
    menuElement.opacity = "1";
}

SendChatMessage.prototype.clickContactContentChat = function () {
    let _this = this;
    let click = 0, delay = 500, timer = null;
    $('body')
        .on('click', '.show-info-participants', function (e) {
            e.preventDefault();
            click++;
            if (click === 1) {
                timer = setTimeout(function () {
                    $('#myModal').modal({
                        show: 'false'
                    });
                    click = 0;
                }, delay);
            } else {
                clearTimeout(timer);
                click = 0;
                let userName = $(this).find('span.status-info-part').attr("data-username");
                let dataChannelID = $(this).find('span.status-info-part').attr("data-channel");
                let valAuthor = $(this).find('span.status-info-part').attr("data-author");
                // let dataType = $(this).find('span.status-info-part').attr("data-type");
                let dataConversation = $(this).find('span.status-info-part').attr("data-conversation");

                let dataRequest = {
                    url: $('#contacts').attr('data-url'),
                    data: {
                        userName: userName,
                        dataChannelID: dataChannelID,
                        // dataOwnerID: dataOwnerID,
                        // dataType: dataType,
                        valAuthor: valAuthor,
                        dataConversation: dataConversation,
                        _method: 'post'
                    }
                };

                _this.reloadContentBoxChatAjax(dataRequest, function () {
                    socket.emit('msgContentChat', dataRequest);
                });
            }
        })
        .on('dblclick', '.show-info-participants', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
}


SendChatMessage.prototype.clickListContactContentChat = function () {
    var _this = this;
    $('body').on('click', '#contacts li.contact', function () {
        $('li.contact').removeClass('active');
        $(this).addClass('active');

        let userName = $(this).find('.meta p.name').contents().get(0).nodeValue;
        let dataChannelID = $(this).find('.wrap').attr("data-channel");
        let dataOwnerID = $(this).find('.wrap').attr("data-owner");
        let dataType = $(this).find('.wrap').attr("data-type");
        let dataConversation = $(this).find('.wrap').attr("data-conversation");

        let dataRequest = {
            url: $('#contacts').attr('data-url'),
            data: {
                userName: userName,
                dataChannelID: dataChannelID,
                dataOwnerID: dataOwnerID,
                dataType: dataType,
                dataConversation: dataConversation,
                _method: 'post'
            }
        };
        _this.reloadContentBoxChatAjax(dataRequest, function () {
            socket.emit('msgContentChat', dataRequest);
        });
    });
}

SendChatMessage.prototype.reloadContentBoxChatAjax = function (dataRequest, callback) {
    callDataJS(dataRequest, function (dataResult) {
        if (dataResult.html) {
            $('#content-chat').html(dataResult.html);
            callback();
        }
    });
};

socket.on('msgContent', function (dataMessage) {
    var sendChatMessage = new SendChatMessage();
    if (dataMessage.isLength) {
        let tempHtml = sendChatMessage.htmlContentBoxChat(dataMessage);
        $('#boxMsgChat').append(tempHtml);
    } else {

    }
    sendChatMessage.getDefaultHeightMsgBox();
    sendChatMessage.scrollEndShowBoxChat(2300);
});


SendChatMessage.prototype.htmlContentBoxChat = function (resultDataMsg) {
    let libCommonChat = new LibCommonChat();
    let resultHtml = '';
    let lengthModel = resultDataMsg.listMsg.length;
    resultDataMsg.listMsg.forEach(function (element, index) {
        let lengthMsg = element.data.length;

        let option = {
            isSingle: element.isSingle,
            isUserCurrent: element.isUserCurrent
        };
        let fsfText = '';
        if (option.isUserCurrent) {
            var htmlText = libCommonChat.supportHtmlTextPrivate(element.contactMessage, option);
        } else {
            var htmlText = libCommonChat.supportHtmlTextOther(element.contactMessage, option);
        }
        element.data.forEach((ele, indx) => {

            let isExitsTypeMsg = resultDataMsg.inversTypeMsg[ele.message_type];
            if (isExitsTypeMsg) {
                let reqOption = {
                    isUserCurrent: option.isUserCurrent,
                    isUserCurrentTemp: (resultDataMsg.option.userCurrentId === ele.sender_id),
                    isLoad: resultDataMsg.option.isLoad,
                    isUserFuture: ((indx + 1) >= lengthMsg) ? false : (element.data[(indx + 1)].sender_id === ele.sender_id),
                    isUserPass: (indx && (indx - 1) < lengthMsg) ? (element.data[(indx - 1)].sender_id === ele.sender_id) : false,
                    isSingle: (resultDataMsg.inversTypeGuid[ele.guid] == 0)
                };
                switch (parseInt(isExitsTypeMsg)) {
                    case 1:
                        fsfText += libCommonChat.zenderHtmlMessageText(ele, reqOption);
                        break;
                    case 2:
                        resultHtml += libCommonChat.zenderHtmlMessageImage();
                        break;
                    case 3:
                        resultHtml += libCommonChat.zenderHtmlMessageVideo();
                        break;
                    case 4:
                        resultHtml += libCommonChat.zenderHtmlMessageAudio();
                        break;
                    default:
                        resultHtml += "";
                }
            }
        });

        resultHtml += htmlText.htmlOpen + fsfText + htmlText.htmlClose;
    });

    return resultHtml;
}
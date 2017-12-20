var socket = io.connect(document.location.origin);

socket.on('message', function (message) {
    $('#showmsg').text('The server has a message for you: ' + message);
});

socket.on('sendDataPrivate', function (messageReplies) {
    var msg = '<li class="replies">'
        + '<img src="http://emilcarlsson.se/assets/mikeross.png" alt=""/>'
        + '<p>' + convertHtmlToPlainText(messageReplies.valueMsg) + '</p></li>';

    $('#boxMsgChat').append(msg);
    // $('.contact.active .preview').html('<span>You: </span>' + convertHtmlToPlainText(messageReplies.valueMsg));
    $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, 500);
});

socket.on('sendDataBroadCast', function (messageSent) {
    let searchDomChannel = $('[channel="status.' + messageSent.channelId + '"]');

    if (searchDomChannel.closest('li').hasClass('active')) {

        var msg = '<li class="sent">'
            + '<img src="http://emilcarlsson.se/assets/donnapaulsen.png" alt="">'
            + '<p>' + convertHtmlToPlainText(messageSent.valueMsg) + '</p></li>';

        $('#boxMsgChat').append(msg);

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

        this.getDefaultHeightMsgBox = function () {
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

        this.clickContactContentChat();
        this.clickListContactContentChat();
        this.clickRightContactContentChat();
    };
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
        if (window.dataFriend === 'true') {
            let dataSendChat = {
                dataConversation: messageInput.attr('data-conversation'),
                dataChannel: messageInput.attr('data-channel'),
                dataOwer: messageInput.attr('data-owner'),
                dataType: messageInput.attr('data-type'),
                dataValueMsg: dataValueMsg
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
                let menuElement = document.getElementById("menu").style;
                if (document.addEventListener) {
                    document.addEventListener('contextmenu', function (e) {
                        var posX = e.clientX;
                        var posY = e.clientY;
                        _this.contextMenu(menuElement, posX, posY);
                        e.preventDefault();
                    }, false);
                    document.addEventListener('click', function (e) {
                        menuElement.opacity = "0";
                        setTimeout(function () {
                            menuElement.visibility = "hidden";
                        }, 501);
                    }, false);
                } else { // IE < 9
                    document.attachEvent('oncontextmenu', function (e) {
                        var posX = e.clientX;
                        var posY = e.clientY;
                        _this.contextMenu(menuElement, posX, posY);
                        e.preventDefault();
                    });
                    document.attachEvent('onclick', function (e) {
                        menuElement.opacity = "0";
                        setTimeout(function () {
                            menuElement.visibility = "hidden";
                        }, 501);
                    });
                }
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
    var _this = this;
    let click = 0;
    $('body')
        .on('click', '.show-info-participants', function (e) {
            e.preventDefault();
            let delay = 500, timer = null;
            click++;
            if (click === 1) {
                // $('.show-info-participants').removeClass('check-participant');
                // $(this).addClass('check-participant');
                timer = setTimeout(function () {
                    $('#myModal').modal({
                        show: 'false'
                    });
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
                _this.reloadContentBoxChatAjax(dataRequest);
            }
        })
        .on('dblclick', '.show-info-participants', function (e) {
            // e.stopPropagation();
            e.preventDefault();
        });
}

// let kj = [];
SendChatMessage.prototype.gdgd = function (boolean) {
    console.log(boolean);
    // kj['count'] = boolean;
    if (boolean) {
        // setTimeout(function () {
        //     if (kj.length == 1) {
        alert("dblclick");
        // kj = [];
        // }
        // }, 3000);
    } else {
        $('#myModal').modal({
            show: 'false'
        });
    }
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
        _this.reloadContentBoxChatAjax(dataRequest);
    });
}

SendChatMessage.prototype.reloadContentBoxChatAjax = function (dataRequest) {
    let _this = this;
    callDataJS(dataRequest, function (dataResult) {
        if (dataResult.html) {
            $('#content-chat').html(dataResult.html);

            _this.getDefaultHeightMsgBox();
            _this.scrollEndShowBoxChat(2300);
        }
    });
};


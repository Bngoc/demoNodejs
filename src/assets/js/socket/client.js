// var socket = io.connect('http://localhost:1230', {
//     rememberTransport: false,
//     'reconnect': true,
//     'reconnection delay': 500,
//     'max reconnection attempts': 10,
//     'secure': true,
//     'pingInterval': 2000,
//     'pingTimeout': 5000
// });


$(document).ready(function () {
    var sendChatMessage = new SendChatMessage();
    sendChatMessage.eventSendMsg();
    sendChatMessage.getDefaultHeightMsgBox();

    $(window).resize(function () {
        sendChatMessage.getDefaultHeightMsgBox();
        $("#frameListMsg").animate({scrollTop: getMinHeightFrameListMsg()}, 500);
    });

    //sendChatMessage.scrollEndShowBoxChat(1500);

    window.listContactYourSingleAction = [];
    window.listContactYourSingle = [];
});

var SendChatMessage = function () {
    this.eventSendMsg = function () {
        this.eventClickSend();
        this.eventEnterSend();
        this.eventClickNotifyBoxMsg();
        this.eventChangeStatusUser();

        this.clickContactContentChat();
        this.clickListContactContentChat();
        this.clickRightContactContentChat();
        this.clickContactAdd();
        this.clickContactSub();
        this.clickContactSearchSingle();
        this.clickActContactConversation();
        this.clickSearchContact();
        this.getListContact();
    };
};

SendChatMessage.prototype.getDefaultHeightMsgBox = function () {
    let heightDefault = this.diffHeightBoxMsg();
    let realHeightRaw = $("#messageInput").outerHeight(true);
    let minHeightBoxChat = $('#style-box-sms').attr('min-height');

    $(".scrollbar").attr({'realHeightRaw': realHeightRaw, 'realHeightChange': realHeightRaw});

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
        let listContact = new listContacts();
        let messageInput = $('#messageInput');
        let listPart = listContact.getListParticipant();

        if (window.dataFriend === 'true') {
            let dataSendChat = {
                dataConversation: messageInput.attr('data-conversation'),
                dataChannel: messageInput.attr('data-channel'),
                dataType: messageInput.attr('data-type'),
                // dataOwner: messageInput.attr('data-owner'),
                // hexClassSend: $('#profile-img').attr('user-code-id'),
                // hexClassNameSend: $('#profile .user-name-chat').contents().get(0).nodeValue,
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

SendChatMessage.prototype.eventClickNotifyBoxMsg = function () {
    let _this = this;

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

SendChatMessage.prototype.clickSearchContact = function () {
    let _this = this;
    let listContact = new listContacts();
    $('body')
        .on('keyup copy cut', '#search-contact', function () {
            let val = $.trim($(this).val());
            let requestListContactDefault = {
                url: '/chat/list-contact',
                data: {
                    dataType: false,
                    isAuthenticatesSingle: false,
                    isSearch: false,
                    valSearch: null,
                    _method: 'post'
                },
                reset: true
            };
            //remain time  or value search length min 3 for reset list contact
            window.remainTime = getDateTimeNow() + 0.1 * 60 * 1000;
            window.reqDataReset = requestListContactDefault;

            listContact.subscribeAfterClickListContact();
            let requestListContact = jQuery.extend(true, {}, requestListContactDefault);

            if (val.length > 2) {
                requestListContact['data']['isSearch'] = true;
                requestListContact['data']['valSearch'] = val;
                requestListContact['reset'] = false;
            }

            listContact.searchListContactListAll(requestListContact);
        });
};

SendChatMessage.prototype.clickRightContactContentChat = function () {
    let _this = this;
    $('body').on("mousedown", "#group-participant .show-info-participants", function (ev) {
        if (ev.which == 1 || ev.which == 3) {
            $('.show-info-participants').removeClass('check-participant');
            $(this).addClass('check-participant');
        }
    });
};

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
                let dataConversation = $(this).find('span.status-info-part').attr("data-conversation");

                let dataRequest = {
                    url: $('#contacts').attr('data-url'),
                    data: {
                        userName: userName,
                        dataChannelID: dataChannelID,
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
};

SendChatMessage.prototype.clickActContactConversation = function () {
    $('body').on('click', '#action-friend .add, #action-friend .create', function () {
        let listContact = new listContacts();
        let dataConversation = $('#messageInput').attr("data-conversation");
        let dataConversationId = (typeof dataConversation !== typeof undefined && dataConversation !== false) ? dataConversation : null;

        let isSingle = window.isSingle === 'true';
        let listParticipant = listContact.clickActionContact();
        let nameListParticipant = listParticipant.nameAuthorId;
        let nameUesrCurrent = $('#profile .user-name-chat')[0].childNodes[0].nodeValue;
        nameListParticipant.unshift(ucfirst(nameUesrCurrent));

        let reqActionConversation = {
            conversationId: (isSingle ? null : dataConversationId),
            userParticipant: (isSingle ? listContact.getListParticipant() : null),
            listAuthorId: listParticipant.authorId,
            isSingle: isSingle,
            act: (isSingle ? 'add' : 'update'),
            title: (isSingle ? nameListParticipant.join(', ') : null)
        };

        socket.emit('updateActionConversationGroup', reqActionConversation);
    });
};

SendChatMessage.prototype.getListContact = function () {
    $('body').on('click', '#list-contact-your', function () {
        let requestListContact = {
            url: '/chat/list-contact',
            data: {
                dataType: $('#messageInput').attr('data-type'),
                isAuthenticatesSingle: true,
                _method: 'post'
            }
        };
        let lisContact = new listContacts();
        let _that = this;
        callDataJS(requestListContact, function (dataResult) {
            if (dataResult.err === '') {
                let top = $('#list-contact-your').height() * 2;
                $('#list-your-friend').css({display: 'block', position: 'absolute', top: top, right: 23});
                $(_that).attr({show: true});

                window.listContactYourSingleAction = [];
                window.listContactYourSingle = dataResult.data;
                $('#list-your-friend').html(lisContact.render(dataResult, window.listContactYourSingleAction));
            }
        });
    });
};

SendChatMessage.prototype.clickContactAdd = function () {
    var _this = this;
    $('body').on('click', '#data-contact li.contact-list', function () {
        let author = $(this).find('[data-author]').attr('data-author');
        if (typeof author !== typeof undefined && author !== false) {
            let authorId = author.split('.')[1];
            let indexFindUser = window.listContactYourSingle.findIndex(x => x.user_id === parseInt(authorId));
            if (indexFindUser !== -1) {
                window.listContactYourSingleAction.push(window.listContactYourSingle[indexFindUser]);
                window.listContactYourSingle.splice(indexFindUser, 1);
            }
            _this.renderHtmlListContact();
        }
    });
};

SendChatMessage.prototype.clickContactSearchSingle = function () {
    var _this = this;
    $('body')
        .on('keyup copy cut', '#search-single', function () {
            let val = $.trim($(this).val());
            let htmlListContact = '';
            let listContact = new listContacts();
            if (val.length > 2) {
                let listContactYourSingleClone = $.extend(true, [], window.listContactYourSingle);
                let arrayTempListContactSingle = listContact.searchLikeContact(listContactYourSingleClone, val);
                htmlListContact = arrayTempListContactSingle.length ? listContact.supportListContact(arrayTempListContactSingle) : 'Not result';
            } else {
                htmlListContact = listContact.supportListContact(window.listContactYourSingle);
            }

            $('#list-contacts').html(htmlListContact);
        })
        .on('focusout', '#search-single', function () {
            var val = $(this).val();
            if (val === '' || $.trim(val) < 3) {
                _this.renderHtmlListContact();
            }
        });
};

SendChatMessage.prototype.clickContactSub = function () {
    var _this = this;
    $('body').on('click', '#box-action-friend i.act-aptach', function () {
        let author = $(this).closest('[data-author]').attr('data-author');
        if (typeof author !== typeof undefined && author !== false) {
            let authorId = author.split('.')[1];
            let indexFindUser = window.listContactYourSingleAction.findIndex(x => x.user_id === parseInt(authorId));
            if (indexFindUser !== -1) {
                window.listContactYourSingle.push(window.listContactYourSingleAction[indexFindUser]);
                window.listContactYourSingle.sort(function (a, b) {
                    return a.created_at - b.created_at;
                });
                window.listContactYourSingleAction.splice(indexFindUser, 1);
            }
            _this.renderHtmlListContact();
        }
    });
};

SendChatMessage.prototype.renderHtmlListContact = function () {
    let listContact = new listContacts();

    let htmlListContactAction = listContact.supportResultContact(window.listContactYourSingleAction);
    $('#box-action-friend').html(htmlListContactAction);
    $('#action-friend .add, #action-friend .create').attr({disabled: !window.listContactYourSingleAction.length});

    let checkInputSearch = $.trim($('#search-single').val());
    let htmlListContact = '';
    if (checkInputSearch.length > 2) {
        let listContactYourSingleClone = $.extend(true, [], window.listContactYourSingle);
        let arrayTempListContactSingle = listContact.searchLikeContact(listContactYourSingleClone, checkInputSearch);
        htmlListContact = arrayTempListContactSingle.length ? listContact.supportListContact(arrayTempListContactSingle) : 'Not result';
    } else {
        htmlListContact = listContact.supportListContact(window.listContactYourSingle);
    }

    $('#list-contacts').html(htmlListContact);
};

SendChatMessage.prototype.clickTaskContactChat = function () {
    console.log('clickTaskContactChat');
};

SendChatMessage.prototype.clickListContactContentChat = function () {
    var _this = this;
    $('body').on('click', '#contacts li.contact', function () {
        // $('li.contact').removeClass('active');
        // $(this).addClass('active');

        let userName = $(this).find('.meta p.name').attr('data-conversation-name');
        let dataChannelID = $(this).find('.wrap').attr("data-channel");
        let dataOwnerID = $(this).find('.wrap').attr("data-owner");
        let dataConversation = $(this).find('.wrap').attr("data-conversation");

        let dataRequest = {
            url: $('#contacts').attr('data-url'),
            data: {
                userName: userName,
                dataChannelID: dataChannelID,
                dataOwnerID: dataOwnerID,
                dataConversation: dataConversation,
                _method: 'post'
            }
        };
        _this.reloadContentBoxChatAjax(dataRequest, function () {
            socket.emit('msgContentChat', dataRequest);
        });
    });
}

SendChatMessage.prototype.eventScrollEndBoxChat = function () {
    //     $('#newMsgChat').delay(10).css("display", "none");
    console.log('-------------------------- lam cai day');
}

SendChatMessage.prototype.eventScrollTopBoxChat = function () {
    let page = $('#frameListMsg').has('page') ? $('#frameListMsg').attr('page') : 1;

    let dataRequest = {
        data: {
            dataChannelID: $('#messageInput').has('data-channel') ? $('#messageInput').attr('data-channel') : null,
            page: $('#frameListMsg').has('page') ? $('#frameListMsg').attr('page') : 1,
            dataConversation: $('#messageInput').has('data-conversation') ? $('#messageInput').attr('data-conversation') : null,
            isScrollTop: true
        }
    };
    setTimeout(function () {
        socket.emit('msgContentChat', dataRequest);
    }, 1000);

};

SendChatMessage.prototype.reloadContentBoxChatAjax = function (dataRequest, callback) {
    callDataJS(dataRequest, function (dataResult) {
        if (dataResult.html) {
            $('#content-chat').html(dataResult.html);
            callback();
        }
    });
};

SendChatMessage.prototype.htmlContentBoxChat = function (resultDataMsg) {
    let libCommonChat = new LibCommonChat();

    resultDataMsg.listMsg.forEach(function (element) {
        let lengthMsg = element.data.length;
        let msgLastElementsMsg = $('#boxMsgChat li:last-child');
        let msgFirstElementsMsg = $('#boxMsgChat li:first-child');
        if (lengthMsg) {
            let option = {
                isSingle: element.isSingle,
                isUserCurrent: element.isUserCurrent
            };
            let resultHtml = '';
            let dataListContactTemp = resultDataMsg.isLoadTop ? element.data.reverse() : element.data;
            let isExitsElementEnd = resultDataMsg.isLoadTop === false ? element.isUserCurrent ? msgLastElementsMsg.hasClass('replies') : msgLastElementsMsg.hasClass('author-' + element.contactMessage.id) : false;
            let isExitsElementFirst = resultDataMsg.isLoadTop === true ? (element.isUserCurrent ? msgFirstElementsMsg.hasClass('replies') : msgFirstElementsMsg.hasClass('author-' + element.contactMessage.id)) : false;
            dataListContactTemp.forEach((ele, indx) => {

                let isExitsTypeMsg = resultDataMsg.inverseTypeMsg[ele.message_type];
                if (isExitsTypeMsg) {
                    let reqOption = {
                        isUserCurrent: option.isUserCurrent,
                        isSingle: option.isSingle,
                        isLoad: resultDataMsg.option.isLoad,
                        isUserFuture: (indx < (lengthMsg - 1) || isExitsElementFirst) ? true : false,
                        isUserPass: ((indx && indx <= (lengthMsg - 1)) || isExitsElementEnd) ? true : false,
                    };
                    switch (parseInt(isExitsTypeMsg)) {
                        case 1:
                            resultHtml += libCommonChat.supportHtmlTextAppend(ele, reqOption);
                            break;
                        case 2:
                            resultHtml += libCommonChat.renderHtmlMessageImage();
                            break;
                        case 3:
                            resultHtml += libCommonChat.renderHtmlMessageVideo();
                            break;
                        case 4:
                            resultHtml += libCommonChat.renderHtmlMessageAudio();
                            break;
                        default:
                            resultHtml += "";
                    }
                }
            });

            if (resultDataMsg.isLoadTop === true) {
                if (option.isUserCurrent === true) {
                    if (msgFirstElementsMsg.hasClass('replies')) {
                        msgFirstElementsMsg.find('p').addClass('top-right');
                        msgFirstElementsMsg.find('._ua2').prepend(resultHtml);
                        let tempFirstEle = $('#boxMsgChat li:first-child').find('._ua2 ._5wd4:first-child');
                        tempFirstEle.find('p').addClass('bottom-right');
                        tempFirstEle.addClass('bottom-m1');
                    } else {
                        var htmlTextTopPrivate = libCommonChat.supportHtmlTextPrivate(element.contactMessage, option);
                        $('#boxMsgChat').prepend(htmlTextTopPrivate.htmlOpen + resultHtml + htmlTextTopPrivate.htmlClose);
                    }
                } else {
                    if (msgFirstElementsMsg.hasClass('author-' + element.contactMessage.id)) {
                        msgFirstElementsMsg.find('p').addClass('top-left');
                        let get_4tdx = msgFirstElementsMsg.find('._ua2 ._4tdx');
                        msgFirstElementsMsg.find('._ua2 ._4tdx').remove();
                        msgFirstElementsMsg.find('._ua2').prepend(resultHtml);
                        msgFirstElementsMsg.find('._ua2').prepend(get_4tdx);
                    } else {
                        option.lastCreatedAt = element.data[element.data.length - 1].created_at;
                        var htmlTextTopOther = libCommonChat.supportHtmlTextOther(element.contactMessage, option);
                        $('#boxMsgChat').prepend(htmlTextTopOther.htmlOpen + resultHtml + htmlTextTopOther.htmlClose);
                    }
                }
            } else {
                if (option.isUserCurrent === true) {
                    if (msgLastElementsMsg.hasClass('replies')) {
                        msgLastElementsMsg.find('p').addClass('bottom-right');
                        msgLastElementsMsg.find('._ua2').append(resultHtml);
                    } else {
                        var htmlTextEndPrivate = libCommonChat.supportHtmlTextPrivate(element.contactMessage, option);
                        $('#boxMsgChat').append(htmlTextEndPrivate.htmlOpen + resultHtml + htmlTextEndPrivate.htmlClose);
                    }
                } else {
                    if (msgLastElementsMsg.hasClass('author-' + element.contactMessage.id)) {
                        msgLastElementsMsg.find('p').addClass('bottom-left');
                        msgLastElementsMsg.find('._ua2').append(resultHtml);
                    } else {
                        option.lastCreatedAt = element.data[element.data.length - 1].created_at;
                        var htmlTextEndOther = libCommonChat.supportHtmlTextOther(element.contactMessage, option);
                        $('#boxMsgChat').append(htmlTextEndOther.htmlOpen + resultHtml + htmlTextEndOther.htmlClose);
                    }
                }
            }
            // resultHtml += htmlText.htmlOpen + resultHtml + htmlText.htmlClose;
        }
    });

    return true;
}

// socket.on('pong', (data) => {
//     console.log('Receive "pong"', data);
// });

socket.on('expiresTime60', (str) => {
    console.log('-----------------------', str);
});

// socket.emit('ping', "xxxx");

socket.on('message', function (message) {
    $('#showmsg').text('The server has a message for you: ' + message);
});

// let s60 = 15000;
//
// setInterval(function () {
//     socket.emit('pingServer', {isCheck: true, ttl: 3000});
// }, s60);

socket.on('reload', function (data) {
    location.reload();
});

socket.on('sendDataPrivate', function (messageReplies) {
    let sendChatMessage = new SendChatMessage();
    let tempHtml = sendChatMessage.htmlContentBoxChat(messageReplies);
    sendChatMessage.scrollEndShowBoxChat(1000);
    // $('#frameListMsg').trigger('changeBoxMsg');
});

socket.on('sendDataBroadCast', function (messageSent) {
    let searchDomChannel = $('[channel="status.' + messageSent.channelId + '"]');
    if (searchDomChannel.closest('li').hasClass('active')) {
        let sendChatMessage = new SendChatMessage();
        let tempHtml = sendChatMessage.htmlContentBoxChat(messageSent);
        if ($('#boxMsgChat').is(':focus')) {
            sendChatMessage.scrollEndShowBoxChat(1000);
            // $('#frameListMsg').trigger('changeBoxMsg');
            //     $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, 200);
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

socket.on('msgContent', function (dataMessage) {
    activeListContact(dataMessage.channelId);

    if (dataMessage.isLength) {
        var sendChatMessage = new SendChatMessage();
        let oldScrollHeight = $("#frameListMsg")[0].scrollHeight;
        sendChatMessage.htmlContentBoxChat(dataMessage);

        sendChatMessage.getDefaultHeightMsgBox();
        if (dataMessage.isScrollTop === false) {
            sendChatMessage.scrollEndShowBoxChat(0);
        } else {
            $('#frameListMsg').animate({scrollTop: ($('#frameListMsg')[0].scrollHeight - oldScrollHeight)}, 100);
        }
    } else {

    }
});
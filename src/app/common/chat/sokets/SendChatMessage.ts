'use strict';

import {ListContacts} from "../supports/ListContacts";
import {LibCommonChat} from "../supports/LibCommonChat";
declare var jQuery: any;
declare var $: any;
declare var require: any;
import * as io from 'socket.io-client';
import {libSupports} from "../../libSupports";
import {isUndefined} from "util";
import {ShowContentChat} from "../supports/ShowContentChat";

// $(document).ready(function () {
//     var sendChatMessage = new SendChatMessage();
//     sendChatMessage.eventSendMsg();
//     sendChatMessage.getDefaultHeightMsgBox();
//
//     $(window).resize(function () {
//         sendChatMessage.getDefaultHeightMsgBox();
//         $("#frameListMsg").animate({scrollTop: getMinHeightFrameListMsg()}, 500);
//     });
//
//     //sendChatMessage.scrollEndShowBoxChat(1500);
//
//     window.listContactYourSingleAction = [];
//     window.listContactYourSingle = [];
// });

export class SendChatMessage extends libSupports {

    public listContactYourSingleAction: any = [];
    public listContactYourSingle: any = [];
    public isSingle;

    constructor() {
        super();
    }

    runInitChatMessage = function (opt, socket) {
        this.clickContactContentChat(socket);
        this.getDefaultHeightMsgBox();
        this.eventClickNotifyBoxMsg();
        this.clickRightContactContentChat();
        this.clickContactAdd();
        this.clickContactSub();
        this.clickContactSearchSingle();
        this.clickSearchContact(opt.remainTime);
        this.getListContact();
        this.clickShowParticipantProfile();
    };

    getDefaultHeightMsgBox = function () {
        let heightDefault = this.diffHeightBoxMsg();
        let realHeightRaw = $("#messageInput").outerHeight(true);
        let minHeightBoxChat = $('#style-box-sms').attr('min-height');

        $(".scrollbar").attr({'realHeightRaw': realHeightRaw, 'realHeightChange': realHeightRaw});

        $("#boxChat").attr({'height_default': heightDefault});
        $("#boxChat").attr({'auto_height_box_msg': heightDefault});
        $("#boxChat").css({'min-height': minHeightBoxChat + 'px'});

        let libcCommonChat = new LibCommonChat();
        var minHeightFrameListMsg = libcCommonChat.getMinHeightFrameListMsg();
        $('#frameListMsg').css({
            'min-height': minHeightFrameListMsg,
            'height': minHeightFrameListMsg
        });
    };

    diffHeightMsg = function () {
        const minHeightBoxChat = $('#style-box-sms').attr('min-height');

        $('#boxChat').css('height', minHeightBoxChat, '!important');
        $('#boxChat').css('min-height', minHeightBoxChat);
        let libcCommonChat = new LibCommonChat();
        var minHeightFrameListMsg = libcCommonChat.getMinHeightFrameListMsg();
        $('#frameListMsg').css({'min-height': minHeightFrameListMsg});
        $('#frameListMsg').attr('box-change-msg', $('#frameListMsg').attr('box-raw-msg'));

        $('.scrollbar').attr('realheightchange', $('.scrollbar').attr('realHeightRaw'));
        $('#boxChat').val('');

        return false;
    };

    diffHeightBoxMsg = function () {
        return $("#messageInput").outerHeight();
    };

    sendMsg = function (socket, isDataFriend) {
        var dataValueMsg = $.trim($('#boxChat').val());
        if (dataValueMsg.length) {
            let listContact = new ListContacts();
            let messageInput = $('#messageInput');
            let listPart = listContact.getListParticipant();

            if (isDataFriend === true) {
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

    eventClickSend = function (socket, isDataFriend) {
        var that = this;
        $('body').on('click', '#sendMessageChat', function () {
            that.sendMsg(socket, isDataFriend);
        });
    };

    eventEnterSend = function (socket, isDataFriend) {
        var that = this;

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
                that.sendMsg(socket, isDataFriend);
                return false;
            }
            $(this).trigger('keyUpDown');
        });
    };

    eventClickNotifyBoxMsg = function () {
        let that = this;
        $('body').on('click', '#notifyNewsSms', function () {
            that.scrollEndShowBoxChat(1000);
            $('#newMsgChat').delay(2000).css("display", "none");
        })
    };

    eventChangeStatusUser = function (socket) {
        var that = this;
        $('body').on('click', '#status-options .channel-status', function () {
            var elem = this;
            let dataValue = $(elem).attr('data-value');
            let status = $(elem).attr('status');

            // let checkStatus = $('#status-options .channel-status').hasClass('active') ? 1: 0;
            let checkStatus = $('#status-options .channel-status').filter(function (index, elem) {
                if ($(elem).hasClass('active')) {
                    return $(elem).attr('status');
                }
            });
            if (checkStatus.length) {
                if ($(checkStatus).attr('status') != status) {
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
                                $('#status-options .channel-status').removeClass("active");
                                $(elem).addClass("active");
                                $("#profile-img").removeClass(resData.data.listStatus).addClass(resData.data.classCurrentStatus);
                                $("#user-status-current").removeClass(resData.data.listStatus + " status-hover").addClass(resData.data.classCurrentStatus);
                            }
                        });
                    }
                    $("#status-options").removeClass("active");
                }
            }
        });
    };

    scrollEndShowBoxChat = function (timeAnimal) {
        let timeAnimate = typeof timeAnimal !== 'undefined' ? parseInt(timeAnimal) : 1000;
        $("#frameListMsg").animate({scrollTop: $("#frameListMsg")[0].scrollHeight}, timeAnimate);
    };

    clickSearchContact = function (remainTime) {
        let that = this;
        let listContact = new ListContacts();
        $('body').on('keyup copy cut', '#search-contact', function () {
            let val = $.trim($(this).val());
            let requestListContactDefault = {
                url: $('#box-search-contacts').attr('data-url'),
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
            listContact.subscribeAfterClickListContact((that.getDateTimeNow() + remainTime), requestListContactDefault);

            let requestListContact = jQuery.extend(true, {}, requestListContactDefault);
            if (val.length > 2) {
                requestListContact['data']['isSearch'] = true;
                requestListContact['data']['valSearch'] = val;
                requestListContact['reset'] = false;
            }

            listContact.searchListContactListAll(requestListContact);
        });
    };

    clickRightContactContentChat = function () {
        let that = this;
        $('body').on("mousedown", "#group-participant .show-info-participants", function (ev) {
            if (ev.which == 1 || ev.which == 3) {
                $('.show-info-participants').removeClass('check-participant');
                $(this).addClass('check-participant');
            }
        });
    };

    clickContactContentChat = function (socket) {
        let that = this;
        let click = 0, delay = 500, timer = null;
        $('body')
            .on('click', '.show-info-participants', function (e) {
                e.preventDefault();
                click++;
                if (click === 1) {
                    timer = setTimeout(function () {
                        $('#myModalParticipant').modal({
                            show: 'false'
                        });
                        click = 0;
                    }, delay);
                } else {
                    clearTimeout(timer);
                    click = 0;
                    that.clickTaskContactChat($(this), socket);
                }
            })
            .on('dblclick', '.show-info-participants', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
    };

    clickActContactConversation = function (socket, isSingle) {
        var that = this;
        $('body').on('click', '#action-friend .add, #action-friend .create', function () {
            let listContact = new ListContacts();
            let dataConversation = $('#messageInput').attr("data-conversation");
            let dataConversationId = (typeof dataConversation !== typeof isUndefined && dataConversation !== false) ? dataConversation : null;

            let listParticipant = listContact.clickActionContact();
            let nameListParticipant = listParticipant['nameAuthorId'];
            let nameUesrCurrent = $('#profile .user-name-chat')[0].childNodes[0].nodeValue;
            nameListParticipant.unshift(that.ucfirst(nameUesrCurrent));

            let reqActionConversation = {
                conversationId: (isSingle ? null : dataConversationId),
                userParticipant: (isSingle ? listContact.getListParticipant() : null),
                listAuthorId: listParticipant['authorId'],
                isSingle: isSingle,
                act: (isSingle ? 'add' : 'update'),
                title: (isSingle ? nameListParticipant.join(', ') : null)
            };

            socket.emit('updateActionConversationGroup', reqActionConversation);
        });
    };

    getListContact = function () {
        var that = this;
        $('body').on('click', '#list-contact-your', function () {
            let requestListContact = {
                url: $('#box-search-contacts').attr('data-url'),
                data: {
                    dataType: $('#messageInput').attr('data-type'),
                    isAuthenticatesSingle: true,
                    _method: 'post'
                }
            };
            let elem = this;
            let lisContact = new ListContacts();
            lisContact.callDataJS(requestListContact, function (dataResult) {
                if (dataResult.err === '') {
                    let top = $('#list-contact-your').height() * 2;
                    $('#list-your-friend').css({display: 'block', position: 'absolute', top: top, right: 23});
                    $(elem).attr({show: true});

                    that.listContactYourSingleAction = [];
                    that.listContactYourSingle = dataResult.data;
                    $('#list-your-friend').html(lisContact.render(dataResult, that.listContactYourSingleAction));
                }
            });
        });
    };

    clickContactAdd = function () {
        var that = this;
        $('body').on('click', '#data-contact li.contact-list', function () {
            let author = $(this).find('[data-author]').attr('data-author');
            if (typeof author !== typeof undefined && author !== false) {
                let authorId = author.split('.')[1];
                let indexFindUser = that.listContactYourSingle.findIndex(x => x.user_id === parseInt(authorId));
                if (indexFindUser !== -1) {
                    that.listContactYourSingleAction.push(that.listContactYourSingle[indexFindUser]);
                    that.listContactYourSingle.splice(indexFindUser, 1);
                }
                that.renderHtmlListContact();
            }
        });
    };

    clickContactSearchSingle = function () {
        var that = this;
        $('body')
            .on('keyup copy cut', '#search-single', function () {
                let val = $.trim($(this).val());
                let htmlListContact = '';
                let listContact = new ListContacts();
                if (val.length > 2) {
                    let listContactYourSingleClone = $.extend(true, [], that.listContactYourSingle);
                    let arrayTempListContactSingle = listContact.searchLikeContact(listContactYourSingleClone, val);
                    htmlListContact = arrayTempListContactSingle.length ? listContact.supportListContact(arrayTempListContactSingle) : 'Not result';
                } else {
                    htmlListContact = listContact.supportListContact(that.listContactYourSingle);
                }

                $('#list-contacts').html(htmlListContact);
            })
            .on('focusout', '#search-single', function () {
                var val = $(this).val();
                if (val === '' || $.trim(val) < 3) {
                    that.renderHtmlListContact();
                }
            });
    };

    clickContactSub = function () {
        var that = this;
        $('body').on('click', '#box-action-friend i.act-aptach', function () {
            let author = $(this).closest('[data-author]').attr('data-author');
            if (typeof author !== typeof undefined && author !== false) {
                let authorId = author.split('.')[1];
                let indexFindUser = that.listContactYourSingleAction.findIndex(x => x.user_id === parseInt(authorId));
                if (indexFindUser !== -1) {
                    that.listContactYourSingle.push(that.listContactYourSingleAction[indexFindUser]);
                    that.listContactYourSingle.sort(function (a, b) {
                        return a.created_at - b.created_at;
                    });
                    that.listContactYourSingleAction.splice(indexFindUser, 1);
                }
                that.renderHtmlListContact();
            }
        });
    };

    renderHtmlListContact = function () {
        let listContact = new ListContacts();
        let htmlListContactAction = listContact.supportResultContact(this.listContactYourSingleAction);
        $('#box-action-friend').html(htmlListContactAction);
        $('#action-friend .add, #action-friend .create').attr({disabled: !this.listContactYourSingleAction.length});

        let checkInputSearch = $.trim($('#search-single').val());
        let htmlListContact = '';
        if (checkInputSearch.length > 2) {
            let listContactYourSingleClone = $.extend(true, [], this.listContactYourSingle);
            let arrayTempListContactSingle = listContact.searchLikeContact(listContactYourSingleClone, checkInputSearch);
            htmlListContact = arrayTempListContactSingle.length ? listContact.supportListContact(arrayTempListContactSingle) : 'Not result';
        } else {
            htmlListContact = listContact.supportListContact(this.listContactYourSingle);
        }

        $('#list-contacts').html(htmlListContact);
    };

    clickTaskContactChat = function (ele, socket) {
        if (ele.length) {
            let userName = ele.find('span.status-info-part').attr("data-username");
            let dataChannelID = ele.find('span.status-info-part').attr("data-channel");
            let valAuthor = ele.find('span.status-info-part').attr("data-author");
            let dataConversation = ele.find('span.status-info-part').attr("data-conversation");

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
            let self = this;
            self.reloadContentBoxChatAjax(dataRequest, function (resultData) {
                self.renderHtmlContentBoxChat(socket, resultData, function () {
                    if (resultData.booleanConversation) {
                        socket.emit('msgContentChat', dataRequest);
                        self.getDefaultHeightMsgBox();
                    }
                });
            });
        }
    };

    clickListContactContentChat = function (socket, callback) {
        var that = this;
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
            that.reloadContentBoxChatAjax(dataRequest, function (dataResult) {
                that.renderHtmlContentBoxChat(socket, dataResult, function () {
                    if (dataResult.booleanConversation) {
                        socket.emit('msgContentChat', dataRequest);
                        that.getDefaultHeightMsgBox();
                    }
                    let isSingle = dataResult.hasOwnProperty('isTypeSingle') ? dataResult.isTypeSingle : null;
                    callback({isDataFriend: dataResult.isFriendCurrentSingle, isSingle: isSingle});
                });
            });
        });
    };

    clickShowParticipantProfile = function () {
        $('body').on('click', '#participant-profile', function () {
            $('#myModalParticipant').modal({
                show: 'false'
            });

            console.log('333333333333333333333333');
            // $('body').css({"opacity": 0.5});
            // $('#modal-box-profile').css({"opacity": "1 !important", "z-index": 999999, "display": "block", "position": "absolute", "left": 333, "top": 30})
        });
    }

    eventScrollEndBoxChat = function () {
        //     $('#newMsgChat').delay(10).css("display", "none");
        console.log('-------------------------- lam cai day');
    };

    eventScrollTopBoxChat = function (socket) {
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

    reloadContentBoxChatAjax = function (dataRequest, callback) {
        var that = this;
        this.callDataJS(dataRequest, function (dataResult) {
            callback(dataResult);
        });
    };

    renderHtmlContentBoxChat = function (socket, dataResult, callback) {
        let showContentChat = new ShowContentChat();
        $('#content-chat').html(showContentChat.isShowContentChat(dataResult));
        //------------------XXXXXXXXXX---------------------------
        $('#boxChat').css({
            "max-height": parseInt(dataResult.maxHeightInputBoxChat),
            "height": parseInt(dataResult.minHeightBoxChat)
        });
        $('#style-box-sms').css({"max-height": parseInt(dataResult.maxHeightBoxChat)});
        $('#create-tooltip .tooltiptext').css({display: 'none'});
        $('#list-your-friend').css({'display': 'none'});

        /// ACCEPTED
        if (dataResult.booleanConversation) {
            if (!dataResult.isFriendCurrentSingle) {
                $("#messageInput").addClass("disabled-element");
                $("#frameListMsg").addClass("remove-scrollbar");
                $("#boxChat").attr("placeholder", 'Messsaging disabled until request is accepted');

                //css box chat with not friend
                $('#messageInput .btn-controler-act').remove();
                $('#boxChat').addClass('cuts-box-chat-clear center-placeholder');
            }
        } else {
            // REQUSET
            $("#messageInput").addClass("disabled-element");
            $("#frameListMsg").addClass("remove-scrollbar");
            $("#boxChat").attr("placeholder", 'Messsaging disabled until request is accepted');

            //css box chat with not friend
            $('#messageInput .btn-controler-act').remove();
            $('#boxChat').addClass('cuts-box-chat-clear center-placeholder');
        }
        //---------------------------------------------
        callback();
    };

    htmlContentBoxChat = function (resultDataMsg) {
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
                            option['lastCreatedAt'] = element.data[element.data.length - 1].created_at;
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
                            option['lastCreatedAt'] = element.data[element.data.length - 1].created_at;
                            var htmlTextEndOther = libCommonChat.supportHtmlTextOther(element.contactMessage, option);
                            $('#boxMsgChat').append(htmlTextEndOther.htmlOpen + resultHtml + htmlTextEndOther.htmlClose);
                        }
                    }
                }
                // resultHtml += htmlText.htmlOpen + resultHtml + htmlText.htmlClose;
            }
        });

        return true;
    };

    scrollListener = function (socket) {
        var that = this;
        let elem = document.getElementById('frameListMsg');
        if (elem) {
            elem.addEventListener("scroll", function (e) {
                var frameListMsg = document.getElementById('frameListMsg');
                let scrollTop = frameListMsg.scrollTop;
                if (scrollTop === 0) {
                    frameListMsg.setAttribute('page', (parseInt(frameListMsg.getAttribute('page')) + 1).toString());
                    that.eventScrollTopBoxChat(socket);
                }

                if (scrollTop + $('#frameListMsg').innerHeight() >= $('#frameListMsg')[0].scrollHeight) {
                    that.eventScrollEndBoxChat();
                }
            }, false);
        }
    };

    activeListContact = function (channelId) {
        $('#contacts li.contact').removeClass('active');
        $('[channel="status.' + channelId + '"]').closest('li').addClass('active');
    };

    getAttributesJavaScript = function (elementJavaScript, attr) {
        return elementJavaScript.attributes[attr].nodeValue || null;
    };

    hasClassJavaScript = function (elementJavaScript, className) {
        return elementJavaScript.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    };

    addClassJavaScript = function (elementJavaScript, className) {
        if (!this.hasClassJavaScript(elementJavaScript, className)) elementJavaScript.className += " " + className;
    };

    removeClassJavaScript = function (elementJavaScript, className) {
        if (this.hasClassJavaScript(elementJavaScript, className)) {
            var reg = new RegExp('(\\s|^)' + elementJavaScript + '(\\s|$)');
            elementJavaScript.className = elementJavaScript.className.replace(reg, ' ');
        }
    };

    scrollContentChat = function () {
        $('#content-chat').css({"width": ($('#frame').width() - $('#sidepanel').width() )});
    }
}


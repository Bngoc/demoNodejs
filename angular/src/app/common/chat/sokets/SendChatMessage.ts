'use strict';

import {ListContacts} from "../supports/ListContacts";
import {LibCommonChat} from "../supports/LibCommonChat";
import {libSupports} from "../../libSupports";
import {ShowContentChat} from "../supports/ShowContentChat";
import {ShowProfileParticipantChat} from "../supports/ShowProfileParticipantChat";
import {MenuInfoChat} from "../supports/MenuInfoChat";
import {EmojiHtmlChat} from "../supports/EmojiHtmlChat";
import {AuthService} from "../../../services/auth/auth.service";

declare var jQuery: any;
declare var $: any;
declare var require: any;
declare var window: any;

export class SendChatMessage extends libSupports {

    public listContactYourSingleAction: any = [];
    public listContactYourSingle: any = [];
    public dataConversationProfile: any = {};

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
        this.clickSearchContact(opt.remainTimeDefault);
        this.getListContact();
        this.clickShowParticipantProfile();
        this.clickSearchContacts(opt.remainTimeSearch);
        this.clickAddContact(socket, opt.remainTimeSearch);
        this.clickResultAddContact(socket);
        this.commonGlobalDefault(opt);
        this.eventChangeStatusUser(socket);

        //add available list contacts
        window.listContacts = opt.listContacts;
        window.widthEmoji = 300;
        window.heightEmoji = 200;
    };

    commonGlobalDefault = function (opt) {
        let resetListContactDefault = {
            url: opt.urlAction.urlListContact,
            data: {
                dataType: false,
                isAuthenticatesSingle: false,
                isSearch: false,
                valSearch: null,
                _method: 'POST'
            },
            reset: true
        };
        window.requestListContactDefault = resetListContactDefault;
    };

    runInitMenuInfoChat = function (socket) {
        let menuInfoChat = new MenuInfoChat();
        menuInfoChat.contextListener();
        menuInfoChat.clickListener(this, socket);
        menuInfoChat.keyupListener();
        menuInfoChat.resizeListener();
        this.clickShowEmoji();
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
        // left - bottom notification newMsgChat
        $('#newMsgChat').css({
            "bottom": parseInt(heightDefault) + 4 + 'px',
            "left": ($('#content-chat').width() / 2 - $('#newMsgChat').width() / 2) + 'px'
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
        let self = this;
        self.delayKeyUp(() => {
            self.eventDisplayEmoji();
            let dataValueMsg = $.trim($('#boxChat').val());
            if (dataValueMsg.length) {
                let listContact = new ListContacts();
                let emojiHtmlChat = new EmojiHtmlChat();
                let messageInput = $('#messageInput');
                let listPart = listContact.getListParticipant();

                if (isDataFriend === true) {
                    let dataSendChat = {
                        dataConversation: messageInput.attr('data-conversation'),
                        dataChannel: messageInput.attr('data-channel'),
                        dataType: messageInput.attr('data-type'),
                        dataValueMsg: emojiHtmlChat.convertEmojiToText(emojiHtmlChat.convertEmoji(dataValueMsg)),
                        listCodePart: listPart.join(',')
                    };

                    socket.emit('sendDataMsg', dataSendChat);
                    self.diffHeightMsg();
                }
            }
        }, 300);
    };

    eventClickSend = function (socket, isDataFriend) {
        let that = this;
        $('body').on('click', '#sendMessageChat', function () {
            that.sendMsg(socket, isDataFriend);
        });
    };

    eventEnterSend = function (socket, isDataFriend) {
        let that = this;
        // create trigger keyUpDown after check enter vs (shift + enter) in textarea
        $('body').on('keyUpDown', '#boxChat', function (e) {
            that.eventDisplayEmoji();
            let libCommonChat = new LibCommonChat();
            let emojiHtmlChat = new EmojiHtmlChat();
            $('#boxChat').val(emojiHtmlChat.convertEmoji(libCommonChat.convertHtmlToPlainText($('#boxChat').val())));
            e.stopPropagation();
        });

        $('body').on('keypress', '#boxChat', function (evt) {
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
                                _method: 'POST'
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
            //remain time or value search length min 3 for reset list contact
            window.remainTime = that.getDateTimeNow() + remainTime;
            listContact.subscribeAfterClickListContact();

            let requestListContact = jQuery.extend(true, {}, window.requestListContactDefault);
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
                let self = this;
                e.preventDefault();
                click++;
                if (click === 1) {
                    timer = setTimeout(function () {
                        let dataAuthor = $(self).find('span[data-author]').attr('data-author');
                        let showProfileParticipantChat = new ShowProfileParticipantChat();
                        showProfileParticipantChat.renderHtmlProfileParticipants(that.convertDataGroupToSingleParticipant(that.dataConversationProfile, dataAuthor), function () {
                            $('#myModalParticipant').modal({
                                show: 'false'
                            });
                            click = 0;
                        });

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
            let dataConversationId = (typeof dataConversation !== typeof undefined && dataConversation !== false) ? dataConversation : null;

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
            $('#list-your-friend').css({display: "none"});
        });
    };

    getListContact = function () {
        var that = this;
        $('body').on('click', '#list-contact-your', function () {
            window.remainTime = 1;
            let requestListContact = {
                url: $('#box-search-contacts').attr('data-url'),
                data: {
                    dataType: $('#messageInput').attr('data-type'),
                    isAuthenticatesSingle: true,
                    _method: 'POST'
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
                userName: userName,
                dataChannelID: dataChannelID,
                valAuthor: valAuthor,
                dataConversation: dataConversation,
            };
            let self = this;
            self.activeListContact(null);
            self.reloadContentBoxChatAjax(dataRequest, socket, function (resultCallback) {
                // callback(resultCallback);
            });
        }
    };

    clickListContactContentChat = function (socket, callback) {
        var that = this;
        $('body').on('click', '#contacts li.contact', function () {
            let userName = $(this).find('.meta p.name').attr('data-conversation-name');
            let dataChannelID = $(this).find('.wrap').attr("data-channel");
            let dataOwnerID = $(this).find('.wrap').attr("data-owner");
            let dataConversation = $(this).find('.wrap').attr("data-conversation");
            let valAuthor = $(this).find('.wrap').attr("data-author");
            let dataRequest = {
                url: $('#contacts').attr('data-url'),
                userName: userName,
                dataChannelID: dataChannelID,
                dataOwnerID: dataOwnerID,
                dataConversation: dataConversation,
                valAuthor: valAuthor
            };
            let elem = this;
            that.reloadContentBoxChatAjax(dataRequest, socket, function (resultCallback) {
                that.activeListContact(elem);
                // callback(resultCallback);
                that.readyChatParticipant(socket, resultCallback, () => callback(resultCallback));
            });
        });
    };

    readyChatParticipant = function (socket, resultReadyChat, callback: any = false) {
        jQuery.extend(window.dataGlobal.urlAction, resultReadyChat.dataResult.urlAction);
        if (resultReadyChat.isDataFriend === true) {
            let isDataFriend = true;
            this.eventClickSend(socket, isDataFriend);
            this.eventEnterSend(socket, isDataFriend);
            this.runInitMenuInfoChat(socket);
            this.renderShowEmoji();
        }
        if (resultReadyChat.isSingle !== null) {
            let isSingle = true;
            this.clickActContactConversation(socket, isSingle);
        }

        this.scrollListener(socket);
        this.scrollContentChat();

        if (typeof callback === "function") callback(resultReadyChat);
    };

    reloadContentBoxChatAjax = function (request, socket, callback) {
        let self = this;
        let dataRequest = {
            url: request.hasOwnProperty('url') && request.url ? request.url : '',
            data: {
                userName: request.hasOwnProperty('userName') && request.userName ? request.userName : 'undefined user',
                dataChannelID: request.hasOwnProperty('dataChannelID') && request.dataChannelID ? request.dataChannelID : null,
                dataOwnerID: request.hasOwnProperty('dataOwnerID') && request.dataOwnerID ? request.dataOwnerID : null,
                dataConversation: request.hasOwnProperty('dataConversation') && request.dataConversation ? request.dataConversation : null,
                valAuthor: request.hasOwnProperty('valAuthor') && request.valAuthor ? request.valAuthor : null,
                _method: 'POST',
                currentUserID: AuthService.decodeToken()['wft90'].users_id
            }
        };

        this.callDataJS(dataRequest, function (dataResult) {
            self.renderHtmlContentBoxChat(socket, dataResult, function () {
                if (dataResult.booleanConversation) {
                    socket.emit('msgContentChat', dataRequest);
                    self.getDefaultHeightMsgBox();
                }
                let isSingle = dataResult.hasOwnProperty('isTypeSingle') ? dataResult.isTypeSingle : null;
                callback({isDataFriend: dataResult.isFriendCurrentSingle, isSingle: isSingle, dataResult: dataResult});
            });
        });
    };

    clickShowParticipantProfile = function () {
        let self = this;
        $('body').on('click', '#participant-profile', function () {
            let showProfileParticipantChat = new ShowProfileParticipantChat();

            showProfileParticipantChat.renderHtmlProfileParticipants(self.dataConversationProfile, function () {
                $('#myModalParticipant').modal({
                    show: 'false'
                });
            });
        });
    };

    clickAddContact = function (socket, remainTime) {
        let self = this;
        $('body').on('click', '#add-contact-user, #resend-contact-request', function () {
            let checkParticopantId = $('#extend-participant i[code-participant-id]').attr('code-participant-id');
            let participantID = typeof checkParticopantId !== "undefined" ? checkParticopantId : null;
            let userName = $('#participant-user-name').text();
            let resendRequest = $(this).attr('data-act-request');
            let conversationID = $(this).attr('data-conversation');
            let requestData = {
                url: window.dataGlobal.urlAction.hasOwnProperty('actionAddContact') ? window.dataGlobal.urlAction.actionAddContact : null,
                data: {
                    participantID: participantID,
                    infoParticipant: {userName: userName},
                    resendRequest: (typeof resendRequest !== "undefined" ? resendRequest : null),
                    conversationID: (typeof conversationID !== "undefined" ? conversationID : null),
                    _method: "POST"
                }
            };
            let elem = this;
            if (requestData.url) {
                let listContact = new ListContacts();
                self.callDataJS(requestData, function (result) {
                    let dataResult = result.data;
                    window.remainTime = self.getDateTimeNow() + remainTime;
                    window.valSearchAnonymous = true;
                    if (dataResult.resendRequest == 1) {
                        let dataRequest = {
                            url: dataResult.url,
                            userName: dataResult.userName,
                            dataChannelID: dataResult.dataChannelID,
                            dataOwnerID: dataResult.dataOwnerID,
                            dataConversation: dataResult.dataConversation,
                            valAuthor: dataResult.valAuthor
                        };

                        self.reloadContentBoxChatAjax(dataRequest, socket, () => {
                            listContact.subscribeAfterClickListContact(() => self.activeListContact(elem, dataResult.dataChannelID));
                        });
                    } else {
                        $(elem).attr({'disabled': true});
                        listContact.subscribeAfterClickListContact(() => self.activeListContact(elem, dataResult.dataChannelID));
                    }
                });
            }
        });
    };

    clickResultAddContact = function (socket) {
        let self = this;
        $('body').on('click', '#reply-accept-user, #reply-decline-user', function () {
            let dataActResult = $(this).attr('data-act-result');
            let userName = $('#participant-user-name').text();
            let userRequest = $('#extend-participant').find('i[code-participant-id]').attr('code-participant-id');
            let conversationID = $('#request-area-contact').attr('data-conversation');
            let reqResultAddContact = {
                url: window.dataGlobal.urlAction.hasOwnProperty('actionAcceptContact') ? window.dataGlobal.urlAction.actionAcceptContact : null,
                data: {
                    dataActResult: dataActResult,
                    userRequest: userRequest,
                    userName: userName,
                    conversationID: conversationID,
                    _method: "POST"
                }
            };
            if (reqResultAddContact.url) {
                let listContact = new ListContacts();
                self.callDataJS(reqResultAddContact, (resultContact) => {
                    socket.emit('resultAcceptDeclineContact', resultContact);
                    if (resultContact.option.hasOwnProperty('activeResult')) {
                        let opt = {
                            userName: userName,
                            booleanActiveResult: resultContact.option.activeResult,
                        };

                        self.reloadContentChatBox(resultContact, opt, socket);
                    }
                });
            }
        });
    };

    renderShowEmoji = function () {
        let self = this;
        $('#boxChat').emojiPicker({
            width: `${window.widthEmoji}px`,
            height: `${window.heightEmoji}px`,
            button: false,
            position: 'right',
            fadeTime: 100,
            container: '#show-emoji-chat',
        });
        $('#show-emoji-chat').css({display: 'none'})
    };

    clickShowEmoji = function () {
        let self = this;
        $('body').on('click', '#click-emoji-chat', function () {
            // $('#boxChat').emojiPicker({
            //     width: `${window.widthEmoji}px`,
            //     height: `${window.heightEmoji}px`,
            //     button: false,
            //     position: 'right',
            //     fadeTime: 100,
            //     container: '#show-emoji-chat',
            // });
            self.eventPositionEmoji();
        });
    };

    eventDisplayEmoji = function () {
        $('#show-emoji-chat').css({display: "none"});
    };

    eventPositionEmoji = function (isResize: any = false) {
        if (isResize && $('#show-emoji-chat').css('display') == 'block' || !isResize && $('#show-emoji-chat').css('display') == 'none') {
            let offsetEmoji = $('#click-emoji-chat').offset();
            $('#show-emoji-chat').css({
                display: 'block',
                width: window.widthEmoji,
                height: window.heightEmoji,
                position: "absolute",
                // bottom: (offsetEmoji.top - 20),
                top: (offsetEmoji.top - 2 * window.heightEmoji + 15),
                left: ($('#frameListMsg').width() - window.widthEmoji + $('#click-emoji-chat').position().left)
            });
            $('.emojiPicker').css({display: "block", position: "unset"});
        } else {
            this.eventDisplayEmoji();
        }
    };


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

    renderHtmlContentBoxChat = function (socket, dataRequest, callback) {
        let showContentChat = new ShowContentChat();
        this.dataConversationProfile = dataRequest;
        $('#content-chat').html(showContentChat.getShowContentChat(dataRequest));
        //------------------XXXXXXXXXX---------------------------
        $('#boxChat').css({
            "max-height": parseInt(dataRequest.maxHeightInputBoxChat),
            "height": parseInt(dataRequest.minHeightBoxChat)
        });
        $('#style-box-sms').css({"max-height": parseInt(dataRequest.maxHeightBoxChat)});
        $('#create-tooltip .tooltiptext').css({display: 'none'});
        $('#list-your-friend').css({'display': 'none'});

        /// ACCEPTED
        if (dataRequest.booleanConversation) {
            if (!dataRequest.isFriendCurrentSingle) {
                $("#messageInput").addClass("disabled-element");
                $("#frameListMsg").addClass("remove-scrollbar");
                $("#boxChat").attr("placeholder", 'Messsaging disabled until request is accepted');

                //css box chat with not friend
                $('#messageInput .btn-controler-act').remove();
                $('#boxChat').addClass('cuts-box-chat-clear center-placeholder');
            }
        } else {
            // REQUEST
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

    clickSearchContacts = function (remainTimeSearch) {
        let that = this;
        $('body').on('click', '#searchContacts', function () {
            window.remainTime = that.getDateTimeNow() + remainTimeSearch;
            let listContact = new ListContacts();
            listContact.searchOnContacts(window.listContacts);
        });
    };

    // clickEmojiBoxChat = function () {
    //     $('body').on('click', '#call-emoji-chat', function () {
    //         let emojiHtmlChat = new EmojiHtmlChat();
    //
    //     });
    // };

    sendDataBroadCast = function (messageSent) {
        let searchDomChannel = $('[channel="status.' + messageSent.channelId + '"]');
        if (searchDomChannel.closest('li').hasClass('active')) {
            this.htmlContentBoxChat(messageSent);
            if ($('#boxMsgChat').is(':focus')) {
                this.scrollEndShowBoxChat(1000);
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
    };

    msgContent = function (dataMessage) {
        if (dataMessage.isLength) {
            let oldScrollHeight = $("#frameListMsg")[0].scrollHeight;
            this.htmlContentBoxChat(dataMessage);
            this.getDefaultHeightMsgBox();
            if (dataMessage.isLoadTop === false) {
                this.scrollEndShowBoxChat(0);
            } else {
                $('#frameListMsg').animate({scrollTop: ($('#frameListMsg')[0].scrollHeight - oldScrollHeight)}, 100);
            }
        }
    };

    createConversationGroup = function (resultConversationGroup, socket) {
        if (resultConversationGroup.done == true) {
            let opt = {
                userName: resultConversationGroup.option.userNameGroup,
                booleanActiveResult: true,
            };
            this.reloadContentChatBox(resultConversationGroup, opt, socket);
            // let listContact = new ListContacts();
            // window.remainTime = 1;//that.getDateTimeNow() + remainTime;
            // window.valSearchAnonymous = true;
            // listContact.subscribeAfterClickListContact();
        }
    };

    reloadContentChatBox = function (resultContact, opt, socket) {
        window.remainTime = 1;
        window.valSearchAnonymous = true;
        let listContact = new ListContacts();
        let dataRequest = {
            url: window.dataGlobal.urlAction.hasOwnProperty('urlChangeContent') ? window.dataGlobal.urlAction.urlChangeContent : null,
            userName: opt.userName,
            dataChannelID: opt.booleanActiveResult && resultContact.data.hasOwnProperty('dataChannelID') ? resultContact.data.dataChannelID : null,
            dataOwnerID: resultContact.data.valAuthor,
            dataConversation: opt.booleanActiveResult && resultContact.data.hasOwnProperty('dataConversation') ? resultContact.data.dataConversation : null,
            valAuthor: resultContact.option.activeResult ? null : resultContact.data.valAuthor
        };

        if (dataRequest.url) {
            this.reloadContentBoxChatAjax(dataRequest, socket, (resultReload) => {
                this.readyChatParticipant(socket, resultReload, (result) => {
                    listContact.subscribeAfterClickListContact(() => {
                        let dataChannelID = (result.dataResult.hasOwnProperty('dataChannelId')) ? result.dataResult.dataChannelId : null;
                        this.activeListContact(null, dataChannelID);
                    });
                });
            });
        }
    };

    activeListContact = function (elem, channelId = null) {
        $('#contacts li.contact').removeClass('active');

        if (channelId) $('[channel="status.' + channelId + '"]').closest('li').addClass('active');
        else if (elem) $(elem).closest('li').addClass('active');
        else {
        }
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
        $('#content-chat').css({"width": ($('#frame').width() - $('#sidepanel').width())});
    }
}


'use strict';
declare var require: any;
declare var $: any;
import {Component, ViewEncapsulation, OnInit, OnDestroy} from '@angular/core';
import {ApiServiceChat} from './../../services/api-chat.sevice'
import * as io from 'socket.io-client';
import {Subscription} from 'rxjs/Subscription';
import {libSupports} from "../../../common/libSupports";
import {ListContacts} from "../../../common/chat/supports/ListContacts";
import {SendChatMessage} from "../../../common/chat/sokets/client";
import {LibCommonChat} from "../../../common/chat/supports/LibCommonChat";


@Component({
    selector: 'app-contents-chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ChatComponent extends libSupports implements OnInit, OnDestroy {
    private url;
    private socket;
    error: any;
    resultData: any = {};
    rsData: Subscription;
    listContactYourSingleAction: any = [];
    listContactYourSingle: any = [];
    dataFriend: any;
    isSingle: any;

    constructor(private apiServiceChat: ApiServiceChat) {
        super();
        this.url = this.urlSide();

    }

    keys(obj): Array<string> {
        return obj ? Object.keys(obj) : null;
    }

    ngOnInit() {
        this.socket = io(this.url);
        this.loadCss([
            // 'css/chat.custom.css',
            'css/chat.test.css',
            "css/fix-angular5.css"
        ]);

        this.appendMyScript([
            'js/common.js',
            "js/support/menu-info-chat.js",
            "js/support/libCommonChat.js",
            "js/support/listContacts.js",
            // 'js/socket/client.js',
            'js/socket/chat.js'
        ]);

        var sendChatMessage = new SendChatMessage();
        sendChatMessage.getDefaultHeightMsgBox();

        sendChatMessage.eventClickSend(this.socket);
        sendChatMessage.eventEnterSend();
        sendChatMessage.eventClickNotifyBoxMsg();
        sendChatMessage.eventChangeStatusUser(this.socket);
        sendChatMessage.clickContactContentChat(this.socket);
        sendChatMessage.clickListContactContentChat(this.socket);
        sendChatMessage.scrollListener(this.socket);
        sendChatMessage.clickRightContactContentChat();
        sendChatMessage.clickContactAdd();
        sendChatMessage.clickContactSub();
        sendChatMessage.clickContactSearchSingle();
        sendChatMessage.clickActContactConversation();
        sendChatMessage.clickSearchContact();
        sendChatMessage.getListContact();

        $(window).resize(function () {
            sendChatMessage.getDefaultHeightMsgBox();
            let libcCommonChat = new LibCommonChat();
            $("#frameListMsg").animate({scrollTop: libcCommonChat.getMinHeightFrameListMsg()}, 500);
        });
        sendChatMessage.scrollEndShowBoxChat(1500);

        this.listContactYourSingleAction = [];
        this.listContactYourSingle = [];


        let rsData = this.apiServiceChat
            .getIndexChat()
            .subscribe(resp => {
                if (resp.err == '' && resp.code == null) {
                    this.resultData = resp.data;
                    let listContact = new ListContacts();
                    let dataContactList = resp.data.dataContactList;
                    listContact.showContactListAll(JSON.parse(resp.data.dataContactList));
                }
            }, err => this.error = err);


        // socket.on('pong', (data) => {
//     console.log('Receive "pong"', data);
// });

        this.socket.on('expiresTime60', (str) => {
            console.log('-----------------------', str);
        });

// socket.emit('ping', "xxxx");

        this.socket.on('message', function (message) {
            $('#showmsg').text('The server has a message for you: ' + message);
        });

// let s60 = 15000;
//
// setInterval(function () {
//     socket.emit('pingServer', {isCheck: true, ttl: 3000});
// }, s60);

        this.socket.on('reload', function (data) {
            location.reload();
        });

        this.socket.on('sendDataPrivate', function (messageReplies) {
            let sendChatMessage = new SendChatMessage();
            let tempHtml = sendChatMessage.htmlContentBoxChat(messageReplies);
            sendChatMessage.scrollEndShowBoxChat(1000);
            // $('#frameListMsg').trigger('changeBoxMsg');
        });

        this.socket.on('sendDataBroadCast', function (messageSent) {
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

        this.socket.on('listUserConversation', function (listConversation) {
            $('[channel="status.' + listConversation.channel_id + '"]').removeClass(listConversation.listStatus).addClass(listConversation.classCurrentStatus);
        });

        this.socket.on('send-data-test', function (listConversation) {
            console.log(listConversation);
        });

        this.socket.on('msgContent', function (dataMessage) {
            this.activeListContact(dataMessage.channelId);

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

    }

    ngOnDestroy() {
        this.rsData.unsubscribe();
    }
}

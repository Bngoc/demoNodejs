'use strict';
declare var require: any;
declare var $: any;
import {Component, ViewEncapsulation, OnInit, OnDestroy} from '@angular/core';
import {ApiServiceChat} from './../../services/api-chat.sevice'
import * as io from 'socket.io-client';
import {Subscription} from 'rxjs/Subscription';
import {libSupports} from "../../../common/libSupports";
import {ListContacts} from "../../../common/chat/supports/ListContacts";
import {SendChatMessage} from "../../../common/chat/sokets/SendChatMessage";
import {LibCommonChat} from "../../../common/chat/supports/LibCommonChat";
import {isBoolean} from "util";

@Component({
    selector: 'app-contents-chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ChatComponent extends libSupports implements OnInit, OnDestroy {
    private url;
    private socket;
    private sendChatMessage: any;
    error: any;
    resultData: any = {};
    rsData: Subscription;
    // listContactYourSingleAction: any = [];
    // listContactYourSingle: any = [];
    dataFriend: any;
    isSingle: any;
    remainTime: number;

    constructor(private apiServiceChat: ApiServiceChat) {
        super();
        this.url = this.urlSide();
        let rsData = this.apiServiceChat
            .getIndexChat()
            .subscribe(resp => {
                if (resp.err == '' && resp.code == null) {
                    this.resultData = resp.data;
                    let dataFriend = resp.data.listStatus;

                    let listContact = new ListContacts();
                    listContact.showContactListAll(JSON.parse(resp.data.dataContactList));

                    let sendChatMessage = new SendChatMessage();
                    sendChatMessage.eventClickSend(this.socket, dataFriend);
                    sendChatMessage.eventEnterSend(this.socket, dataFriend);
                }
            }, err => this.error = err);
    }

    ngOnInit() {
        this.remainTime = (0.4 * 60 * 1000);

        this.socket = io(this.url);

        this.loadCss([
            // 'css/chat.custom.css',
            'css/chat.test.css',
            "css/fix-bst2-to-bst3-angular5.css"
        ]);

        this.appendMyScript([
            'js/common.js',
            // "js/support/menu-info-chat.js",
            // "js/support/libCommonChat.js",
            // "js/support/listContacts.js",
            // 'js/socket/client.js',
            'js/socket/chat.js'
        ]);

        this.sendChatMessage = new SendChatMessage();

        this.sendChatMessage.getDefaultHeightMsgBox();
        this.sendChatMessage.eventClickNotifyBoxMsg();
        // this.sendChatMessage.eventClickSend(this.socket, this.dataFriend);
        // this.sendChatMessage.eventEnterSend(this.socket, this.dataFriend);
        this.sendChatMessage.clickContactContentChat(this.socket);
        this.sendChatMessage.clickListContactContentChat(this.socket);
        this.sendChatMessage.scrollListener(this.socket);
        this.sendChatMessage.clickRightContactContentChat();
        this.sendChatMessage.clickContactAdd();
        this.sendChatMessage.clickContactSub();
        this.sendChatMessage.clickContactSearchSingle();
        this.sendChatMessage.clickActContactConversation(this.socket);
        this.sendChatMessage.clickSearchContact(this.remainTime);
        this.sendChatMessage.getListContact();

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

        this.reload();

        this.sendDataPrivate();

        this.sendDataBroadCast();

        this.listUserConversation();

        this.sendDataTest();

        this.msgContent();

        //C1 CLICK-STRATUS - bo click in template chat
        // this.sendChatMessage.eventChangeStatusUser(this.socket);
    }

    //C2 CLICK-STRATUS -
    ngClickChangeStatusUser(event: Event, elem): void {
        this.sendChatMessage.eventChangeStatusUser(this.socket);
    };

    onResize() {
        this.sendChatMessage.getDefaultHeightMsgBox();
        // let libcCommonChat = new LibCommonChat();
        // $("#frameListMsg").animate({scrollTop: libcCommonChat.getMinHeightFrameListMsg()}, 500);
    }

    keys(obj): Array<string> {
        return obj ? Object.keys(obj) : null;
    }

    reload() {
        let that = this;
        this.socket.on('reload', function (data) {
            location.reload();
        });
    }

    sendDataPrivate() {
        let that = this;
        this.socket.on('sendDataPrivate', function (messageReplies) {
            let sendChatMessage = new SendChatMessage();
            let tempHtml = sendChatMessage.htmlContentBoxChat(messageReplies);
            sendChatMessage.scrollEndShowBoxChat(1000);
            // $('#frameListMsg').trigger('changeBoxMsg');
        });
    }

    sendDataBroadCast() {
        let that = this;
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
    }

    listUserConversation() {
        let that = this;
        this.socket.on('listUserConversation', function (listConversation) {
            $('[channel="status.' + listConversation.channel_id + '"]').removeClass(listConversation.listStatus).addClass(listConversation.classCurrentStatus);
        });
    }

    sendDataTest() {
        let that = this;
        this.socket.on('send-data-test', function (listConversation) {
            console.log(listConversation);
        });
    }

    msgContent() {
        let that = this;
        var sendChatMessage = new SendChatMessage();
        that.socket.on('msgContent', function (dataMessage) {

            sendChatMessage.activeListContact(dataMessage.channelId);

            if (dataMessage.isLength) {
                let oldScrollHeight = $("#frameListMsg")[0].scrollHeight;
                sendChatMessage.htmlContentBoxChat(dataMessage);

                sendChatMessage.getDefaultHeightMsgBox();
                if (dataMessage.isLoadTop === false) {
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

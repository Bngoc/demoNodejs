'use strict';

declare var require: any;
declare var $: any;
declare var window: any;
declare var jQuery: any;
import {Component, ViewEncapsulation, OnInit, OnDestroy} from '@angular/core';
import {ApiServiceChat} from '../../services/api-chat.service'
import * as io from 'socket.io-client';
import {Subscription} from 'rxjs/Subscription';
import {libSupports} from "../../../common/libSupports";
import {ListContacts} from "../../../common/chat/supports/ListContacts";
import {SendChatMessage} from "../../../common/chat/sokets/SendChatMessage";
import {LibCommonChat} from "../../../common/chat/supports/LibCommonChat";
import {isBoolean} from "util";
import {Router} from '@angular/router';
import {MenuInfoChat} from "../../../common/chat/supports/MenuInfoChat";


@Component({
    selector: 'app-contents-chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ChatComponent extends libSupports implements OnInit, OnDestroy {
    private url;
    private sendChatMessage: any;
    private menuInfoChat: any;
    error: any;
    resultData: any = {};
    rsData: Subscription;
    isDataFriend: any = false;
    isSingle: any = false;
    remainTimeDefault: number;
    remainTimeSearch: number;
    socket: any;
    messageError: any;

    constructor(private apiServiceChat: ApiServiceChat, private router: Router) {
        super();
        this.url = this.urlSide();
    }

    ngOnInit() {

        this.remainTimeDefault = (0.3 * 60 * 1000);
        this.remainTimeSearch = (1 * 60 * 1000);
        this.sendChatMessage = new SendChatMessage();
        this.menuInfoChat = new MenuInfoChat();
        this.loadCss([
            // 'css/chat/chat.custom.css',
            'css/chat/chat.test.css',
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
        let self = this;
        let rsData = this.apiServiceChat
            .getIndexChat()
            .subscribe(resp => {
                if (resp.err == '' && resp.code == null) {
                    this.resultData = resp.data;
                    let dataFriend = resp.data.listStatus;
                    let resultListContacts = JSON.parse(resp.data.dataContactList);

                    let listContact = new ListContacts();
                    listContact.showContactListAll(resultListContacts);
                    let socket = io(this.url);
                    this.socket = socket;

                    window.dataGlobal = {
                        urlAction: {
                            urlListContact: this.resultData.urlListContact,
                            urlChangeContent: this.resultData.urlChangeContent
                        }
                    };

                    let optionInit = {
                        remainTimeDefault: this.remainTimeDefault,
                        remainTimeSearch: this.remainTimeSearch,
                        listContacts: resultListContacts.contactList,
                        urlAction: window.dataGlobal.urlAction
                    };
                    this.sendChatMessage.runInitChatMessage(optionInit, socket);
                    this.sendChatMessage.clickListContactContentChat(socket, function (resultCallback) {
                        jQuery.extend(window.dataGlobal.urlAction, resultCallback.dataResult.urlAction);
                        if (resultCallback.isDataFriend === true) {
                            self.isDataFriend = true;
                            self.sendChatMessage.eventClickSend(socket, self.isDataFriend);
                            self.sendChatMessage.eventEnterSend(socket, self.isDataFriend);
                            self.menuInfoChat.runInit(socket);
                        }
                        if (resultCallback.isSingle !== null) {
                            self.isSingle = true;
                            self.sendChatMessage.clickActContactConversation(socket, self.isSingle);
                        }

                        self.sendChatMessage.scrollListener(socket);
                        self.sendChatMessage.scrollContentChat();
                    });

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

                    this.reload(socket);
                    this.sendDataPrivate(socket);
                    this.sendDataBroadCast(socket);
                    this.listUserConversation(socket);
                    this.sendDataTest(socket);
                    this.msgContent(socket);

                    //C1 CLICK-STRATUS - bo click in template chat
                    // this.sendChatMessage.eventChangeStatusUser(socket);
                }
            }, err => {
                this.error = err;
                console.log(this.error);
                if (err.error.hasOwnProperty('url')) {
                    window.location.href = err.error.url;
                } else {
                    // this.router.navigate([`error/${err.status}`]);
                    // window.location.href = `error/${err.status}`;
                    self.messageError = JSON.stringify(err);
                }
            });
    }

    //C2 CLICK-STRATUS -
    ngClickChangeStatusUser(event: Event, elem): void {
        this.sendChatMessage.eventChangeStatusUser(this.socket);
    };

    onResize() {
        this.sendChatMessage.getDefaultHeightMsgBox();
        // let libcCommonChat = new LibCommonChat();
        // $("#frameListMsg").animate({scrollTop: libcCommonChat.getMinHeightFrameListMsg()}, 500);

        // scroll box chat content
        this.sendChatMessage.scrollContentChat();
    };

    keys(obj): Array<string> {
        return obj ? Object.keys(obj) : null;
    };

    reload(socket) {
        let that = this;
        socket.on('reload', function (data) {
            location.reload();
        });
    }

    sendDataPrivate(socket) {
        let that = this;
        socket.on('sendDataPrivate', function (messageReplies) {
            let sendChatMessage = new SendChatMessage();
            let tempHtml = sendChatMessage.htmlContentBoxChat(messageReplies);
            sendChatMessage.scrollEndShowBoxChat(1000);
            // $('#frameListMsg').trigger('changeBoxMsg');
        });
    };

    sendDataBroadCast(socket) {
        let that = this;
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
    };

    listUserConversation(socket) {
        let that = this;
        socket.on('listUserConversation', function (listConversation) {
            $('[channel="status.' + listConversation.channel_id + '"]').removeClass(listConversation.listStatus).addClass(listConversation.classCurrentStatus);
        });
    };

    sendDataTest(socket) {
        let that = this;
        socket.on('send-data-test', function (listConversation) {
            console.log(listConversation);
        });
    };

    msgContent(socket) {
        var sendChatMessage = new SendChatMessage();
        socket.on('msgContent', function (dataMessage) {
            if (dataMessage.isLength) {
                let oldScrollHeight = $("#frameListMsg")[0].scrollHeight;
                sendChatMessage.htmlContentBoxChat(dataMessage);

                sendChatMessage.getDefaultHeightMsgBox();
                if (dataMessage.isLoadTop === false) {
                    sendChatMessage.scrollEndShowBoxChat(0);
                } else {
                    $('#frameListMsg').animate({scrollTop: ($('#frameListMsg')[0].scrollHeight - oldScrollHeight)}, 100);
                }
            }
        });
    };

    ngOnDestroy() {
        this.rsData.unsubscribe();
    };
}

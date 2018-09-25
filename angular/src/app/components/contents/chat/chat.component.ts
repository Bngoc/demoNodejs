'use strict';

import {AuthService} from "../../../services/auth/auth.service";

declare var require: any;
declare var $: any;
declare var window: any;
declare var jQuery: any;
import {Router} from '@angular/router';
import {Component, ViewEncapsulation, OnInit, OnDestroy} from '@angular/core';
import {ApiServiceChat} from '../../services/api-chat.service'
import * as io from 'socket.io-client';
import {Subscription} from 'rxjs/Subscription';
import {libSupports} from "../../../common/libSupports";
import {ListContacts} from "../../../common/chat/supports/ListContacts";
import {SendChatMessage} from "../../../common/chat/sokets/SendChatMessage";

@Component({
    selector: 'app-contents-chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ChatComponent extends libSupports implements OnInit, OnDestroy {
    private url;
    private sendChatMessage: any;
    error: any;
    resultData: any = {};
    rsData: Subscription;
    remainTimeDefault: number;
    remainTimeSearch: number;
    socket: any;
    messageError: any;
    text: string = '';

    public openPopup: Function;


    constructor(private apiServiceChat: ApiServiceChat, private router: Router) {
        super();
        this.url = this.urlSide();
    }

    ngOnInit() {
        this.remainTimeDefault = (0.3 * 60 * 1000);
        this.remainTimeSearch = (1 * 60 * 1000);
        this.sendChatMessage = new SendChatMessage();
        this.loadCss([
            // 'css/chat/chat.custom.css',
            'css/chat/chat.test.css',
            "css/fix-bst2-to-bst3-angular5.css",
            "css/chat/jquery.emojipicker.css",
            "css/chat/jquery.emojipicker.tw.css",
        ]);

        this.appendMyScript([
            //     // 'js/common.js',
            //     // "js/support/menu-info-chat.js",
            //     // "js/support/libCommonChat.js",
            //     // "js/support/listContacts.js",
            //     // 'js/socket/client.js',
            'js/socket/chat.js',
            'js/socket/jquery.emojipicker.js',
            'js/socket/jquery.emojis.js'
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
                    let socket = io(this.url, {query: {token: AuthService.getToken()}});

                    console.log('socket', socket)
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
                    this.sendChatMessage.clickListContactContentChat(socket, (resultCallback) => {
                    });

                    socket.on('expiresTime60', (str) => {
                        console.log('-----------------------', str);
                    });

                    socket.on('message', function (message) {
                        $('#showmsg').text('The server has a message for you: ' + message);
                    });

                    this.reload(socket);
                    this.sendDataPrivate(socket);
                    this.sendDataBroadCast(socket);
                    this.listUserConversation(socket);
                    this.createConversationGroup(socket);
                    this.sendDataTest(socket);
                    this.msgContent(socket);
                    this.eventSocketAntiSpam();

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
        this.sendChatMessage.eventPositionEmoji(true);
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
        let sendChatMessage = new SendChatMessage();
        socket.on('sendDataPrivate', (messageReplies) => {
            sendChatMessage.htmlContentBoxChat(messageReplies);
            sendChatMessage.scrollEndShowBoxChat(1000);
            // $('#frameListMsg').trigger('changeBoxMsg');
        });
    };

    eventSocketAntiSpam() {
        this.socket.on('messageDataSpam', dataSpam => {
            console.log('messageDataSpam => ', dataSpam);
        });
    };

    sendDataBroadCast(socket) {
        let sendChatMessage = new SendChatMessage();
        socket.on('sendDataBroadCast', (messageSent) => sendChatMessage.sendDataBroadCast(messageSent));
    };

    listUserConversation(socket) {
        let listContact = new ListContacts();
        socket.on('listUserConversation', (listConversation) => listContact.updateListUserConversation(listConversation));
    };

    createConversationGroup(socket) {
        let sendChatMessage = new SendChatMessage();
        socket.on('resultUpdateActionConversationGroup', (listConversationGroup) => sendChatMessage.createConversationGroup(listConversationGroup, socket));
    };

    sendDataTest(socket) {
        let that = this;
        socket.on('send-data-test', function (listConversation) {
            console.log(listConversation);
        });
    };

    msgContent(socket) {
        var sendChatMessage = new SendChatMessage();
        socket.on('msgContent', (dataMessage) => sendChatMessage.msgContent(dataMessage));
    };

    onEnterFunction() {

    }

    bindedVariable() {
    }

    setPopupAction(fn: any) {
        this.openPopup = fn;
    }

    ngOnDestroy() {
        this.rsData.unsubscribe();
    };
}

'use strict';
declare var require: any;
import {Component, ViewEncapsulation, OnInit, OnDestroy} from '@angular/core';
import {ApiServiceChat} from './../../services/api-chat.sevice'
import * as io from 'socket.io-client';
import {Subscription} from 'rxjs/Subscription';
import * as lo from 'lodash';
declare var _: any = lo;

import {libSupports} from "../../../common/libSupports";


@Component({
    selector: 'app-contents-chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ChatComponent extends libSupports implements OnInit, OnDestroy {
    private url;
    private socket;
    error: any;
    resultData: any = {};
    resultData1: any = [];
    rsData: Subscription;

    constructor(private apiServiceChat: ApiServiceChat) {
        super();
        this.url = this.urlSide();

    }

    ngOnInit(): void {
        // this.socket = io(this.url);
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
            'js/socket/client.js',
            'js/socket/chat.js'
        ]);

        // var _this = this;

        let rsData = this.apiServiceChat
            .getIndexChat()
            .subscribe(resp => {
                if (resp.err == '' && resp.code == null) {
                    var arr = JSON.parse(resp.data.dataContactList);
                    this.resultData1 = arr.cfgChat.chatStatus;
                    this.resultData = resp.data;
                    console.log(this.resultData);
                }
            }, err => this.error = err);

        console.log(this.error, rsData, this.resultData);
    }

    ngOnDestroy() {
        this.rsData.unsubscribe();
    }
}

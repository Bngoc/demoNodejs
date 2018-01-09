'use strict';
declare var require: any;
import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import * as io from 'socket.io-client';

import {libSupports} from "../../../common/libSupports";


@Component({
    selector: 'app-contents-chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ChatComponent extends libSupports implements OnInit {
    private url = 'http://localhost:1230';
    private socket;

    constructor() {
        super();

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
            'js/socket/client.js',
            'js/socket/chat.js'
        ]);
    }

    ngOnInit() {

        console.log(this.socket);
    }

}

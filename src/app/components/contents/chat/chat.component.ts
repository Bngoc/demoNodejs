'use strict';
declare var require: any;
import {Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';

import {libSupports} from "../../../common/libSupports";



@Component({
    selector: 'app-contents-chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css']
})
export class ChatComponent extends libSupports implements OnInit {
    // private url = 'http://localhost:1230';
    // public url = 'http://localhost:1230';
    // private socket;

    constructor() {
        super();

        // this.socket = io(this.url);
        this.loadCss([
            'css/chat.custom.css',
            'css/chat.test.css'
        ]);
        let url = 'http://localhost:1230';
        this.appendMyScript([
            "js/support/menu-info-chat.js",
            "js/support/libCommonChat.js",
            "js/support/listContacts.js",
            'js/socket/client.js',
            'js/socket/chat.js',
            'js/socket/common.js'
        ]);

    }

    ngOnInit() {

        // console.log(this.socket);


        // this.socket = io(this.url);
        // var socket = this.socket.on()
    }

}

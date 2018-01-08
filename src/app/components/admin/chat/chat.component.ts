import {Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';
import {libSupports} from "../../../common/libSupports";



@Component({
    selector: 'contents-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent extends libSupports implements OnInit {

    constructor() {
        super();
        const socket = io('http://localhost:1230');

        this.loadCss([
            'css/chat.custom.css',
            'css/chat.test.css'
        ]);
        this.appendMyScript([
            "js/support/menu-info-chat.js",
            "js/support/libCommonChat.js",
            "js/support/listContacts.js",
            'js/socket/client.js',
            'js/socket/chat.js'
        ]);

    }

    ngOnInit() {

        const socket = io('http://localhost:1230');
    }

}

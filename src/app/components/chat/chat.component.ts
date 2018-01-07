import {Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {


    constructor() {
    }

    ngOnInit() {
        const socket = io('http://localhost:1230');
    }

}

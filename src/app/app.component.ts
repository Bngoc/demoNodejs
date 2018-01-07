import {Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';
declare var jQuery: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.css'
    ]
})

export class AppComponent implements OnInit {
    socket;
    title = 'xxxxxxxxxxxxxxxxxxxxxxxxxx';

    constructor() {
        this.socket = io('http://localhost:1230');

    }

    public ngOnInit() {
        this.loadScript('assets/js/common.js');
        this.loadCss('assets/css/reset/reset.css');
        this.loadCss('assets/css/common.style.css');
    };

    clicked() {
        console.log('7777777777777777');
    }

    public loadScript(url) {
        console.log('preparing to load...');
        let node = document.createElement('script');
        node.src = url;
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);
    }

    public loadCss(url) {
        console.log('preparing to load css...');
        let node = document.createElement('link');
        node.href = url;
        node.rel = 'stylesheet';
        node.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(node);
    }

    public addMyScript() {
        const script = document.createElement('script');
        script.src = 'assets/js/common.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
}

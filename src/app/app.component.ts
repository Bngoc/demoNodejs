import {Component, OnInit} from '@angular/core';
import {libSupports} from './common/libSupports';

declare var jQuery: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [
        // './app.component.css'
    ]
})

export class AppComponent extends libSupports implements OnInit {

    constructor() {
        super();
        this.intiLoadCss();
        this.intiLoadScript();
    }

    public ngOnInit() {

    };

    clicked() {
        console.log('7777777777777777');
    }
}

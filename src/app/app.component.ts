import {Component, OnInit} from '@angular/core';
import {libSupports} from './common/libSupports';
import {HeaderComponent} from "./components/layouts/header/header.component";

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
        // this.intiLoadCss();
        // this.intiLoadScript();
    }

    public ngOnInit() {
        this.intiLoadCss();
        this.intiLoadScript();
    };

    clicked() {
        console.log('7777777777777777');
    }
}

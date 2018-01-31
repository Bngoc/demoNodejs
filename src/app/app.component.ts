import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {libSupports} from './common/libSupports';
import {HeaderComponent} from "./components/layouts/header/header.component";

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AppComponent extends libSupports implements OnInit {
    url;

    constructor() {
        super();
        // this.intiLoadCss();
        // this.intiLoadScript();

    }

    public ngOnInit() {
        this.intiLoadCss();
        this.intiLoadScript();

        this.url = this.urlSide();
    };

}

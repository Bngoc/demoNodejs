import {Component, ViewEncapsulation, OnInit} from "@angular/core";
import {libSupports} from "./common/libSupports";

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AppComponent extends libSupports implements OnInit {
    url;
    currentURL = '';
    public isPageLogin: any = false;

    constructor() {
        super();
        // this.intiLoadCss();
        // this.intiLoadScript();
        this.currentURL = window.location.href;
    }

    public ngOnInit() {
        this.intiLoadCss();
        this.intiLoadScript();

        this.url = this.urlSide();

        console.log('11111 ' + this.isPageLogin + '333' + this.currentURL);
        this.isPageLogin = this.currentURL == 'http://localhost:1234/login' ? true : false;
        console.log(this.isPageLogin);
    };

    LoginChangedHandler(isPageLoginChild: boolean) {
        // this.isPageLogin  = isPageLoginChild;
    }
}

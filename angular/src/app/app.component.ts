import {Component, OnInit} from '@angular/core';
import {Router, RoutesRecognized} from "@angular/router";
import {libSupports} from "./common/libSupports";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent extends libSupports implements OnInit {
    title = 'app';
    url;
    isPageLogin: any = false;
    path: any;
    arrPageLogin = ['forgot', 'login', 'register'];

    constructor(private route: Router) {
        super();
        // this.intiLoadCss();
        // this.intiLoadScript();

    }

    public ngOnInit() {

        this.intiLoadCss();
        this.intiLoadScript();

        this.url = this.urlSide();
        // console.log(this.router.url); // array of states
        // console.log('11111 ' + this.isPageLogin + '333' + this.currentURL);
        // this.isPageLogin = this.currentURL == 'http://localhost:1234/login' ? true : false;
        // console.log(this.getRoutes());

        // console.log(this.activatedRoute.toString());
        // console.log(this.route.events);


        this.route.events.subscribe(val => {
            if (val instanceof RoutesRecognized) {
                let pathRouter = val.state.root.firstChild.routeConfig.path;
                this.isPageLogin = (pathRouter) && this.arrPageLogin.includes(pathRouter) ? true : false;
                // console.log(val.state.root.firstChild.routeConfig.path);
            }
        });
    };

    LoginChangedHandler(isPageLoginChild: boolean) {
        // this.isPageLogin  = isPageLoginChild;
    }
}

'use strict';

import {AuthService} from "../../../services/auth/auth.service";
import {Component, ViewEncapsulation, OnInit, Output, Input, EventEmitter} from "@angular/core";
import {Router, NavigationExtras} from "@angular/router";
import {libSupports} from "./../../../common/libSupports";
import {HttpClient} from "@angular/common/http";
declare var $: any;
declare const FB: any;
declare var window: any;

@Component({
    selector: 'contents-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    encapsulation: ViewEncapsulation.None

})
export class LoginComponent extends libSupports implements OnInit {
    private urlLogin: any;

    @Input() isLoginChild: any = true;
    @Output() LoginChangedChild = new EventEmitter();

    constructor(private authService: AuthService, private router: Router, private http: HttpClient) {
        super();

        (function (d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        window.fbAsyncInit = () => {
            console.log("fbasyncinit");
            FB.init({
                appId: '183473242451708',
                autoLogAppEvents: true,
                xfbml: true,
                cookie: true,
                version: 'v2.6'
            });
            FB.AppEvents.logPageView();
        };
    }

    ngOnInit() {
        this.urlLogin = 'api/login';

        if (window.FB) {
            window.FB.XFBML.parse();
        }

        FB.getLoginStatus(response => {
            this.statusChangeCallback(response);
        });
    }

    clickLogin() {
        var attrFromLogin = $('#login-form');
        var dataRequest = {
            url: this.urlLogin,
            data: attrFromLogin.serialize()
        };
        let self = this;
        localStorage.removeItem('idToken');
        // AuthService
        this.callDataJS(dataRequest, function (result) {
            self.authService.login().subscribe(() => {
                if (result) {
                    if (result.validate) {
                        result.validate.forEach(function (val) {
                            // console.log(val);
                            $('input[name="' + val.param + '"]').addClass('error');
                        });
                    }
                    if (result.status) {
                        // AuthToken
                        localStorage.setItem('idToken', result.token);
                        let navigationExtras: NavigationExtras = {
                            queryParamsHandling: 'preserve',
                            preserveFragment: true
                        };

                        self.router.navigate([result.url], navigationExtras);
                    } else {
                        if (result.msg.length)
                            $('#message').html(self.cnMessagesShow([result.msg], 'e'));
                    }
                }
            });
        });
    }

    loginFacebook() {
        FB.login(function (result) {
            this.loged = true;
            this.token = result;
        }, {scope: 'user_friends'});
    }

    statusChangeCallback(response: any) {
        if (response.status === 'connected') {
            console.log('connected');
        } else {
            this.loginFacebook();
        }
    }

    me() {
        FB.api('/me?fields=id,name,first_name,last_name,gender,picture.width(150).height(150),age_range,friends',
            function (result) {
                if (result && !result.error) {
                    this.user = result;
                    console.log(this.user);
                } else {
                    console.log(result.error);
                }
            });
    }
}

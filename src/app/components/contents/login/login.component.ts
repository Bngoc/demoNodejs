'use strict';

import {AuthService} from "../../../services/auth/auth.service";
declare var $: any;
import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import {libSupports} from './../../../common/libSupports';

@Component({
    selector: 'contents-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    encapsulation: ViewEncapsulation.None

})
export class LoginComponent extends libSupports implements OnInit {
    private urlLogin: any;

    constructor(private authService: AuthService, private router: Router) {
        super();
    }

    ngOnInit() {
        this.urlLogin = 'api/login'
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
            self.authService.login().subscribe(()=> {
                if (result) {
                    if (result.validate) {
                        result.validate.forEach(function (val) {
                            console.log(val);
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
}

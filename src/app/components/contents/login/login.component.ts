// import {AuthToken} from "../../../services/token.service";
declare var $: any;
import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {libSupports} from './../../../common/libSupports';

@Component({
    selector: 'contents-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    encapsulation: ViewEncapsulation.None

})
export class LoginComponent extends libSupports implements OnInit {
    private urlLogin: any;

    ngOnInit() {
        this.urlLogin = 'api/login'
    }

    clickLogin() {
        var attrFromLogin = $('#login-form');
        var dataRequest = {
            url: this.urlLogin,
            data: attrFromLogin.serialize()
        };
        let _this = this;

        this.callDataJS(dataRequest, function (result) {
            if (result) {
                if (result.validate) {
                    result.validate.forEach(function (val) {
                        console.log(val);
                        $('input[name="' + val.param + '"]').addClass('error');
                    });
                }

                if (result.status) {
                    ////
                    // AuthToken
                    localStorage.setItem('idToken', result.token);
                    window.location.href = result.url;
                } else {
                    if (result.msg.length)
                        $('#message').html(_this.cnMessagesShow([result.msg], 'e'));
                }
            }
        });
        console.log(dataRequest);
    }


}

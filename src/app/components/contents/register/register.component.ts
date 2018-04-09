import {libSupports} from "../../../common/libSupports";
import {Component, OnInit, ViewEncapsulation} from "@angular/core";
declare let $: any;
declare let window;

@Component({
    selector: 'contents-register',
    templateUrl: './register.component.html',
    styleUrls: ['./../login/login.component.css', './register.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterComponent extends libSupports implements OnInit {
    private urlRegister: any;

    constructor() {
        super();
    }

    ngOnInit() {
        this.urlRegister = 'api/register';
    }

    clickRegister() {
        var attrFromLogin = $('#register-form');
        var dataRequest = {
            url: this.urlRegister,
            data: attrFromLogin.serialize()
        };
        let self = this;
        this.callDataJS(dataRequest, function (result) {
            if (result) {
                if (result.validate) {
                    result.validate.forEach(function (val) {
                        console.log(val);
                        $('input[name="' + val.param + '"]').addClass('error');
                        $('label.' + val.param + '-msg').html(self.cnMessagesShow([val.msg], 'e'));
                    });
                }

                if (result.status) {
                    window.location = result.url;
                } else {
                    $('#msg-com-error').text(result.msg);
                }
            }
        });
    }
}

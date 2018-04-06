declare var $: any;
import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'contents-register',
    templateUrl: './register.component.html',
    styleUrls: ['./../login/login.component.css', './register.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}

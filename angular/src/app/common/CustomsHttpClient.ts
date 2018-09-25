'use strict';

import {Injectable} from '@angular/core';
import {HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs";

@Injectable()

export class CustomsHttpClient {

    public headers: any;

    constructor() {
        this.headers = new HttpHeaders()
            .set("Content-type", "application/x-www-form-urlencoded")
            .set("Authorization", ('Bearer ' + localStorage.getItem('idToken')))
            .set("Access-Control-Allow-Credentials", "true")
            .set("credentials", 'same-origin');

        //https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
        //CHANGE SESSION IN SERVER NODEIJ  "credentials": 'include' | 'same-origin' | 'omit',
        // if (angularReduxOptions != null) {
        //     for (let option in angularReduxOptions) {
        //         let optionValue = angularReduxOptions[option];
        //         this[option] = optionValue;
        //     }
        // }
    }

    public setHeader() {
        return this.headers;
    }

    // Implement a method to handle errors if any
    public handleError(err: HttpErrorResponse | any) {
        return Observable.throw(err);
    }
}

//https://shopee.vn/Samsung-Galaxy-S7-Edge-%E1%BB%91p-l%C6%B0ng-Msvii-nh%E1%BB%B1a-m%E1%BB%8Fng-cao-c%E1%BA%A5p-i.8084395.248897196
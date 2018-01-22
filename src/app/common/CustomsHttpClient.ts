'use strict';

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs";


@Injectable()

export class CustomsHttpClient {

    public headers: any;

    constructor(private httpClient: HttpClient) {
        this.headers = new HttpHeaders()
            .set("Content-type", "application/x-www-form-urlencoded")
            .set("Access-Control-Allow-Credentials", "true")
            .set("Authorization", ('Bearer ' + localStorage.getItem('idToken')))
            .set("credentials", 'same-origin');

        //https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
        //CHANGE SESSION IN SERVER NODEIJ  "credentials": 'include' | 'same-origin' | 'omit',
    }

    public setHeader() {
        return this.headers;
    }

    // Implement a method to handle errors if any
    public handleError(err: HttpErrorResponse | any) {
        return Observable.throw(err);
    }
}
'use strict';

import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {catchError} from 'rxjs/operators';
import {HttpHeaders} from "@angular/common/http";
import {tap} from "rxjs/operators/tap";


@Injectable()

export class ApiServiceChat {
    headers: any;

    constructor(private httpClient: HttpClient) {
        this.headers = new HttpHeaders()
            .set("Content-type", "application/x-www-form-urlencoded")
            .set("Access-Control-Allow-Credentials", "true")
            .set("Authorization", ('Bearer ' + localStorage.getItem('idToken')))
            .set("credentials", 'same-origin');

        //https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
        //CHANGE SESSION IN SERVER NODEIJ  "credentials": 'include' | 'same-origin' | 'omit',
    }

    getIndexChat() {
        return this.httpClient
            .get('/api/chat', {headers: this.headers})
            .pipe(
                tap(data => data),
                catchError(this.handleError)
            );
    }

    hack(myObj) {
        if (myObj) {
            return Object.keys(myObj).map(x => myObj[x]);
        }
    }

    // Create a shared method that shows an alert when someone buys a deal
    purchase(item) {
        alert(`You bought the: ${item}`);
    }

    // Implement a method to handle errors if any
    public handleError(err: HttpErrorResponse | any) {
        return Observable.throw(err);
    }
}

'use strict';

import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import {catchError} from 'rxjs/operators';
import {HttpHeaders} from "@angular/common/http";

@Injectable()

export class ApiServiceChat {
    optionsHeader: any;
    headers: any;

    constructor(private httpClient: HttpClient) {
        this.headers = new HttpHeaders()
            .set("Content-type", "application/x-www-form-urlencoded")
            .set("Authorization", ('Bearer ' + localStorage.getItem('idToken')))
            .set("credentials", 'omit');

        //https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
        //CHANGE SESSION IN SERVER NODEIJ  "credentials": 'include' | 'same-origin' | 'omit',
    }

    getIndexChat() {
        return this.httpClient
        // .get('/api/chat', {headers: this.headers})
            .get('/api/chat', {headers: this.headers})
            .pipe(catchError(this.handleError));
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
    private handleError(err: HttpErrorResponse | any) {
        console.error('An error occurred', err);
        return Observable.throw(err.message || err);
    }
}

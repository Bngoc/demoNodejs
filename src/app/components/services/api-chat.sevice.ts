'use strict';

import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import {catchError} from 'rxjs/operators';

@Injectable()

export class ApiServiceChat {

    constructor(private httpClient: HttpClient) {
        // this.headers = new HttpHeaders()
        //     .set('Content-Type', 'application/json; charset=utf-8')
        //     .set('Accept', 'application/json');
    }

    getIndexChat() {
        return this.httpClient
            .get('/api/chat')
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

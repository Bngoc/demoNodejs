'use strict';

import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import {catchError} from 'rxjs/operators';
import {tap} from "rxjs/operators/tap";
import {CustomsHttpClient} from "../../common/CustomsHttpClient";


@Injectable()

export class ApiServiceChat {

    constructor(private httpClient: HttpClient, private customsHttpClient: CustomsHttpClient) {
    }

    getIndexChat() {
        return this.httpClient
            .get('/api/chat', {headers: this.customsHttpClient.setHeader()})
            .pipe(
                tap(data => data),
                catchError(this.customsHttpClient.handleError)
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
}

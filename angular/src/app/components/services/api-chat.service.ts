'use strict';

import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import {catchError} from 'rxjs/operators';
import {tap} from "rxjs/operators/tap";
import {CustomsHttpClient} from "../../common/CustomsHttpClient";
import {HttpRequestService} from "../../common/http-request.service";

@Injectable()

export class ApiServiceChat{

    constructor(private httpClient: HttpClient,
                private customsHttpClient: CustomsHttpClient,
                private httpService: HttpRequestService) {
    }

    getIndexChat() {
        return this.httpService
        // return this.httpClient
            .get('/api/chat')
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

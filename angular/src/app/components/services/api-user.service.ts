'use strict';

import {Injectable} from '@angular/core';
import {CustomsHttpClient} from "../../common/CustomsHttpClient";
import {tap} from "rxjs/operators/tap";
import {catchError} from "rxjs/operators/catchError";
import {HttpClient} from "@angular/common/http";
import {HttpRequestService} from "../../common/http-request.service";

@Injectable()

export class ApiServiceUser {

    constructor(private httpClient: HttpClient, private customsHttpClient: CustomsHttpClient,
                private http: HttpRequestService) {
    }
    // constructor(private httpClient: HttpClient, private customsHttpClient: CustomsHttpClient) {
    // }

    logout() {
        // return this.httpClient
        return this.http
            .post('/api/logout', null)
            // .post('/api/logout', null, {headers: this.customsHttpClient.setHeader()})
            .pipe(
                tap(data => data),
                catchError(this.customsHttpClient.handleError)
            );
    }
}
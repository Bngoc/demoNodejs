'use strict';
import {Injectable} from '@angular/core';
import {CustomsHttpClient} from "../../common/CustomsHttpClient";
import {tap} from "rxjs/operators/tap";
import {catchError} from "rxjs/operators/catchError";
import {HttpClient} from "@angular/common/http";

@Injectable()

export class ApiServiceUser {

    constructor(private httpClient: HttpClient, private customsHttpClient: CustomsHttpClient) {
    }


    logout() {
        return this.httpClient
            .post('/api/logout', null, {headers: this.customsHttpClient.setHeader()})
            .pipe(
                tap(data => data),
                catchError(this.customsHttpClient.handleError)
            );
    }
}
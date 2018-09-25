'use strict';

import {Injectable} from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from "rxjs/Observable";

const helper = new JwtHelperService();

@Injectable()
export class AuthService {
    isLoggedIn = false;
    // store the URL so we can redirect after logging in
    redirectUrl: string;

    // constructor(public jwtHelper: JwtHelperService) {
    // }

    login(): Observable<boolean> {
        return Observable.of(true).delay(1000).do(val => {
            this.isLoggedIn = true;
        });
    }

    logout(): void {
        this.isLoggedIn = false;
    }

    isAuthenticated(): boolean {
        // Check whether the token is expired and return
        // true or false
        return !helper.isTokenExpired(localStorage.getItem('idToken'));
        // return !this.jwtHelper.isTokenExpired(localStorage.getItem('idToken'));
    }

    static getToken() {
        return localStorage.getItem('idToken');
    }

    static decodeToken() {
        return helper.decodeToken(this.getToken());
    }
}

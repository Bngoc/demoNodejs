'use strict';

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {tokenNotExpired, JwtHelper} from 'angular2-jwt';

@Injectable()
export class AuthService {
    isLoggedIn = false;
    // store the URL so we can redirect after logging in
    redirectUrl: string;
    private jwtHelper: JwtHelper = new JwtHelper();

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
        return !this.jwtHelper.isTokenExpired(localStorage.getItem('idToken'));
    }
}

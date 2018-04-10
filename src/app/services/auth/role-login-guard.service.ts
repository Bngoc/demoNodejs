'use strict';

import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from "./auth.service";
import {JwtHelper} from "angular2-jwt";
import {isUndefined} from "util";

@Injectable()
export class RoleLoginGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    // private jwtHelper: JwtHelper = new JwtHelper();

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const idToken = localStorage.getItem('idToken');
        if (idToken) {
            // const expectedRole = route.data.expectedRole;
            // const tokenPayload = this.jwtHelper.decodeToken(idToken);
            // if (this.authService.isAuthenticated() || tokenPayload.role === expectedRole) {
            if (this.authService.isAuthenticated()) {
                this.router.navigate(['/']);
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

}
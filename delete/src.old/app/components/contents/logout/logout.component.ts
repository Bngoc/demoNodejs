'use strict';

import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ApiServiceUser} from "../../services/api-user.service";
import {AuthService} from "../../../services/auth/auth.service";

@Component({
    template: '<div></div>'
})

export class LogoutComponent implements OnInit {
    messageError: any;

    constructor(private authService: AuthService, private router: Router, private apiUser: ApiServiceUser) {
    }

    ngOnInit() {
        let self = this;
        localStorage.removeItem('idToken');
        this.apiUser.logout().subscribe(() => {
            self.authService.logout();
            this.router.navigate(['/login']);
        }, error => {
            if (error.error.hasOwnProperty('url')) {
                window.location.href = error.error.url;
            } else {
                self.messageError = JSON.stringify(error);
            }
        });
    }

}

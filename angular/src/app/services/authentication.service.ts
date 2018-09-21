import {Injectable} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {

    constructor(private router: Router) {
    }

    getToken() {
        return localStorage.getItem('userToken');
    }
}
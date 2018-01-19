import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    template: '<div></div>'
})
export class LogoutComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
        // dsjglk


        this.router.navigate(['/login'])
    }

}

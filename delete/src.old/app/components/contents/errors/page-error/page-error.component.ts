import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';

@Component({
    selector: 'app-contents-error',
    templateUrl: 'page-error.component.html',
    styleUrls: ['page-error.component.css']
})
export class PageErrorComponent implements OnInit {
    private statusCode: any;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.route.params.subscribe(res => {
            this.statusCode = res.id;
            console.log(res.id);
        });
    }

    ngOnInit() {

    }

    sendMeHome() {
        this.router.navigate(['']);
    }
}

import {Component, ViewEncapsulation, OnInit} from '@angular/core';

@Component({
    selector: 'app-contents',
    templateUrl: './contents.component.html',
    styleUrls: ['./contents.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ContentsComponent implements OnInit {
    messageError: any;
    constructor() {
    }

    ngOnInit() {
    }

}

import {Component, ViewEncapsulation, OnInit, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'app-contents',
    templateUrl: './contents.component.html',
    styleUrls: ['./contents.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ContentsComponent implements OnInit {
    messageError: any;

    isPageLoginChild: any = true;

    // @Input() isPageLoginContent: boolean;
    @Output() LoginChanged = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
        this.LoginChanged.emit(this.isPageLoginChild);
    }

}

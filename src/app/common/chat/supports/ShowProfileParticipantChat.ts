'use strict';
import {el} from "@angular/platform-browser/testing/src/browser_util";

export class ShowProfileParticipantChat {

    htmlHeadProfile = function (dataParticipants, isSingle = false) {
        let htmlHead = '<div class="show-avatar">'
            + '<div class="img-avatar">'
            + '<div class="b-img">';
        htmlHead += '<img class="img-av" src="https://static.xx.fbcdn.net/images/emoji.php/v9/z88/1/32/1f600.png" alt=""/>';
        htmlHead += '</div>';

        if (isSingle === false) {
            htmlHead += '<a href="#" title="Update avatar" class="avatar-group">Change avatar</a>';
        }
        htmlHead += '</div></div>';

        return htmlHead;
    };

    htmlContentProfile = function (dataParticipants, isSingle = false) {
        let htmlContentProfie = '<div class="box-show-info">'
            + '<div class="info-profile">'
            + '<ul class="data-show-lable">';

        if (isSingle === true) {
            htmlContentProfie += this.htmlSingle(dataParticipants);
        } else {
            htmlContentProfie += this.htmlGroup(dataParticipants);
        }

        htmlContentProfie += '</ul>';
        htmlContentProfie += '</div></div>';


        return htmlContentProfie;
    };

    htmlCloseShowProfile = function () {
        return '<div class="clearfix"></div>'
            + '<div class="modal-footer act-box">'
            + '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'
            + '</div>';
    };

    htmlGroup = function () {

        return '';
    };

    htmlSingle = function (dataSinglePart) {
        let htmlSingleBoxProfile = '<li class="lable-profile title-name">'
            + 'Title name'
            + '</li>';


        // <li class="lableprofile">
        //     mood msg
        // </li>
        // <li class="lable-profile">
        // country
        // </li>
        // <li class="lable-profile">
        //
        // </li>
        // <hr>
        //     <li class="lable-profile">
        // nick
        // </li>
        // <li class="lable-profile">
        // email
        // </li>
        // <li class="lable-profile">num telephone</li>
        // <hr>
        //     <li class="lable-profile">Sex</li>
        // <li class="lable-profile">language</li>

        return htmlSingleBoxProfile;
    };

    public renderHtmlProfileParticipants = function (dataParticipant, isSingle) {
        return this.htmlHeadProfile(dataParticipant, isSingle) + this.htmlContentProfile(dataParticipant, isSingle);
    }
}
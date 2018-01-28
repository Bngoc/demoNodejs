'use strict';

declare let $: any;


export class ShowProfileParticipantChat {

    htmlHeadProfile = function (dataParticipants) {
        let htmlHead = '<div class="show-avatar">'
            + '<div class="img-avatar">'
            + '<div class="b-img">';
        htmlHead += '<img class="img-av" src="' + (dataParticipants.isTypeSingle ? dataParticipants.listParticipant[0].urlImagesAvatarSingle : dataParticipants.urlImagesAvatar) + '" alt=""/>';
        htmlHead += '</div>';

        if (dataParticipants.isTypeSingle === false) {
            htmlHead += '<a href="#" title="Update avatar" class="avatar-group">Change avatar</a>';
        }
        htmlHead += '</div></div>';

        return htmlHead;
    };

    htmlContentProfile = function (dataParticipants) {
        let htmlContentProfie = '<div class="box-show-info">'
            + '<div class="info-profile">'
            + '<ul class="data-show-label">';

        if (dataParticipants.isTypeSingle === true) {
            htmlContentProfie += this.htmlSingle(dataParticipants);
        } else {
            htmlContentProfie += this.htmlGroup(dataParticipants);
        }

        htmlContentProfie += '</ul>';
        htmlContentProfie += '</div></div>';

        return htmlContentProfie;
    };

    htmlCloseShowProfile = function () {
        return `<div class="clearfix"></div>
            <div class="modal-footer act-box">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
            </div>`;
    };

    htmlGroup = function (dataParticipants) {
        let htmlGroupBoxProfile = `<li class="label-profile title-name">${dataParticipants.userName}</li>`;
        return htmlGroupBoxProfile;
    };

    htmlSingle = function (dataParticipants) {
        let profiltPart = dataParticipants.listParticipant[0];
        let htmlSingleBoxProfile = '<li class="label-profile title-name">' + profiltPart.middle_name + '</li>';
        htmlSingleBoxProfile += '<li class="label-profile title-mood">' + profiltPart.mood_message + '</li>';
        htmlSingleBoxProfile += '<li class="label-profile title-country">' + profiltPart.country + '</li>';
        htmlSingleBoxProfile += '<hr>';
        htmlSingleBoxProfile += profiltPart.user_name ? '<li class="label-profile title-nick">' + profiltPart.user_name + '</li>' : '';
        htmlSingleBoxProfile += profiltPart.email ? '<li class="label-profile title-email">' + profiltPart.email + '</li>' : '';
        htmlSingleBoxProfile += profiltPart.phone ? '<li class="label-profile title-phone">' + profiltPart.phone + '</li>' : '';
        htmlSingleBoxProfile += '<hr>';
        htmlSingleBoxProfile += profiltPart.gender ? '<li class="label-profile title-sex">' + profiltPart.gender + '</li>' : '';
        // htmlSingleBoxProfile += '<li class="label-profile title-language">' + profiltPart.middle_name + '</li>';
        // htmlSingleBoxProfile += '<li class="label-profile title-birth">' + profiltPart.middle_name + '</li>';

        // <li class="label-profile"> country </li>
        // <li class="label-profile"></li>
        // <hr>
        // <li class="label-profile"> nick </li>
        // <li class="label-profile"> email </li>
        // <li class="label-profile">num telephone</li>
        // <hr>
        // <li class="label-profile">Sex</li>
        // <li class="label-profile">language</li>

        return htmlSingleBoxProfile;
    };

    public renderHtmlProfileParticipants = function (dataParticipant, callback) {
        $('#html-profile-participants').html(this.htmlHeadProfile(dataParticipant)
            + this.htmlContentProfile(dataParticipant)
            + this.htmlCloseShowProfile());
        callback();
    }
}
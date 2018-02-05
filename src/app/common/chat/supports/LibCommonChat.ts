'use strict';

declare var require: any;
declare var $: any;
import {isUndefined} from "util";
import {libSupports} from "../../libSupports";
import {ListContacts} from "./ListContacts";
const emoji = require('node-emoji');

export class LibCommonChat extends libSupports {
    public swap(json) {
        var ret = {};
        for (var key in json) {
            ret[json[key]] = key;
        }
        return ret;
    };

    public format(code, name) {
        return '<img alt="' + code + '" src="' + name + '.png" />';
    };

    onMissing(name) {
        return name;
    };

    public convertEmoji(stringMsg, onMissing: any = null, format: any = null) {
        return stringMsg.length ? emoji.emojify(stringMsg, onMissing, format) : stringMsg;
    }

    public convertHtmlToPlainText(strHtml) {
        let stringHtml = strHtml !== isUndefined ? strHtml : "";
        if (stringHtml == '') return;

        return stringHtml.replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/\n/g, '<br>');
    };

    public regExpString(strSearch) {
        let stringSearch = strSearch !== 'isUndefined' ? strSearch : '';

        return new RegExp(stringSearch, "g");
    };

    public renderHtmlMessageVideo() {

    };

    public renderHtmlMessageAudio() {

    };

    public renderHtmlMessageImage() {

    };

    public supportHtmlTextOther(contactMessage, reqOption) {
        let htmlOpen = '<li class="_4tdt sent author-' + contactMessage.id + '">'
            + '<div class="js_hn _31o4">'
            + '<a aria-label="" class="_4tdw" href="#" class-tooltip-hover="js_hn" data-hover="tooltip" data-tooltip-position="left"'
            + 'data-tooltip-content="' + contactMessage.middle_name + ' <br>' + this.checkTimeActiveLastWeek(reqOption.lastCreatedAt) + '" >'
            + '<img src="http://emilcarlsson.se/assets/donnapaulsen.png" alt="" class="img"></a></div>'
            + '<div class="_ua2">'
            + ((reqOption.isSingle === false) ? ('<div class="_4tdx">' + contactMessage.middle_name.split(' ')[0] + '</div>') : "");

        let htmlClose = '</div></li>';

        return {htmlOpen: htmlOpen, htmlClose: htmlClose};
    };

    public supportHtmlTextPrivate(contactMessage, reqOption) {
        let htmlOpen = '<li class="_4tdt replies">'
            + '<div class="_ua2">';

        let htmlClose = '</div></li>';

        return {htmlOpen: htmlOpen, htmlClose: htmlClose};
    };

    public supportHtmlTextAppend(obj, reqOption) {
        let listClass = '';
        if (reqOption.isUserCurrent === false) {
            if (reqOption.isUserFuture === true) {
                listClass = 'bottom-left';
                if (reqOption.isUserPass === true) {
                    listClass += ' top-left';
                }
            } else if (reqOption.isUserPass === true) {
                listClass += ' top-left';
            }
        } else {
            if (reqOption.isUserFuture === true) {
                listClass = 'bottom-right';
                if (reqOption.isUserPass === true) {
                    listClass += ' top-right';
                }
            } else if (reqOption.isUserPass === true) {
                listClass += ' top-right';
            }
        }

        let dataAttr = (reqOption.isUserCurrent) ? ('data-msg="' + obj.id + '"') : "";
        let classTooltipHover = (reqOption.isUserCurrent) ? ('class-tooltip-hover="js_hn"') : "";
        let dataTooltipContent = (reqOption.isUserCurrent)
            ? (`data-tooltip-private="1" data-tooltip-position="right" data-hover="tooltip" data-tooltip-content="${this.checkTimeActiveLastWeek(obj.created_at)}"`)
            : "";
        let planText = this.convertHtmlToPlainText(obj.message);
        let onMissing = this.convertEmoji(planText, this.onMissing(planText));
        console.log(onMissing);
        // let format = this.format(planText);
        return `<div ${dataAttr} class="_5wd4 ${(reqOption.isUserCurrent ? "js_hn _1nc6 " : "")} ${(reqOption.isUserFuture ? "bottom-m1" : "")}">
            <p ${dataTooltipContent} ${classTooltipHover} class="${listClass}">${this.convertEmoji(planText)}</p></div>`;
    };

    public checkTimeActiveLastWeek(lastCreatedAt) {
        const now = new Date();
        let timestampLastWeek = now.getTime() - (7 * 24 * 60 * 60 * 1000);
        if (lastCreatedAt === isUndefined || lastCreatedAt === null) return '';

        let listContact = new ListContacts();
        return listContact.customDateTime(lastCreatedAt, timestampLastWeek)
    }

    public getMinHeightFrameListMsg() {
        let outerHeightParticipant = $("#group-participant").hasClass('display-show') ? $("#group-participant").outerHeight() : 0;
        return $(".content").outerHeight() - $(".contact-profile").outerHeight() - outerHeightParticipant - $("#messageInput").outerHeight() - 1;
    }
}
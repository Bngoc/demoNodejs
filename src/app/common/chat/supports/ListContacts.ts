'use strict';

import * as _ from 'lodash';
import {isUndefined} from "util";
import {libSupports} from "../../libSupports";
import {isFunction} from "util";
import {el} from "@angular/platform-browser/testing/src/browser_util";
declare var jQuery: any;
declare var $: any;
declare var require: any;
declare var window: any;

export class ListContacts extends libSupports {

    public remainTime: any;
    public reqDataReset: any;

    public renderResult(data = '') {
        let htmlOpen = '<div class="search-results-contacts"><div class="box-action-friend" id="box-action-friend">';
        let htmlClose = '</div></div>';

        return {htmlOpen: htmlOpen, htmlClose: htmlClose};
    };

    public renderSearch() {
        return `<div class="search-contacts"><input class="search-single" id="search-single" type="text" value="" maxlength="20"></div>`;
    };

    public renderListContact() {
        let htmlOpen = '<div class="data-contact" id="data-contact"><ul id="list-contacts">';
        let htmlClose = '</ul></div>';

        return {htmlOpen: htmlOpen, htmlClose: htmlClose};
    };

    public actionContact(option) {
        let html = '<div class="clearfix"></div><div class="action-friend" id="action-friend">';
        html += (option !== isUndefined ? (option === false ? '<button class="btn btn-primary add" title="Add users" disabled>Add</button>' : '<button class="btn btn-primary create" title="Create group" disabled>Create</button>') : '');
        html += '<button class="btn btn-primary cancel">Cancel</button></div>';

        return html;
    };

    public supportResultContact(obj) {
        let htmlListContactAction = '';
        obj.forEach(function (element) {
            htmlListContactAction += `<div class="name-contact" data-act-freind="${element.user_id}" data-author="author.${element.user_id}">
                    <span class="name-act">${(element.middle_name ? element.middle_name : element.user_name)}</span>
                    <i class="act-aptach fa fa-close" aria-hidden="true"></i>
                </div>`;
        });

        return htmlListContactAction;
    };

    public supportListContact(obj) {
        let listParticipant = this.getListParticipant();
        let htmlListContact = '';
        obj.forEach(function (element) {
            if (listParticipant.includes(element.user_id)) {
                return false;
            }
            htmlListContact += `<li class="contact-list">
                <div class="wap-contact" data-author="author.${element.user_id}">
                    <img src="${(element.path_img ? element.path_img : element.path_img_default)}" alt="">
                    <div class="meta-contact">
                        <p class="">${(element.hasOwnProperty('textSearch') ? element.textSearch : element.showUser)}</p>
                        <p class="">${(element.mood_message ? element.mood_message : '')}</p>
                    </div>
                 </div></li>`;
        });

        return htmlListContact;
    };

    public render(obj, objAction) {
        let resultHtml = '<div class="list-contact">';
        resultHtml += this.renderResult().htmlOpen + this.supportResultContact(objAction) + this.renderResult().htmlClose;
        resultHtml += this.renderSearch();
        resultHtml += this.renderListContact().htmlOpen + this.supportListContact(obj.data) + this.renderListContact().htmlClose;
        resultHtml += this.actionContact(obj.option.isConversationSingle);
        resultHtml += '</div>';
        return resultHtml;
    };

    public searchLikeContact(obj, strSearch) {
        let stringSearch = strSearch !== 'isUndefined' ? strSearch : '';

        let search = new RegExp(stringSearch, "i");
        let listContactSingleSearch = jQuery.grep(obj, function (items) {
            let middle_name = search.test(items.middle_name);
            let email = search.test(items.email);
            let user_name = search.test(items.user_name);
            let textSearch = items.showUser;
            let textSearchOption = '';
            if (middle_name) {
                textSearch = items.middle_name.replace(search, `<mark>${strSearch}</mark>`);
            }
            if (email) {
                textSearchOption += items.email.replace(search, `<mark>${strSearch}</mark>`);
            }
            if (user_name) {
                textSearchOption += items.user_name.replace(search, `<mark>${strSearch}</mark>`);
            }

            items.textSearch = textSearch + (textSearchOption ? (' (' + textSearchOption + ')') : '');
            return middle_name || email || user_name;
        });

        return listContactSingleSearch;
    };

    public clickActionContact() {
        let listParticipant = {};
        let tempAuthorId = [];
        let tempNameAuthorId = [];
        let that = this;
        $('.name-contact[data-act-freind]').each(function (index, element) {
            let authorId = $(element).attr('data-act-freind');
            let nameAuthorId = $(element).find('.name-act')[0].childNodes[0].nodeValue;

            if (typeof authorId !== typeof isUndefined && authorId !== false) {
                tempAuthorId.push(parseInt(authorId));
                tempNameAuthorId.push(that.ucfirst(nameAuthorId));
            }
        });

        listParticipant['authorId'] = tempAuthorId;
        listParticipant['nameAuthorId'] = tempNameAuthorId;

        return listParticipant;
    };

    public getListParticipant() {
        return $.map($('[code-participant-id]'), function (ele) {
            let codeParticipant = $(ele).attr("code-participant-id");
            if (typeof codeParticipant !== typeof isUndefined && codeParticipant !== false) {
                return parseInt(codeParticipant)
            }

            return false;
        });
    };

    public renderContactSingle(element, option) {
        let statusPart = option.cfgChat.chatStatus[element.status] ? option.cfgChat.chatStatus[element.status] : "";
        let classStatusPart = statusPart ? ((statusPart == option.cfgChat.cfg_chat.status_hidden_name) ? option.cfgChat.cfg_chat.status_hidden_name_replace : statusPart) : statusPart;
        let valAuthor = element.hasOwnProperty('listContactParticipant') && element.hasOwnProperty('users_id') ? `data-author="${element.users_id}"` : '';

        let htmlSingleAll = `<li class="contact">
            <div class="wrap" data-conversation="${element.idConversation}" data-type="${element.type}" data-channel="${element.channel_id}" data-owner="${element.creator_id}" ${valAuthor}>
                <span channel="status.${element.channel_id}" class="list-icon-status contact-status ${(element.is_accept_single ? option.cfgChat.cfg_chat.class_undefined : (element.is_life && classStatusPart) ? classStatusPart : "")}"></span>
                <img src="${(element.path_img ? element.path_img : option.cfgChat.cfg_chat.img_single_user)}" alt=""/>
                <div class="meta">
                    <span class="name-notify"><p class="name" data-conversation-name="${element.showUser}">${(element.hasOwnProperty('textSearch') ? element.textSearch : (element.middle_name ? element.middle_name : "&nbsp;"))} </p><i class="badges-notify">132</i></span>
                <p class="preview mood_message">${(element.hasOwnProperty('mood_message') && element.mood_message ? element.mood_message : "")} </p>
                </div>
                </div>
            </li>`;

        return htmlSingleAll;
    };

    public renderContactGroup(element, option) {
        let htmlGroupAll = `<li class="contact">
            <div class="wrap" data-conversation="${element.idConversation}" data-type="${element.type}" data-channel="${element.channel_id}" data-owner="${element.creator_id}">
                <span channel="status.${element.channel_id}" class=""></span>
                <img src="${(element.path_img_group ? element.path_img_group : option.cfgChat.cfg_chat.img_group_user)}" alt=""/>
                <div class="meta">
                    <span class="name-notify"><p class="name" data-conversation-name="${element.title}">${(element.hasOwnProperty('textSearch') ? element.textSearch : element.title)}</p><i class="badges-notify">132</i></span>
                    <p class="preview">${element.count} participants</p>
                </div>
            </div>
            </li>`;

        return htmlGroupAll;
    };

    public showContactListAll(dataResult, otpReplace = false) {
        let _this = this;
        let htmlListContact = '';
        let option = {
            cfgChat: dataResult.cfgChat
        };
        dataResult.contactList.forEach(function (element) {
            if (element.isSingle === true) {
                htmlListContact += _this.renderContactSingle(element, option);
            } else {
                htmlListContact += _this.renderContactGroup(element, option);
            }
        });

        if (otpReplace === false) $('#contacts-your').html(htmlListContact);

        return htmlListContact;
    };

    public subscribeAfterClickListContact(callback: any = false) {
        let _this = this;
        let valSearch = $.trim($('#search-contact').val());
        let runRemainTime = setInterval(function () {
            if (window.remainTime && window.requestListContactDefault) {
                if (window.remainTime < _this.getDateTimeNow() && (valSearch || window.valSearchAnonymous)) {
                    clearInterval(runRemainTime);
                    window.valSearchAnonymous = false;
                    window.remainTime = 0;
                    window.listContactSearchDynamic = [];
                    $('#search-contact').val('');
                    _this.searchListContactListAll(window.requestListContactDefault, ()=> {
                        if (typeof callback === "function")  callback();
                    });
                }
            } else {
                clearInterval(runRemainTime);
            }
        }, 1000);
    };

    public appendNotFoundListSearchContact = function () {
        return `<li id="search-box-contacts" class="search-contact">
            <div class="wrap">
                <div class="box-sreach-contact not-found">
                   Contact not found 
                </div>
            </div></li>`;
    };

    public appendCloseListSearchContact = function (option) {
        return `<li id="search-box-contacts" class="search-contact">
            <div class="wrap">
                <div class="box-sreach-contact">
                    <input id="searchContacts" data-url="${option.dataUrlSearchAll}" type="button" class="btn btn-primary" value="Search contacts" />
                </div>
            </div></li>`;
    };

    public searchListContactListAll(requestListContact, callback: any = false) {
        let _this = this;
        this.callDataJS(requestListContact, function (dataResult) {
            if (dataResult.err) {
                console.log('ERROR: ', dataResult.err)
            } else {
                _this.showContactListAll(dataResult.data);
                window.listContactSearchDynamic = $.extend(true, [], dataResult.data.contactList);

                $('#contacts-your').append(requestListContact.reset ? '' : _this.appendCloseListSearchContact(dataResult.option));
            }

            if (typeof callback === "function")  callback();
        });
    };

    public searchOnContacts = function (listContacts) {
        let listUnsetAuthor = $.map(listContacts, function (elem) {
            if (elem.isSingle === true) {
                return elem.users_id;
            }
        });
        let listUnsetAuthorSearchDynamic = $.map(window.listContactSearchDynamic, function (elem) {
            if (elem.isSingle === true) {
                return elem.users_id;
            }
        });
        let request = {
            url: $('#searchContacts').attr('data-url'),
            data: {
                listContactParticipant: _.union(listUnsetAuthor, listUnsetAuthorSearchDynamic),
                valSearchContact: $.trim($('#search-contact').val()),
                _method: "post"
            }
        };
        let self = this;
        this.callDataJS(request, function (resultListContactSearch) {
            let listContactSearch = JSON.parse(resultListContactSearch.data);
            let lengthContacts = $('#contacts-your li').length - 1;

            if (listContactSearch.contactList.length) {
                $($("#contacts-your li")[lengthContacts]).before($(self.showContactListAll(listContactSearch, true)));
            } else {
                $($("#contacts-your li")[lengthContacts]).before($(self.appendNotFoundListSearchContact()));
            }
            $('#searchContacts').attr({disabled: true});
        });
    }
}
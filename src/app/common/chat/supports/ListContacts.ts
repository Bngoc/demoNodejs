'use strict';
import {isUndefined} from "util";
import {libSupports} from "../../libSupports";
import {isFunction} from "util";
declare var jQuery: any;
declare var $: any;
declare var require: any;

export class ListContacts extends libSupports {

    public listContacts: any;
    public remainTime: any;
    public reqDataReset: any;

    public renderResult(data = '') {
        let htmlOpen = '<div class="search-results-contacts"><div class="box-action-friend" id="box-action-friend">';
        let htmlClose = '</div></div>';

        return {htmlOpen: htmlOpen, htmlClose: htmlClose};
    };

    public renderSearch() {
        return '<div class="search-contacts"><input class="search-single" id="search-single" type="text" value="" maxlength="20"></div>';
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
            htmlListContactAction += '<div class="name-contact" data-act-freind="' + element.user_id + '" data-author="author.' + element.user_id + '"><span class="name-act">'
                + (element.middle_name ? element.middle_name : element.user_name)
                + '</span><i class="act-aptach fa fa-close" aria-hidden="true"></i></div>';
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
            htmlListContact += '<li class="contact-list"><div class="wap-contact" data-author="author.' + element.user_id + '">'
                + '<img src="' + (element.path_img ? element.path_img : ('assets/' + element.path_img_default)) + '" alt="">'
                + '<div class="meta-contact"><p class="">';

            htmlListContact += (element.hasOwnProperty('textSearch') ? element.textSearch : (element.middle_name ? element.middle_name : element.user_name));
            htmlListContact += '</p><p class="">' + (element.mood_message ? element.mood_message : '') + '</p></div></div></li>';
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

            let textSearch = items.middle_name;
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

        let htmlSingleAll = '<li class="contact">'
            + '<div class="wrap" data-conversation="' + element.idConversation + '" data-type="' + element.type + '"'
            + 'data-channel="' + element.channel_id + '" data-owner="' + element.creator_id + '">'
            + '<span channel="status.' + element.channel_id + '"'
            + 'class="list-icon-status contact-status ' + (element.is_accept_single ? option.cfgChat.cfg_chat.class_undefined : (element.is_life && classStatusPart) ? classStatusPart : "") + '"></span>'
            + '<img src="' + (element.path_img ? element.path_img : `assets/${option.cfgChat.cfg_chat.img_single_user}`) + '" alt=""/>'
            + '<div class="meta">'
            + '<span class="name-notify"><p class="name" data-conversation-name="' + element.middle_name + '">' + (element.hasOwnProperty('textSearch') ? element.textSearch : (element.middle_name ? element.middle_name : "&nbsp;")) + ' </p><i class="badges-notify">132</i></span>'
            + '<p class="preview mood_message">' + (element.mood_message ? element.mood_message : "") + ' </p>'
            + '</div>'
            + '</div>'
            + '</li>';

        return htmlSingleAll;
    };

    public renderContactGroup(element, option) {
        let htmlGroupAll = '<li class="contact">'
            + '<div class="wrap" data-conversation="' + element.idConversation + '" data-type="' + element.type + '"'
            + 'data-channel="' + element.channel_id + '" data-owner="' + element.creator_id + '">'
            + '<span channel="status.' + element.channel_id + '" class=""></span>'
            + '<img src="' + (element.path_img_group ? element.path_img_group : `assets/${option.cfgChat.cfg_chat.img_group_user}`) + '" alt=""/>'
            + '<div class="meta">'
            + '<span class="name-notify"><p class="name" data-conversation-name="' + element.title + '">' + (element.hasOwnProperty('textSearch') ? element.textSearch : element.title) + '</p><i class="badges-notify">132</i></span>'
            + '<p class="preview"> ' + element.count + '  participants</p>'
            + '</div>'
            + '</div>'
            + '</li>';

        return htmlGroupAll;
    };

    public showContactListAll(dataResult) {
        let _this = this;
        this.listContacts = dataResult;
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

        $('#contacts-your').html(htmlListContact);
    };

    public subscribeAfterClickListContact(remainTime, reqDataReset) {
        let _this = this;
        let valSearch = $.trim($('#search-contact').val());
        let runRemainTime = setInterval(function () {
            if (remainTime !== 'isUndefined' && reqDataReset !== 'isUndefined') {
                if (remainTime < _this.getDateTimeNow() && valSearch) {
                    clearInterval(runRemainTime);
                    $('#search-contact').val('');
                    _this.searchListContactListAll(reqDataReset, function () {
                        remainTime = isUndefined;
                        reqDataReset = isUndefined;
                    });
                }
            } else {
                clearInterval(runRemainTime);
            }
        }, 1000);
    };

    public searchListContactListAll(requestListContact, callback: any = false) {
        let _this = this;
        this.callDataJS(requestListContact, function (dataResult) {
            if (dataResult.err) {
                console.log('ERROR: ', dataResult.err)
            } else {
                _this.showContactListAll(dataResult);
                let htmlSearch = '<li id="search-box-contacts" class="search-contact"><div class="wrap"><div class="box-sreach-contact">'
                    + '<input type="button" class="btn btn-primary" value="Search contacts" /></div></div></li>';
                $('#contacts-your').append(requestListContact.reset ? '' : htmlSearch);
            }

            if (callback == isFunction) {
                callback();
            }
        });
    };
}


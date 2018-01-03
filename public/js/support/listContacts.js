let listContacts = function () {
    this.renderResult = function (data) {
        let htmlOpen = '<div class="search-results-contacts"><div class="box-action-friend" id="box-action-friend">';
        let htmlClose = '</div></div>';

        return {htmlOpen: htmlOpen, htmlClose: htmlClose};
    };

    this.renderSearch = function () {
        return '<div class="search-contacts"><input class="search-single" id="search-single" type="text" value="" maxlength="20"></div>';
    };

    this.renderListContact = function () {
        let htmlOpen = '<div class="data-contact" id="data-contact"><ul id="list-contacts">';
        let htmlClose = '</ul></div>';

        return {htmlOpen: htmlOpen, htmlClose: htmlClose};
    };

    this.actionContact = function (option) {
        let html = '<div class="clearfix"></div><div class="action-friend" id="action-friend">';
        html += (option !== undefined ? (option === false ? '<button class="btn btn-primary add" title="Add users" disabled>Add</button>' : '<button class="btn btn-primary create" title="Create group" disabled>Create</button>') : '');
        html += '<button class="btn btn-primary cancel">Cancel</button></div>';

        return html;
    };

    this.supportResultContact = function (obj) {
        let htmlListContactAction = '';
        obj.map(function (element) {
            htmlListContactAction += '<div class="name-contact" data-act-freind="' + element.user_id + '" data-author="author.' + element.user_id + '"><span class="name-act">'
                + (element.middle_name ? element.middle_name : element.user_name)
                + '</span><i class="act-aptach fa fa-close" aria-hidden="true"></i></div>';
        });

        return htmlListContactAction;
    };

    this.supportListContact = function (obj) {
        let htmlListContact = '';
        obj.map(function (element) {
            htmlListContact += '<li class="contact-list"><div class="wap-contact" data-author="author.' + element.user_id + '">'
                + '<img src="' + (element.path_img ? element.path_img : element.path_img_default) + '" alt="">'
                + '<div class="meta-contact"><p class="">';

            htmlListContact += (element.hasOwnProperty('textSearch') ? element.textSearch : (element.middle_name ? element.middle_name : element.user_name));
            htmlListContact += '</p><p class="">' + (element.mood_message ? element.mood_message : '') + '</p></div></div></li>';
        });

        return htmlListContact;
    };

    this.render = function (obj, objAction) {
        let resultHtml = '<div class="list-contact">';
        resultHtml += this.renderResult().htmlOpen + this.supportResultContact(objAction) + this.renderResult().htmlClose;
        resultHtml += this.renderSearch();
        resultHtml += this.renderListContact().htmlOpen + this.supportListContact(obj.data) + this.renderListContact().htmlClose;
        resultHtml += this.actionContact(obj.option.isConversationSingle);
        resultHtml += '</div>';
        return resultHtml;
    };

    this.searchLikeContact = function (obj, strSearch) {
        let stringSearch = strSearch !== 'undefined' ? strSearch : '';

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

    this.clickActContact = function () {
        return $.map($('.name-contact[data-act-freind]'), function (element) {
            let authorId = $(element).attr('data-act-freind');
            if (typeof authorId !== typeof undefined && authorId !== false) return parseInt(authorId);
            return false;
        });
    };
};
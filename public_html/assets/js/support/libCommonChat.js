let LibCommonChat = function () {
    this.swap = function (json) {
        var ret = {};
        for (var key in json) {
            ret[json[key]] = key;
        }
        return ret;
    };

    this.convertHtmlToPlainText = function (strHtml) {
        let stringHtml = strHtml !== undefined ? strHtml : "";
        if (stringHtml == '') return;

        return stringHtml.replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/\n/g, '<br>');
    };

    this.regExpString = function (strSearch) {
        let stringSearch = strSearch !== 'undefined' ? strSearch : '';

        return new RegExp(stringSearch, "g");
    };

    this.renderHtmlMessageVideo = function () {

    };

    this.renderHtmlMessageAudio = function () {

    };

    this.renderHtmlMessageImage = function () {

    };

    this.supportHtmlTextOther = function (contactMessage, reqOption) {
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

    this.supportHtmlTextPrivate = function (contactMessage, reqOption) {
        let htmlOpen = '<li class="_4tdt replies">'
            + '<div class="_ua2">';

        let htmlClose = '</div></li>';

        return {htmlOpen: htmlOpen, htmlClose: htmlClose};
    };

    this.supportHtmlTextAppend = function (obj, reqOption) {
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
        let dataTooltipContent = (reqOption.isUserCurrent) ? ('data-tooltip-private="1" data-tooltip-position="right" data-hover="tooltip" data-tooltip-content="' + this.checkTimeActiveLastWeek(obj.created_at) + '"') : "";

        return '<div ' + dataAttr + ' class="_5wd4 ' + (reqOption.isUserCurrent ? "js_hn _1nc6 " : "") + (reqOption.isUserFuture ? "bottom-m1" : "") + '">'
            + '<p ' + dataTooltipContent + classTooltipHover + ' class="' + listClass + '">' + this.convertHtmlToPlainText(obj.message) + '</p></div>';
    };

    this.checkTimeActiveLastWeek = function (lastCreatedAt) {
        const now = new Date();
        let timestampLastWeek = now.getTime() - (7 * 24 * 60 * 60 * 1000);
        if (lastCreatedAt === undefined || lastCreatedAt === null) return '';

        return customDateTime(lastCreatedAt, timestampLastWeek)
    }
};
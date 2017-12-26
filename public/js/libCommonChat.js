let LibCommonChat = function () {
    this.swap = function (json) {
        var ret = {};
        for (var key in json) {
            ret[json[key]] = key;
        }
        return ret;
    }

    this.convertHtmlToPlainText = function (strHtml) {
        let stringHtml = strHtml !== undefined ? strHtml : "";
        if (stringHtml == '') return;

        return stringHtml.replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/\n/g, '<br>');
    }

    this.zenderHtmlMessageVideo = function () {

    }

    this.zenderHtmlMessageAudio = function () {

    }

    this.zenderHtmlMessageImage = function () {

    }

    this.zenderHtmlMessageText = function (objElement, reqOption) {
        let htmlText = '';
        if (reqOption.isUserCurrent === true) {
            if (reqOption.isLoad === false) {
                htmlText = this.supportHtmlTextAppend(objElement, reqOption);
            } else {

            }
        } else {
            if (reqOption.isLoad === false) {
                htmlText = this.supportHtmlTextAppend(objElement, reqOption);
            } else {
                // user append
            }
        }

        return htmlText;
    }

    this.supportHtmlTextOther = function (contactMessage, reqOption) {
        let htmlOpen = '<li class="_4tdt sent author-' + 1111 + '">'
            + '<div class="_31o4">'
            + '<img src="http://emilcarlsson.se/assets/donnapaulsen.png" alt=""></div>'
            + '<div class="_ua2">';
        +((reqOption.isSingle === false) ? ('<div class="_4tdx">' + 11111 + '</div>') : "");

        let htmlClose = '</div></li>';

        return {htmlOpen: htmlOpen, htmlClose: htmlClose};
    }

    this.supportHtmlTextPrivate = function (contactMessage, reqOption) {
        let htmlOpen = '<li class="_4tdt replies">'
            + '<div class="_ua2">';

        let htmlClose = '</div></li>';

        return {htmlOpen: htmlOpen, htmlClose: htmlClose};
    };

    this.supportHtmlTextAdd = function (obj, reqOption) {
        let html = '<li class="_4tdt sent author-' + obj.sender_id + '">'
            + '<div class="_31o4">'
            + '<img src="http://emilcarlsson.se/assets/donnapaulsen.png" alt=""></div>'
            + '<div class="_ua2">'
            + ((reqOption.isSingle === false) ? ('<div class="_4tdx">' + obj.sender_id + '</div>') : "");

        let classBoxMsg = '';
        switch (reqOption.numMsg) {
            case 1:
                classBoxMsg = '';
                break;
            case 2:
                classBoxMsg = 'top-left';
                break;
            case 3:
                classBoxMsg = 'bottom-left top-left';
                break;
            default:
                classBoxMsg = "";
        }

        reqOption.classBoxMsg = classBoxMsg;
        let appendHtml = this.supportHtmlTextAppend(obj, reqOption);

        // + '<div class="_5wd4">'
        // + '<p>' + this.convertHtmlToPlainText(obj.message) + '</p>'
        // + '</div>';

        html += '</div></li>';

        return html;
    }

    this.supportHtmlTextAppend = function (obj, reqOption) {
        let listClass = '';
        if (reqOption.isUserCurrentTemp === false) {
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

        return '<div class="_5wd4 ' + (reqOption.isUserCurrent ? "_1nc6" : "") + ' ' + (reqOption.isUserFuture ? "bottom-m1" : "") + '">'
            + '<p class="' + listClass + '">' + this.convertHtmlToPlainText(obj.message) + '</p></div>';
    }
};
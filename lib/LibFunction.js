let LibFunction = function () {
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

    this.activeLastWeek = function (dateCheck, nowTimestampLastWeek) {
        let timestemp = new Date(dateCheck);
        return timestemp >= nowTimestampLastWeek;
    }
    
    // this.zenderHtmlMessageVideo = function () {
    //
    // }
    // this.zenderHtmlMessageAudio = function () {
    //
    // }
    // this.zenderHtmlMessageImage = function () {
    //
    // }
    // this.zenderHtmlMessageText = function (objElement, reqOption) {
    //     let htmlText = '';
    //     if (reqOption.isUserCurrentId === true) {
    //         if (reqOption.isLoad === false) {
    //             if (reqOption.isUserFuture) {
    //                 htmlText = '<li class="_4tdt replies">'
    //                     + '<div class="_ua2"><div class="_5wd4 _1nc6">'
    //                     + '<p>' + this.convertHtmlToPlainText(objElement.get('message')) + '</p></div></div></li>';
    //             }
    //         } else {
    //
    //         }
    //     } else {
    //         if (reqOption.isLoad === false) {
    //             htmlText = this.supportHtmlTextAddGroup(objElement, reqOption);
    //         } else {
    //
    //         }
    //     }
    //
    //     return htmlText;
    // }
    //
    // this.supportHtmlTextAdd = function (obj) {
    //     return 1;
    // }
    //
    // this.supportHtmlTextAppend = function (obj) {
    //     return 1;
    // }
    //
    // this.supportHtmlTextAddGroup = function (obj, reqOption) {
    //     return '<li class="_4tdt sent author-' + obj.get('sender_id') + '">'
    //     + '<div class="_31o4">'
    //     + '<img src="http://emilcarlsson.se/assets/donnapaulsen.png" alt=""></div>'
    //     + '<div class="_ua2">'
    //     + ((reqOption.isSingle === false) ? ('<div class="_4tdx">' + obj.get('sender_id') + '</div>') : "")
    //     + '<div class="_5wd4">'
    //     + '<p>' + this.convertHtmlToPlainText(obj.get('message')) + '</p>'
    //     + '</div></div></li>';
    // }
    //
    // this.supportHtmlTextAppendGroup = function (obj, reqOption) {
    //     return '<div class="_5wd4">'
    //         + '<p style="border-top-left-radius: 0px;">' + convertHtmlToPlainText(obj.get('message')) + '</p></div>';
    //
    // }

};

module.exports = LibFunction;
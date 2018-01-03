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
    };

    this.convertDateTimeToInt = function (reqDatetime) {
        let datatime = reqDatetime !== undefined ? reqDatetime : null;
        if (datatime == null) return;
        let datetime = new Date(datatime);

        return datetime.getTime();
    };
};

module.exports = LibFunction;
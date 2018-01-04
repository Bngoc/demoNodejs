let LibFunction = function () {
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

    this.randomStringGenerate = function () {
        return Math.random().toString(36).substring(2);
    };

    this.ucfirst = function (str) {
        let string = (str !== undefined ? str : '');
        if (str === '') return '';

        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

module.exports = LibFunction;
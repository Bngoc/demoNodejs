let listContacts = function () {
    this.renderResult = function (data) {
        let htmlOpen = '<div class="list-contact">'
            + '<div class="search-results-contacts">'
            + '<div class="box-action-friend">';

        let htmlClose = '</div></div>';

        return {htmlOpen: htmlOpen, htmlClose: htmlClose};
    };

    this.renderSearch = function () {
        return '<div class="search-contacts"><input class="search" type="text" maxlength="20"></div>';
    };

    this.renderListContact = function () {
        let htmlOpen = '<div class="data-contact"><ul>';
        let htmlClose = '</ul></div>';

        return {htmlOpen: htmlOpen, htmlClose: htmlClose};
    };

    this.supportResultContact = function (obj) {
        return '<div class="name-contact"><span class="name-act"> SSSSSS</span><i class="act-aptach fa fa-close" aria-hidden="true"></i></div>'
    };

    this.supportListContact = function (obj) {
        let html = '<li class="contact-list">'
            + '<div class="wap-contact" data-conversation="" data-type="single" data-channel="" data-owner="4">'
            + '<img src="/images/users.png" alt="">'
            + '<div class="meta-contact">'
            + '<p class="">bqngoc11229 undefine<i class="badges-notify">132</i></p>'
            + '<p class="">r</p>'
            + '</div>'
            + '</div>'
            + '</li>';

        return html;
    };

    this.render = function () {
        let resultHtml = this.renderResult().htmlOpen + this.renderResult().htmlClose;
        resultHtml += this.renderSearch();
        resultHtml += this.renderListContact().htmlOpen + this.supportListContact() + this.renderListContact().htmlClose;

        return resultHtml;
    };

    this.searchContact = function () {

    };

    this.clickAddContact = function () {

    };
};
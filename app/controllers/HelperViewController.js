'use strict';

var path = require('path'),
    fs = require('fs');

var sampleHtmlMaster = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/master.ejs'), 'utf-8');

function HelperViewController() {
    this.title = "Home";
    this.keywords = "demo nodejs";
    this.meta = "abc";
    this.media = "";
    this.header = "";
    this.nav = "";
    this.script = "";
    this.css = "";
    this.renderViews = "";
    this.content = "";
    this.page = "4";
    this.pagination = "";
    this.footer = "";
    this.isAuthenticated = false;
};

HelperViewController.prototype.readFile = function () {

};

HelperViewController.prototype.defaultScriptCss = function () {
    return 'method -> defaultScriptCss';
};

HelperViewController.prototype.setMeta = function (sampleHtmlMaster) {
    var sampleHtmlHeader = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/topHeader.ejs'), 'utf-8');
    // return sampleHtmlMaster.replace('{DEFINE_HEADER}', sampleHtmlHeader);

    return sampleHtmlHeader;
};

HelperViewController.prototype.nav = function (sampleHtmlMaster) {
    var sampleHtmlNav = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/nav.ejs'), 'utf-8');
    return sampleHtmlMaster.replace('{DEFINE_NAV}', sampleHtmlNav);
};

HelperViewController.prototype.header = function (sampleHtmlMaster) {
    var sampleHtmlHeader = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/topHeader.ejs'), 'utf-8');
    return sampleHtmlMaster.replace('{DEFINE_HEADER}', sampleHtmlHeader);
};

HelperViewController.prototype.includeCss = function () {

    return 'list css';
};

HelperViewController.prototype.includeScript = function () {
 return 'list script';
};

HelperViewController.prototype.footer = function (sampleHtmlMaster = 'sss') {
    var sampleHtmlFooter = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/footer.ejs'), 'utf-8');
    return sampleHtmlMaster.replace('{DEFINE_FOOTER}', sampleHtmlFooter);
};


HelperViewController.prototype.renderLayout = function () {
    var tmpSampleHtmlMaster = sampleHtmlMaster;
    var tmpSampleHtmlMaster = this.header(tmpSampleHtmlMaster);
    var tmpSampleHtmlMaster = this.nav(tmpSampleHtmlMaster);
    var tmpSampleHtmlMaster = this.footer(tmpSampleHtmlMaster);
    // var sampleHtmlMaster = this.footer(sampleHtmlMaster);
    // var sampleHtmlMaster = this.footer(sampleHtmlMaster);

    return tmpSampleHtmlMaster;
};

module.exports = HelperViewController;
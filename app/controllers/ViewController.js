'use strict';

var path = require('path'),
    fs = require('fs');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const bundles = require(`${coreHelper.paths.ROOT}bundles.json`);


function ViewController() {
    this.getVersion = coreHelper.package.version;
    this.title = "Welcome to " + coreHelper.sampleConfig.domain.host;

    this.metaCommonNotEdit = ' ';
    this.metaInclude = ' ';

    this.media = ' ';
    this.header = ' ';
    this.nav = '';

    this.cssCommonNotEdit = ' ';
    this.cssInclude = ' ';

    this.scriptCommonHeadNotEdit = ' ';
    this.scriptCommonBodyNotEdit = ' ';
    this.scriptIncludeHead = ' ';
    this.scriptInclude = ' ';

    this.page = "4";
    this.pagination = "";

    this.footer = ' ';
    this.feedBack = ' ';

    this.renderViews = ' ';
    this.isAuthenticated = false;

    this.coreHelper = coreHelper;
};

ViewController.prototype.getHeader = function (strHeader) {
    var fss = ('<h1 itemprop="name">' + strHeader + '</h1>');
    return fss;
};

// ViewController.prototype.coreHelper = function () {
//     return coreHelper;
// };

ViewController.prototype.nav = function (sampleHtmlMaster) {
    // var sampleHtmlNav = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/nav.ejs'), 'utf-8');
    // return sampleHtmlMaster.replace('{DEFINE_NAV}', sampleHtmlNav);
};

ViewController.prototype.footer = function (sampleHtmlMaster = 'sss') {
    // var sampleHtmlFooter = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/footer.ejs'), 'utf-8');
    // return sampleHtmlMaster.replace('{DEFINE_FOOTER}', sampleHtmlFooter);
    return;
};


class View extends ViewController {
    constructor() {
        super();
        var isWeb = coreHelper.sampleConfig.WEB ? 'main' : 'admin_main';

        this.metaCommonNotEdit = this.readFileInclude(bundles.meta[isWeb], 'o');
        this.cssCommonNotEdit = this.readFileInclude(bundles.styles[isWeb].files, 'c');
        this.scriptCommonHeadNotEdit = this.readFileInclude(bundles.scripts[isWeb].files.head);
        this.scriptCommonBodyNotEdit = this.readFileInclude(bundles.scripts[isWeb].files.body);
    }

    readFileInclude(dataArray, option = 'j') {
        var stringCommon = ' ';
        option = option.toLowerCase();

        for (var key in dataArray) {
            switch (option) {
                case "c":
                    stringCommon += `<link rel="stylesheet" href="/${dataArray[key]}?v=${this.getVersion}">`;
                    break;
                case "j":
                    stringCommon += `<script type="text/javascript" src="/${dataArray[key]}?v=${this.getVersion}"></script>`;
                    break;
                case "o":
                    stringCommon += dataArray[key];
                default:
            }
        }
        return stringCommon;
    }
}

module.exports = ViewController;
module.exports = View;

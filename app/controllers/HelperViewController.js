'use strict';

var path = require('path'),
    fs = require('fs');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const bundles = require(`${coreHelper.paths.ROOT}bundles.json`);



function HelperViewController() {
    this.getVersion = coreHelper.package.version;
    this.title = "Welcome to " + coreHelper.sampleConfig.domain.host;

    this.metaCommon = {};
    this.metaInclude = {};

    this.media = "&nbsp;";
    this.header = "&nbsp;";
    this.nav = "&nbsp;";

    this.cssCommon = {};
    this.cssInclude = {};

    this.scriptCommon = {};
    this.scriptInclude = {};

    this.page = "4";
    this.pagination = "";

    this.footer = "&nbsp;";
    this.feedBack = "&nbsp;";

    this.renderViews = "";
    this.isAuthenticated = false;

    this.coreHelper = coreHelper;
};

HelperViewController.prototype.coreHelper = function () {
    return coreHelper;
};

HelperViewController.prototype.nav = function (sampleHtmlMaster) {
    // var sampleHtmlNav = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/nav.ejs'), 'utf-8');
    // return sampleHtmlMaster.replace('{DEFINE_NAV}', sampleHtmlNav);
};

HelperViewController.prototype.header = function (sampleHtmlMaster) {
    // var sampleHtmlHeader = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/header.ejs'), 'utf-8');
    // return sampleHtmlMaster.replace('{DEFINE_HEADER}', sampleHtmlHeader);
};

HelperViewController.prototype.footer = function (sampleHtmlMaster = 'sss') {
    // var sampleHtmlFooter = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/footer.ejs'), 'utf-8');
    // return sampleHtmlMaster.replace('{DEFINE_FOOTER}', sampleHtmlFooter);
    return;
};


class View extends HelperViewController {
    constructor() {
        super();
        var isWeb = coreHelper.sampleConfig.WEB ? 'main' : 'admin_main';

        this.metaCommon = this.getMetaCommon(bundles.meta[isWeb].link);
        this.cssCommon = this.getCssCommon(bundles.styles[isWeb].files);
        this.scriptCommon = this.getScriptCommon(bundles.scripts[isWeb].files);
    }

    getMetaCommon(objMeta) {
        var strMeteLink = '&nbsp;';
        for (var key in objMeta) {
            strMeteLink += objMeta[key];
        }
        return strMeteLink;
    }

    getCssCommon(objCss) {
        var strCssCommon = '&nbsp;';
        for (var key in objCss) {
            strCssCommon += `<link rel="stylesheet" href="/css/${objCss[key]}?v=${this.getVersion}">`;
        }
        return strCssCommon;
    }

    getScriptCommon(objScript) {
        var strScriptCommon = '&nbsp;';
        for (var key in objScript) {
            strScriptCommon += `<script type="text/javascript" src="/js/${objScript[key]}?v=${this.getVersion}"></script>`;
        }
        return strScriptCommon;
    }

    readFile(data) {
        return;
    }
}


module.exports = HelperViewController;
module.exports = View;

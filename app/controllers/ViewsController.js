'use strict';
var path = require('path'),
    fs = require('fs');


var sampleHtmlMaster = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/master.ejs'), 'utf-8');

class ViewsController {
    constructor() {
        // this binding maintains the value of this
        // inside these methods during future calls .
        this.footer = this.footer.bind(this)
        // this.bar = this.bar.bind(this)
        // this.baz = this.baz.bind(this)
    }

    nav(sampleHtmlMaster) {
        var sampleHtmlNav = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/nav.ejs'), 'utf-8');
        return sampleHtmlMaster.replace('{DEFINE_NAV}', sampleHtmlNav);
    }

    header(sampleHtmlMaster) {
        var sampleHtmlHeader = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/topHeader.ejs'), 'utf-8');
        return sampleHtmlMaster.replace('{DEFINE_HEADER}', sampleHtmlHeader);
    }

    defaultScriptCss() {

    }

    includeCss() {

        return;
    }

    includeScript() {

    }

    footer(sampleHtmlMaster) {
        var sampleHtmlFooter = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/layouts/footer.ejs'), 'utf-8');
        return sampleHtmlMaster.replace('{DEFINE_FOOTER}', sampleHtmlFooter);
    }

    renderLayout() {
        var tmpSampleHtmlMaster = sampleHtmlMaster;
        var tmpSampleHtmlMaster = this.header(tmpSampleHtmlMaster);
        var tmpSampleHtmlMaster = this.nav(tmpSampleHtmlMaster);
        var tmpSampleHtmlMaster = this.footer(tmpSampleHtmlMaster);
        // var sampleHtmlMaster = this.footer(sampleHtmlMaster);
        // var sampleHtmlMaster = this.footer(sampleHtmlMaster);

        return tmpSampleHtmlMaster;
    }
}

module.exports = ViewsController;

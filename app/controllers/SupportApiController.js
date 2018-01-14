'use strict';

var path = require('path'),
    fs = require('fs');

// const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
// const coreHelper = new CoreHelper();
// const bundles = require(`${coreHelper.paths.ROOT}bundles.json`);

function SupportApi() {
    this.err = "";
    this.msg = "";
    this.status = "";
    this.code = null;
    this.data = [];
    this.options = [];
}

module.exports = SupportApi;

'use strict';

const path = require('path');
const dirname = path.dirname;
const DS = path.sep;

var DefinePaths = function definePaths() {
    this.ROOT = dirname(__dirname) + DS;
    this.LIB = `${this.ROOT}lib${DS}`;
    this.VENDOR = `${this.ROOT}vendor${DS}`;
    this.CONFIG = `${this.ROOT}config${DS}`;
    this.MODULE = `${this.CONFIG}module${DS}`;

    this.APP = `${this.ROOT}app${DS}`;
    this.CONTROLLERS = `${this.ROOT}controllers${DS}`;
    this.MODELS = `${this.ROOT}models${DS}`;

    this.RESOURCES = `${this.ROOT}resources${DS}`;
    this.VIEWS = `${this.RESOURCES}views${DS}`;

    this.PUBLIC = `${this.ROOT}public${DS}`;
    this.CSS = `${this.PUBLIC}css${DS}`;
    this.JS = `${this.PUBLIC}js${DS}`;
    this.IMAGES = `${this.PUBLIC}images${DS}`;
    this.LOGS = `${this.PUBLIC}logs${DS}`;
};

module.exports = DefinePaths;


// exports.ROOT            = dirname(__dirname) + DS;
// exports.LIB             = this.ROOT + 'lib' + DS;
// exports.VENDOR          = this.ROOT + 'vendor' + DS;
// exports.RESOURCES       = this.ROOT + 'resources' + DS;
// exports.PUBLIC          = this.ROOT + 'public' + DS;
exports.locales = this.ROOT + 'locales' + DS;
// exports.CONFIG  = this.ROOT + 'config' + DS;
// exports.cache           = this.ROOT + 'cache' + DS;
exports.config_module = this.config + 'modules' + DS;
exports.middlewares = this.config + 'middlewares' + DS;
exports.config_passport = this.config_module + 'passport' + DS;
// exports.APP             = this.ROOT + 'app' + DS;
// exports.controllers     = this.APP + 'controllers' + DS;
exports.controllersApi = this.controllers + 'api' + DS;
// exports.models          = this.app + 'models' + DS;
// exports.views           = this.app + 'views' + DS;
exports.sockets = this.app + 'sockets' + DS;
exports.utils = this.ROOT + 'utils' + DS;
exports.webROOT = this.ROOT + 'webROOT' + DS;
exports.webROOT_img = this.webROOT + 'images' + DS;
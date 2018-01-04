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
    this.CONTROLLERS = `${this.APP}controllers${DS}`;
    this.MIDDLEWARE = `${this.APP}middleware${DS}`;
    this.MODELS = `${this.APP}models${DS}`;

    this.RESOURCES = `${this.ROOT}resources${DS}`;
    this.VIEWS = `${this.RESOURCES}views${DS}`;

    this.PUBLIC = `${this.ROOT}public${DS}`;
    this.CSS = `${this.PUBLIC}css${DS}`;
    this.JS = `${this.PUBLIC}js${DS}`;
    this.IMAGES = `${this.PUBLIC}images${DS}`;

    this.STORAGE = `${this.ROOT}storage${DS}`;
    this.LOGS = `${this.STORAGE}logs${DS}`;
};

module.exports = DefinePaths;
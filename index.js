'use strict';

const express = require('express');

var CoreHelper = require('./config/CoreHelper.js');
var callCoreHelper = new CoreHelper();

callCoreHelper.createFileConfig(function (err, done) {
    if (err) {
        console.log('ERROR Run server ...', err);
    } else {
        // ------------- Run app ----------------------
        var runServer = callCoreHelper.runServer();

        callCoreHelper.runExpress();
        callCoreHelper.runRoutes();
        callCoreHelper.getConnect();
        callCoreHelper.connectKnex();

        callCoreHelper.runSocket(runServer);
    }
});

// const sampleConfig = require(`${paths.CONFIG}/config.json`);
// const sampleConfigRoutes = require(`${paths.APP}/routers.js`);
// const sampleConfigServer = require(`${paths.CONFIG}/server.js`);
// const sampleConfigRoutes = require(`${paths.APP}/routers.js`);

// var configServer = sampleConfigServer(samplePaths);

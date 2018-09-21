'use strict';
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

'use strict';

const sampleRequirePaths = require('./../config/paths.js');
const paths = new sampleRequirePaths();
const sampleDB = require(`${paths.CONFIG}/db.json`);

function CoreHelper() {

    this.paths = paths;

    this.sampleConfig = require(`${paths.CONFIG}/config.json`);

    this.mySql = function () {
        var MySQL = require("mysql");
        var connectionPool = MySQL.createPool(sampleDB[this.sampleConfig.DB_CONNECTION]);
        // var isCheckConnect = {
        //     'isConnect': false,
        //     'msg': ''
        //
        // };
        var connection = connectionPool.getConnection(function (error, done) {
            var isCheckConnect = {};
            // if (error) {
            //     console.log('Connect faill to mySQL ...! ' + done, ' -- ' + error);
                isCheckConnect['smg'] = (!error) ? 'Connect success to mySQL ...!' : 'Connect faill to mySQL ...!';
                isCheckConnect['isConnect'] = (!error) ? true : false;
            // } else {
            //     console.log('Connect success to mySQL ...! ' + done, ' -- ' + error);
            //     isCheckConnect['smg'] = 'Connect success to mySQL ...! ';
            //     isCheckConnect['isConnect'] = true;
            // }
            console.log(isCheckConnect, 'WWWWWWWWW');
            // (isCheckConnect);
        });
        // return isCheckConnect;
      // console.log(connection, 'wwwww');
    };

    this.pgSQL = function connectionPGSQL() {

    };


    this.configApp = function (app) {

    };

    this.configSocket = function (app) {

    };


    this.runRoutes = function (app) {
        var Router = require(`${paths.APP}/routers.js`);
        var router = new Router();
        return router.useRoutes(app, paths);
    };
    this.runServer = function (app) {
        var sampleServer = require(`${paths.CONFIG}/server.js`);
        var server = new sampleServer();
        server.createServer(app, this.sampleConfig);

        console.log('Running Server ....!');
        return server;
    };
}

module.exports = CoreHelper;
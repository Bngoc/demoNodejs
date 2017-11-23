'use strict';

const MySQL = require("mysql");
const pg = require('pg');

const sampleRequirePaths = require('./../config/paths.js');
const paths = new sampleRequirePaths();
const sampleDB = require(`${paths.CONFIG}/db.json`);
const sampleConfig = require(`${paths.CONFIG}/config.json`);
const samplePackage = require(`${paths.ROOT}/package.json`);
const sampleApp = require(`${paths.CONFIG}/app.js`);


function CoreHelper() {

    this.package = samplePackage;

    this.app = sampleApp;

    this.paths = paths;

    this.sampleConfig = sampleConfig;

    this.getConfigInfoDb = function () {
        try {
            var getNameConnectDb = sampleConfig.DB_CONNECTION ? sampleConfig.DB_CONNECTION : '';
            var getsampleConfigDB = sampleDB[getNameConnectDb] ? sampleDB[getNameConnectDb] : {};

            if (getsampleConfigDB) {
                getsampleConfigDB.host = sampleConfig.DB_HOST;
                getsampleConfigDB.port = sampleConfig.PORT;
                getsampleConfigDB.database = sampleConfig.DB_DATABASE;
                getsampleConfigDB.user = sampleConfig.DB_USERNAME;
                getsampleConfigDB.password = sampleConfig.DB_PASSWORD;
            }
            return getsampleConfigDB;
        } catch (ex) {
            return {}
        }
    };

    this.mySql = function () {
        // var connectionPool = MySQL.createPool(this.getConfigInfoDb());
        // return connectionPool;
        var connection = MySQL.createConnection(this.getConfigInfoDb());
        return connection;
    };

    this.pgSQL = function connectionPGSQL() {
        var connection = new pg.Pool(this.getConfigInfoDb());
        // var connection = new pg.Client(this.getConfigInfoDb());
        return connection;
    };

    this.runSocket = function (runServer) {
        var Socket = require(`${paths.CONFIG}/socket.js`);
        var socket = new Socket();
        socket.configSocket(runServer, this);
    };

    this.runExpress = function (app) {
        var Express = require(`${paths.MODULE}/express.js`);
        var express = new Express();
       express.configExpress(app, this);
    };

    this.runRoutes = function (app) {
        var Router = require(`${paths.APP}/routers.js`);
        var router = new Router();
        router.useRoutes(app, this);
    };

    this.runServer = function (app) {
        var Server = require(`${paths.CONFIG}/server.js`);
        var server = new Server();
        var createServer = server.createServer(app, this.sampleConfig);
        return createServer;
    };

    this.callModule = function (nameController = '', isNew = false) {
        if (nameController == '') return false;
        var UseController = require(nameController);

        return isNew ? new UseController() : UseController;
    }
}


class ConnectDB extends CoreHelper {

    getConnect() {
        try {
            const getNameConnectDb = this.sampleConfig.DB_CONNECTION ? this.sampleConfig.DB_CONNECTION : '';
            if (getNameConnectDb === 'mysql') {
                return this.mySql();
            } else if (getNameConnectDb === 'pgsql') {
                return this.pgSQL();
            } else {
                console.log('Not config connect db!');
                // throw new Error("Not config connect db!");
                return null;
            }
        } catch (ex) {
            return null;
        }
    }

    connection(callback) {
        const connection = this.getConnect();
        const strDB = this.sampleConfig.DB_CONNECTION ? this.sampleConfig.DB_CONNECTION : '';
        var resultContion = {
            error: '',
            msg: '',
            connect: connection
        };

        if (connection) {
            connection.connect(function (error) {
                if (!!error) {
                    resultContion.error = error;
                    resultContion.msg = `ERR: Cannot connect to Database server ${strDB}......`;
                    console.log(`ERR: Cannot connect to Database server ${strDB}......`);
                    callback(resultContion);
                } else {
                    callback(resultContion);
                }
            });
        } else {
            resultContion.error = 'Not config connect db!';
            resultContion.msg = `ERR: Cannot config connect to Database server ${strDB}......`;
            callback(resultContion);
        }
    }
}


module.exports = CoreHelper;
module.exports = ConnectDB;

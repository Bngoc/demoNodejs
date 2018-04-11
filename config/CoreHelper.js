'use strict';

const MySQL = require("mysql");
const pg = require('pg');
const express = require('express');
const app = express();
const sampleRequirePaths = require('./../config/paths.js');
const paths = new sampleRequirePaths();
const sampleDB = require(`${paths.CONFIG}/db.json`);
const sampleConfig = require(`${paths.CONFIG}/config.json`);
const config = require('config');
const samplePackage = require(`${paths.ROOT}/package.json`);
const sampleApp = require(`${paths.CONFIG}/app.js`);
var setAliasRouter = {};


function CoreHelper() {

    this.package = samplePackage;

    this.app = sampleApp;

    this.paths = paths;

    this.sampleConfig = config;

    this.getConfigInfoDb = function () {
        try {
            var getNameConnectDb = config.get('DB_CONNECTION') ? config.get('DB_CONNECTION') : '';
            var getsampleConfigDB = sampleDB[getNameConnectDb] ? sampleDB[getNameConnectDb] : {};

            if (getsampleConfigDB) {
                getsampleConfigDB.host = config.get('DB_HOST');
                getsampleConfigDB.port = config.get('PORT');
                getsampleConfigDB.database = config.get('DB_DATABASE');
                getsampleConfigDB.user = config.get('DB_USERNAME');
                getsampleConfigDB.password = config.get('DB_PASSWORD');
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
        var socket = this.callModule(`${paths.MODULE}/express.js`, true);
        let io = socket.configSocket(runServer, app, this);
        var chatController = this.callModule(`${paths.CONTROLLERS}ChatController.js`, true);
        chatController.socketConnection(io);
    };

    this.runExpress = function () {
        var express = this.callModule(`${paths.MODULE}/express.js`, true);
        return express.configExpress(app, this);
    };

    this.runRoutes = function () {
        var router = this.callModule(`${paths.APP}/routers.js`, true);
        var createRouter = router.useRoutes(app, this);
        if (!setAliasRouter.length) setAliasRouter = createRouter;

        return createRouter;
    };

    this.passport = function (optCall) {
        var passport = this.callModule(`${paths.MODULE}/passport.js`, true);
        if (optCall === 'local') {
            var configPassport = passport.configPassport(this);
        } else if (optCall === 'facebook') {
            var configPassport = passport.configPassportFB(this);
        }

        return configPassport;
    };

    this.runServer = function () {
        var server = this.callModule(`${paths.CONFIG}/server.js`, true);
        var createServer = server.createServer(app, {paths: paths, config: sampleConfig});
        return createServer;
    };

    this.callModule = function (nameController = '', isNew = false) {
        if (nameController == '') return false;
        var UseController = require(nameController);

        return isNew ? new UseController() : UseController;
    };

    this.aliasRouter = function () {
        return setAliasRouter;
    };

    this.createSignToken = function (keySecret, reqData) {
        var token = this.callModule(`${paths.CONFIG}/token.js`, true);
        return token.signToken(keySecret, reqData);
    };

    this.createFileConfig = function (callback) {
        // console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
        // console.log('NODE_CONFIG_DIR: ' + config.util.getEnv('NODE_CONFIG_DIR'));
        console.log(config);
        let side = (((config.get('domain.ssl') === true) ? "https://" : "http://") + `${config.get('domain.host')}:${config.get('domain.port')}`);
        let apiClient = {
            "/api/*": {
                "target": side,
                "secure": config.get('domain.secure'),
                "changeOrigin": config.get('domain.changeOrigin')
            }
        };
        let reqData = {
            path: `${paths.ROOT}/proxy.conf.json`,
            fileContent: JSON.stringify(apiClient)
        };

        let syncFile = this.callModule(`${paths.LIB}/SyncFile.js`, true);
        syncFile.createFile(reqData, function (err, done) {
            if (err) {
                console.log(`Error: ${reqData.path} .....`, err);
                callback(err);
                // return console.log(`Error: ${reqData.path} .....`, err);
            }
            console.log(`The file ${reqData.path} was saved!`);
            callback(null, true);
        });
    }
}


class ConnectDB extends CoreHelper {

    getConnect() {
        try {
            const getNameConnectDb = config.get('DB_CONNECTION') ? config.get('DB_CONNECTION') : '';
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
        const strDB = config.get('DB_CONNECTION') ? config.get('DB_CONNECTION') : '';
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

    connectKnex() {
        var _this = this;
        const knex = require('knex')({
            client: config.get('DB_CONNECTION') ? config.get('DB_CONNECTION') : '',
            connection: _this.getConfigInfoDb(),
            debug: config.get('APP_DEBUG'),
            migrations: {
                directory: __dirname + 'db/migrations'
            },
            seeds: {
                directory: __dirname + 'db/seeds/dev'
            }
        });

        return knex;
    };

    bookshelf() {
        var bookshelf = require('bookshelf')(this.connectKnex());

        return bookshelf;
    }

    checkConnect(cb) {
        const connect = this.connectKnex();
        const strDB = config.get('DB_CONNECTION') ? config.get('DB_CONNECTION') : '';
        var resultContion = {
            error: '',
            msg: '',
            connect: connect
        };

        connect.raw('select 1+1 as result').catch(err => {
            console.log(err, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
            if (err.code === 'ECONNREFUSED') {
                resultContion.msg = `ERR: Cannot connect to Database server ${strDB}......`;
                resultContion.error = err.code;
                cb(resultContion);
            } else {
                cb(resultContion);
            }
        });
    }
}


module.exports = CoreHelper;
module.exports = ConnectDB;

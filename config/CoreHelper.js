'use strict';

const MySQL = require("mysql");
const pg = require('pg');
const sampleRequirePaths = require('./../config/paths.js');
const paths = new sampleRequirePaths();
const sampleDB = require(`${paths.CONFIG}/db.json`);
const sampleConfig = require(`${paths.CONFIG}/config.json`);
const samplePackage = require(`${paths.ROOT}/package.json`);

function CoreHelper() {

    this.package = samplePackage;

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
        ////* Check in controller

        // connectionPool.getConnection(function (error, connection) {
        //     if (err) {
        //         res.json({"code": 100, "status": "Error in connection database"});
        //         return;
        //     }
        //     connection.query("select * from user", function (err, rows) {
        //         connection.release();
        //         if (!err) {
        //             res.json(rows);
        //         }
        //     });
        //     connection.on('error', function (err) {
        //         res.json({"code": 100, "status": "Error in connection database"});
        //         return;
        //     });
        // });


        var connection = MySQL.createConnection(this.getConfigInfoDb());
        return connection;

        ////* Check connect in controller
        // connection.connect(function (err) {
        //     if (!err) {
        //         console.log("Database is connected ... nn");
        //     } else {
        //         console.log("Error connecting database ... nn");
        //     }
        // });
    };

    this.pgSQL = function connectionPGSQL() {
        var connection = new pg.Pool(this.getConfigInfoDb());
        // var connection = new pg.Client(this.getConfigInfoDb());
        return connection;
    };


    this.runSocket = function (app) {
        // var Socket = require(`${paths.MODULE}/socket.js`);
        // var configSocket = new Socket();
        //  configSocket.configSocket(app, paths);
        //return configSocket;
    };

    this.runExpress = function (app) {
        var Express = require(`${paths.MODULE}/express.js`);
        var configExpress = new Express();
        configExpress.configExpress(app, this);
        return configExpress;
    };

    this.runRoutes = function (app) {
        var Router = require(`${paths.APP}/routers.js`);
        var router = new Router();
        router.useRoutes(app, this);
        return router;
    };

    this.runServer = function (app) {
        var Server = require(`${paths.CONFIG}/server.js`);
        var server = new Server();
        server.createServer(app, this.sampleConfig);
        return server;
    };
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
}


module.exports = CoreHelper;
module.exports = ConnectDB;

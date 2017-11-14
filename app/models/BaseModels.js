'use strict';

var mySQL = require("mysql");
var path = require('path');

const getCoreHelper = require(path.join(__dirname, './../../config/CoreHelper.js'));
const CoreHelper = new getCoreHelper();

class BaseModels {

    connectionMYSQL() {
        var connectionPool = mySQL.createPool(CoreHelper.sampleDb[CoreHelper.sampleConfig.DB_CONNECTION]);
        return connectionPool.getConnection(done);
    }

    connectionPGSQL() {

    }

}

module.exports = BaseModels;
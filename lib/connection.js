var MySQL = require("mysql");

var config = require("./../config/config.json");
var db = require("./../config/db.json");
var connectionPool = MySQL.createPool(db[config.DB_CONNECTION]);

var getConnection = function (done) {
    //connectionLimit -- tempCount
    connectionPool.getConnection(done);
    // if (!!done) {
    //     tempCount.release();
    // } else  {
    //
    // }
    // console.log(done + 'db');
};

module.exports = {getConnection: getConnection};
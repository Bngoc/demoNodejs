var MySQL = require("mysql");
var config = require("./../db.json");

var connectionPool = MySQL.createPool({
    connectionLimit: 50,
    host: config.db_config.host,
    user: config.db_config.user,
    password: config.db_config.password,
    port: config.db_config.port,
    database: config.db_config.database
});

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
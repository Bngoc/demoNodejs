'use strict';

let User = function (params) {
    this.id = params.id;
    this.email = params.email;
    this.phone = params.phone;
    this.password = params.password;
    this.verification_code = params.verificationCode;
    this.is_active = params.isActive;
    this.is_reported = params.isReported;
    this.is_blocked = params.isBlocked;
    this.lastactive = params.lastactive;
};

User.prototype.checkExistUserName = function (req, res, callback) {
    var myQuery = 'SELECT * from users limit 10';// where id = ' + [dataRequsest.id];

    req.connection.query(myQuery, function (err, rows, filed) {
        if (err) {
            req.showResponse.title = 'query error ... !';
            req.showResponse.name = myQuery;
            req.showResponse.content = myQuery;

            callback(err, req.showResponse);
        } else {
            //postgres sql result rows.row
            //mysql result rows
            callback(null, rows.rows ? rows.rows : rows);
        }
    });
};

User.prototype.register = function (req, res, callback) {
    const connection = req.showResponse.coreHelper.getConnect();

    let resultData = [];

    var dataRequsest = {
        id: req.id ? req.id : 6
    };

    if (connection) {
        connection.connect(function (error) {
            if (!!error) {

                req.showResponse.title = 'Errors 404';
                // req.showResponse.renderViews = 'errors/404.ejs';
                req.showResponse.content = `ERR: Cannot connect to Database server ${req.showResponse.coreHelper.sampleConfig.DB_CONNECTION}......`;

                console.log(`ERR: Cannot connect to Database server ${req.showResponse.coreHelper.sampleConfig.DB_CONNECTION}......`);
                callback(error, req.showResponse);
            } else {
                // use SQL DB raw, because support connect Mysql and Postgres Sql
                var myQuery = 'SELECT * from users limit 10';// where id = ' + [dataRequsest.id];

                connection.query(myQuery, function (err, rows, filed) {
                    if (err) {
                        req.showResponse.title = 'query error ... !';
                        req.showResponse.name = myQuery;
                        req.showResponse.content = myQuery;

                        callback(err, req.showResponse);
                    } else {
                        //postgres sql result rows.row
                        //mysql result rows
                        callback(null, rows.rows ? rows.rows : rows);
                    }
                });
            }
        });
    } else {
        req.showResponse.title = 'Not config connect db!';
        req.showResponse.content = `ERR: Cannot config connect to Database server ${req.showResponse.coreHelper.sampleConfig.DB_CONNECTION}......`;

        callback(1, req.showResponse);
    }
};


User.prototype.show = function (req, res, callback) {

};

module.exports = User;

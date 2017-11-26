'use strict';

// var mysqlModel = require('mysql-model');
//https://www.npmjs.com/package/mysql-model


// http://knexjs.org/
// http://bookshelfjs.org/
//https://www.npmjs.com/package/knex-model-wrapper


var resultSql = {
    error: '',
    msg: '',
    result: null
};

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

User.prototype.insert = function (connect, configDb, dataRequest, callback) {

    const MyAppModel = mysqlModel.createConnection(configDb);

    var modelUserData = {
        email: dataRequest.email,
        phone: dataRequest.phone,
        password: dataRequest.password
    };

    var Movie = MyAppModel.extend({
        tableName: "users",
    });

    var movie = new Movie(modelUserData);
    movie.save(function (errr, data) {
        console.log(data,'---------------------------------------------------', errr);
    });



    var objInsert = {};

    var myQuery = '';

    connect.query(myQuery, function (err, rows, filed) {
        if (err) {
            resultSql.msg = 'query error ... !';
            resultSql.error = myQuery;
        } else {
            //postgres sql result rows.row || mysql result rows
            resultSql.result = rows.rows ? rows.rows : rows
        }
        callback(resultSql);
    });
};

User.prototype.show = function (connect, dataRequest, callback) {

};

User.prototype.update = function (connect, dataRequest, callback) {

};

User.prototype.delete = function (connect, dataRequest, callback) {

};

User.prototype.checkExistUserName = function (connect, dataRequest, callback) {
    var myQuery = `SELECT * from users where phone = '${dataRequest.phone}' or email = '${dataRequest.email}'`;

    connect.query(myQuery, function (err, rows, filed) {
        if (err) {
            resultSql.msg = 'query error ... !';
            resultSql.error = myQuery;
        } else {
            //postgres sql result rows.row || mysql result rows
            resultSql.result = rows.rows ? (rows.rows.length > 0) : (rows.length > 0);
        }
        console.log('99999999999999999999', resultSql)
        callback(resultSql)
    });
};

User.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

User.prototype.registerInsert = function (connect, dataRequest, callback) {

    var myQuery = '';

    connect.query(myQuery, function (err, rows, filed) {
        if (err) {
            resultSql.msg = 'query error ... !';
            resultSql.error = myQuery;
        } else {
            //postgres sql result rows.row || mysql result rows
            resultSql.result = rows.rows ? rows.rows : rows
        }
        callback(resultSql);
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


module.exports = User;

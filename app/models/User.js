'use strict';

// var mysqlModel = require('mysql-model');
//https://www.npmjs.com/package/mysql-model


// http://knexjs.org/
// http://bookshelfjs.org/
//https://www.npmjs.com/package/knex-model-wrapper

const bcrypt = require('bcrypt');
const path = require('path');
const Promise = require('bluebird');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const bookshelf = require('bookshelf')(coreHelper.connectKnex());
const Conversation = coreHelper.callModule(`${coreHelper.paths.MODELS}chat/Conversation.js`);
const BlockList = coreHelper.callModule(`${coreHelper.paths.MODELS}chat/BlockList.js`);
const Contacts = coreHelper.callModule(`${coreHelper.paths.MODELS}Contacts.js`);

let Users = bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true,
    // validations: {
    //     email: [
    //         'isRequired',
    //         {isEmail: {allow_display_name: true}}, // Options object passed to node-validator
    //         {method: 'isLength', error: 'Username 4-32 characters long.', args: [4, 32]} // Custom error message
    //     ],
    //     username: ['required', 'alphaNumeric'],
    // },
    // validate: function (model, attrs, options) {
    //     return CheckIt(this.toJSON()).run(this.validations);
    // },
    hidden: ['password'],

    contacts: function () {
        return this.hasOne(Contacts, 'users_id');
    },

    blockList: function () {
        return this.hasMany(BlockList, 'users_id');
    },
    conversation: function () {
        return this.hasMany(Conversation, 'creator_id');
    },
});

// --------------------------------------End relationship -------------------------

var result = {
    code: null,
    error: '',
    msg: '',
    result: null
};

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

Users.prototype.findById = function (id, callback) {
    Users.where({id: id}).fetch().then(function (data) {
        // Users.where({id: id}).fetch({withRelated: ['contacts']}).then(function (data) {
        callback(null, data);
    }).catch(function (err) {
        callback(err);
    });
};

Users.prototype.findByIdChat = function (id, callback) {
    Users.where({id: id}).fetch({withRelated: ['contacts', 'blockList', 'conversation']}).then(function (data) {
        callback(null, data);
    }).catch(function (err) {
        callback(err);
    });
};

Users.prototype.findOne = function (dataRequest, callback) {
    Users.where({id: dataRequest.id}).fetch().then(function (data) {
        callback(null, data);
    }).catch(function (err) {
        callback(err);
    });
};

Users.prototype.findUser = function (dataRequest, callback) {
    let response = result;
    Users
        .query(function (qb) {
            qb
                .where('phone', '=', dataRequest.loginId)
                .orWhere('email', '=', dataRequest.loginId);
        })
        .fetch()
        .then(function (model) {
            response.result = model;
            callback(response);
        })
        .catch(function (err) {
            if (err.length) {
                response.error = err;
                response.code = err.code ? err.code : 'ERROR';
            }
            callback(response);
        });
};


Users.prototype.checkUser = function (dataRequest, callback) {
    Users.query(function (qb) {
        qb.where('phone', '=', dataRequest.phone).orWhere('email', '=', dataRequest.email);
    }).count().then(function (findUser) {
        result.result = findUser;
        callback(result);
    }).catch(function (err) {
        result.error = err;
        result.code = err.code;
        callback(result);
    });
};


Users.prototype.insertUser = function (dataRequest, callback) {
    var dtUser = {
        email: dataRequest.email,
        phone: dataRequest.phone,
        lastactive: dataRequest.email,
        password: bcrypt.hashSync(dataRequest.password, 10)
    };
    bookshelf.transaction(function (t) {
        return new Users(dtUser)
            .save(null, {transacting: t})
            .tap(function (useModelData) {
                return Promise.map([
                    {
                        first_name: dataRequest.first_name,
                        last_name: dataRequest.last_name,
                        // middle_name: (dataRequest.first_name + ' ' + dataRequest.last_name),
                        // country: 'vn'
                    }
                ], function (info) {
                    // Some validation could take place here.
                    return new Contacts(info).save({'users_id': useModelData.id}, {transacting: t});
                });
            });
    }).then(function (library) {
        result.result = library;
        callback(result);

    }).catch(function (err) {
        result.error = err;
        result.code = err.code;
        callback(result);
    });
};


Users.prototype.insert = function (connect, configDb, dataRequest, callback) {

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
        console.log(data, '---------------------------------------------------', errr);
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

Users.prototype.show = function (connect, dataRequest, callback) {

};

Users.prototype.update = function (connect, dataRequest, callback) {

};

Users.prototype.delete = function (connect, dataRequest, callback) {

};

Users.prototype.checkExistUserName = function (connect, dataRequest, callback) {
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

Users.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

Users.prototype.registerInsert = function (connect, dataRequest, callback) {

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

Users.prototype.register = function (req, res, callback) {
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


/*
function insertUser(user, cb) {
    return bookshelf.transaction(function (t) {
        var key = user.key;

        var devID = Developer.forge({key: key})
            .fetch({require: true, transacting: t})
            .call("get", "id");

        var addressID = devID.then(function () {
            return Address.forge(user.address).fetch({require: true, transacting: t})
        }).call("get", "addressId");

        var financialID = addressModel.then(function () {
            return Financial.forge(user.financial).save(null, {transacting: t})
        }).call("get", "financialId");

        var userModel = financialID.then(function () {
            var userEntity = user.personal;
            userEntity.addressId = addressID.value();
            userEntity.developerId = devID.value();
            userEntity.financialId = financialID.value();
            return User.forge(userEntity).save(null, {transacting: t});
        });

        return userModel.then(function (userModel) {
            logger.info('saved user: ', userModel);
            logger.info('commiting transaction');
            t.commit(userModel);
        }).catch(function (e) {
            t.rollback(e);
            throw e;
        });
    }).then(function (model) {
        logger.info(model, ' successfully saved');
        return Promise.resolve(respond.success({userId: model.get('userId')}));
    }).catch(function (err) {
        logger.error(err, ' occurred');
        return Promise.reject(new DatabaseError('Unable to write user to database due to error ', err.message));
    });
};
*/

module.exports = Users;
// module.exports = User;
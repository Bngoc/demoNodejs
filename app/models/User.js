'use strict';

// var mysqlModel = require('mysql-model');
//https://www.npmjs.com/package/mysql-model


// http://knexjs.org/
// http://bookshelfjs.org/
//https://www.npmjs.com/package/knex-model-wrapper

const bcrypt = require('bcrypt');
const path = require('path');
const Promise = require('bluebird');
var _ = require('underscore');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();

const knex = coreHelper.connectKnex();
const bookshelf = coreHelper.bookshelf();


const Conversations = coreHelper.callModule(`${coreHelper.paths.MODELS}chat/Conversation.js`);
const BlockList = coreHelper.callModule(`${coreHelper.paths.MODELS}chat/BlockList.js`);
const Participants = coreHelper.callModule(`${coreHelper.paths.MODELS}chat/Participants.js`);
const Contacts = coreHelper.callModule(`${coreHelper.paths.MODELS}Contacts.js`);

// Note - use require model other, because relationship not working

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

    useContacts: function () {
        // return this.hasOne(new Contacts.model, 'users_id');
        return this.hasOne(coreHelper.callModule(`${coreHelper.paths.MODELS}Contacts.js`).model, 'users_id');
    },

    useBlockList: function () {
        // return this.hasMany(BlockList(model), 'users_id');
        return this.hasMany(coreHelper.callModule(`${coreHelper.paths.MODELS}chat/BlockList.js`).model, 'users_id');
    },
    useConversation: function () {
        // return this.hasMany(Conversation(model), 'creator_id');
        return this.hasMany(coreHelper.callModule(`${coreHelper.paths.MODELS}chat/Conversation.js`).model, 'creator_id');
    },
    useParticipants: function () {
        // return this.hasMany(Participants(model), 'users_id');
        return this.hasMany(coreHelper.callModule(`${coreHelper.paths.MODELS}chat/Participants.js`).model, 'users_id');
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

User.prototype.findById = function (id, callback) {
    Users.where({id: id}).fetch().then(function (data) {
        // Users.where({id: id}).fetch({withRelated: ['contacts']}).then(function (data) {
        callback(null, data);
    }).catch(function (err) {
        callback(err);
    });
};


User.prototype.findConversation = function (id, callback) {
    let responseData = {};
    Users.where({id: id}).fetch({withRelated: ['useContacts', 'useBlockList']}).then(function (data) {
        responseData['infoAccount'] = data;

        let getBlockList = data.relations.useBlockList
            .filter(function (isDelete) {
                if (isDelete.get('is_deleted') != 0) {
                    return isDelete.get('participants_id');
                }
            })
            .map(function (listItem) {
                return listItem.get('participants_id');
            });

        Participants.model
            .query(function (qd) {
                qd.where('id', 'not in', getBlockList).where({"users_id": data.get('id')})
            })
            .fetchAll({columns: ['id', 'conversation_id', 'users_id']})
            // .fetchAll({columns: ['id', 'title', 'creator_id', 'channel_id']})
            .then(function (modelParticipants) {
                let getParticipantsList = modelParticipants.map(function (listItem) {
                    return listItem.get('conversation_id');
                });

                Conversations.model
                    .query(function (dq) {
                        dq.where('id', 'in', getParticipantsList).where('is_deleted', '=', '0');
                    })
                    // .fetchAll({withRelated: ['cccccc', {'conParticipant': function(db){ qb.where('status', 'enabled'); }}]})
                    .fetchAll({
                        withRelated: [{
                            'conParticipant': function (qb) {
                                qb.where('users_id', '!=', id)
                            }
                        }]
                    })
                    .then(function (modelConver) {
                        responseData['modelConversation'] = modelConver;

                        callback(null, responseData);
                    })
                    .catch(function (errPartici) {
                        callback(errPartici);
                    });
            }).catch(function (errPartici) {
            callback(errPartici);
        });
    }).catch(function (err) {
        callback(err);
    });
}

User.prototype.findByIdChat = function (id, callback) {
    let responseData = {};
    this.findConversation(id, function (err, modelConversation) {

        if (err) {
            callback(err)
        } else {
            responseData['infoAccount'] = modelConversation.infoAccount;
            let modelConver = modelConversation.modelConversation;
            let infoParticipantClone = [];

            modelConver.forEach(function (elem) {
                elem.relations.conParticipant.forEach(function (elemUser, indx) {
                    let infoParticipant = {};
                    infoParticipant['idConversation'] = elem.get('id');
                    infoParticipant['title'] = elem.get('title');
                    infoParticipant['creator_id'] = elem.get('creator_id');
                    infoParticipant['channel_id'] = elem.get('channel_id');
                    infoParticipant['type'] = elemUser.get('type');

                    infoParticipantClone.push(
                        new Promise(function (resolveOne, rejectOne) {

                            Users
                                .forge({id: elemUser.get('users_id')})
                                .fetch({withRelated: ['useContacts'], require: true})
                                .then(function (dtModel) {
                                    resolveOne(dtModel);
                                })
                                .catch(function (errUser) {
                                    rejectOne(errUser);
                                });

                        }).then(function (resultUser) {

                            infoParticipant['infoAccountParticipant'] = resultUser;
                            return infoParticipant;
                        })
                    );
                });
            });

            let resultDataParticipant = [];

            Promise.all(infoParticipantClone)
                .then(function (resultValueAllPromise) {
                    resultValueAllPromise.forEach((element, indx)=> {
                        var infoAccountParticipantTemp = [];
                        if (element.type === coreHelper.app.participants[0]) {
                            element.count = 1;
                            resultDataParticipant.push(element);
                        } else {
                            // Group
                            let indexId = resultDataParticipant.findIndex(x => x.idConversation == element.idConversation);
                            if (indexId !== -1) {
                                resultDataParticipant[indexId].count += 1;
                                resultDataParticipant[indexId].infoAccountParticipant.push(element.infoAccountParticipant);
                            } else {
                                let tmp = element.infoAccountParticipant;
                                element.count = 1;
                                element.infoAccountParticipant = [];
                                element.infoAccountParticipant.push(tmp);

                                resultDataParticipant.push(element);
                            }
                        }
                    });

                    responseData['infoParticipant'] = resultDataParticipant;
                    callback(null, responseData);
                });
        }
    });

};

// Users.prototype.findByIdChat = function (id, callback) {
//     Users.where({id: id}).fetch({withRelated: ['useContacts', 'useBlockList', 'useParticipants']}).then(function (data) {
//         callback(null, data);
//     }).catch(function (err) {
//         callback(err);
//     });
// };

User.prototype.findOne = function (dataRequest, callback) {
    Users.where({id: dataRequest.id}).fetch().then(function (data) {
        callback(null, data);
    }).catch(function (err) {
        callback(err);
    });
};

User.prototype.findUser = function (dataRequest, callback) {
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


User.prototype.checkUser = function (dataRequest, callback) {
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


User.prototype.insertUser = function (dataRequest, callback) {
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
                        middle_name: (dataRequest.first_name + ' ' + dataRequest.last_name),
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


module.exports = {model: Users, class: User};


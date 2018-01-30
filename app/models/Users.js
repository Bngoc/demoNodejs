'use strict';

// var mysqlModel = require('mysql-model');
//https://www.npmjs.com/package/mysql-model
// http://knexjs.org/
// http://bookshelfjs.org/
//https://www.npmjs.com/package/knex-model-wrapper

const bcrypt = require('bcrypt');
const path = require('path');
const Promise = require('bluebird');
const _ = require('underscore');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();

const knex = coreHelper.connectKnex();
const bookshelf = coreHelper.bookshelf();

const Conversations = coreHelper.callModule(`${coreHelper.paths.MODELS}Conversation.js`);
const BlockList = coreHelper.callModule(`${coreHelper.paths.MODELS}BlockList.js`);
const Participants = coreHelper.callModule(`${coreHelper.paths.MODELS}Participants.js`);
const Contacts = coreHelper.callModule(`${coreHelper.paths.MODELS}Contacts.js`);

// Note - use require model other, because relationship not working

var Users = bookshelf.Model.extend({
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
        return this.hasOne(coreHelper.callModule(`${coreHelper.paths.MODELS}Contacts.js`).model, 'users_id');
    },

    useBlockList: function () {
        return this.hasMany(coreHelper.callModule(`${coreHelper.paths.MODELS}BlockList.js`).model, 'users_id');
    },
    usePreventParticipants: function () {
        return this.hasMany(coreHelper.callModule(`${coreHelper.paths.MODELS}BlockList.js`).model, 'prevent_participant');
    },
    useConversation: function () {
        return this.hasMany(coreHelper.callModule(`${coreHelper.paths.MODELS}Conversation.js`).model, 'creator_id');
    },
    useParticipants: function () {
        return this.hasMany(coreHelper.callModule(`${coreHelper.paths.MODELS}Participants.js`).model, 'users_id');
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

var User = function () {
};

User.prototype.findById = function (id, callback) {
    Users.where({id: id}).fetch().then(function (data) {
        // Users.where({id: id}).fetch({withRelated: ['contacts']}).then(function (data) {
        callback(null, data);
    }).catch(function (err) {
        callback(err);
    });
};

User.prototype.findUserFullById = function (id, callback) {
    Users.where({id: id}).fetch({withRelated: ['useContacts']}).then(function (data) {
        callback(null, data);
    }).catch(function (err) {
        callback(err);
    });
};

User.prototype.findConversation = function (request, callback) {
    let responseData = {};
    let unsetConversation = request.hasOwnProperty('unsetConversation') ? request.unsetConversation : [];

    Users.where({id: request.userCurrentID}).fetch({withRelated: ['useContacts']}).then(function (data) {
        responseData['infoAccount'] = data;
        let blockList = new BlockList.class();
        blockList.getListBlockConversation(request.userCurrentID, function (errBlockList, blockListConversation) {
            if (errBlockList) callback(errBlockList);
            responseData['blockList'] = blockListConversation;
            // let getBlockList = data.relations.useBlockList
            //     .filter(function (isDelete) {
            //         if (isDelete.get('is_deleted') != 0) {
            //             return isDelete.get('prevent_participant');
            //         }
            //     })
            //     .map(function (listItem) {
            //         return listItem.get('prevent_participant');
            //     });

            Participants.model
                .query(function (qd) {
                    // qd.where('id', 'not in', blockList);
                    qd.where('conversation_id', 'not in', blockListConversation.blockListConversation.concat(unsetConversation));
                    if (request.hasOwnProperty('unsetConversation')) {
                        qd.where("users_id", '!=', data.get('id'));
                    } else {
                        qd.where({"users_id": data.get('id')});
                    }
                    qd.where("type", 'in', request.conversationType);//single vs group
                })
                .fetchAll({columns: ['id', 'conversation_id', 'users_id']})
                // .fetchAll({columns: ['id', 'title', 'creator_id', 'channel_id']})
                .then(function (modelParticipants) {
                    let conversationsList = modelParticipants.map(function (listItem) {
                        return listItem.get('conversation_id');
                    });

                    Conversations.model
                        .query(function (dq) {
                            dq.where('id', 'in', conversationsList).where('is_deleted', '=', '0');
                        })
                        // .fetchAll({withRelated: ['cccccc', {'conParticipant': function(db){ qb.where('status', 'enabled'); }}]})
                        .fetchAll({
                            withRelated: [{
                                'conParticipant': function (qb) {
                                    qb.where('users_id', '!=', request.userCurrentID);
                                    qb.where('users_id', 'not in', blockListConversation.blockListParticipantGroup);
                                }
                            }]
                        })
                        .then((modelConver) => {
                            responseData['modelConversation'] = modelConver;
                            callback(null, responseData);
                        })
                        .catch((errCon) => callback(errCon));
                }).catch((errPart) => callback(errPart));
        });
    }).catch((err) => callback(err));
};

User.prototype.findByIdChat = function (request, callback) {
    let responseData = {};
    let isAuthenticatesSingle = request.isAuthenticatesSingle !== undefined ? request.isAuthenticatesSingle : false;
    let self = this;
    this.findConversation(request, function (err, modelConversation) {
        if (err) callback(err);

        responseData['infoAccount'] = modelConversation.infoAccount;
        let modelConver = modelConversation.modelConversation;
        let infoParticipantClone = [];

        modelConver.forEach(function (elem) {
            elem.relations.conParticipant.forEach(function (elemUser) {
                // check friend search add group conversation
                if (isAuthenticatesSingle === true && elemUser.get('is_accept_single') === 1) {
                    return false;
                }

                let infoParticipant = {};
                infoParticipant['idConversation'] = elem.get('id');
                infoParticipant['title'] = elem.get('title');
                infoParticipant['creator_id'] = elem.get('creator_id');
                infoParticipant['channel_id'] = elem.get('channel_id');
                infoParticipant['type'] = elemUser.get('type');
                infoParticipant['is_accept_single'] = elemUser.get('is_accept_single');
                infoParticipant['is_accept_group'] = elemUser.get('is_accept_group');

                infoParticipantClone.push(
                    new Promise(function (resolveOne, rejectOne) {
                        Users
                            .forge({id: elemUser.get('users_id')})
                            .fetch({withRelated: ['useContacts'], require: true})
                            .then((dtModel) => resolveOne(dtModel))
                            .catch((errUser) => rejectOne(errUser));
                    }).then(function (resultUser) {
                        infoParticipant['infoAccountParticipant'] = resultUser;
                        return infoParticipant;
                    })
                );
            });
        });

        self.promiseAllParticipants(infoParticipantClone, function (ex, result) {
            if (ex) callback(ex);

            responseData['infoParticipant'] = result;
            callback(null, responseData);
        });
    });
};

User.prototype.promiseAllParticipants = function (infoParticipantClone, callback) {
    let resultDataParticipant = [];
    Promise.all(infoParticipantClone).then((resultValueAllPromise) => {
        resultValueAllPromise.forEach((element) => {
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

        callback(null, resultDataParticipant);
    }).catch(ex => callback(ex));
};

User.prototype.searchListParticipants = function (request, callback) {
    let responseData = {};
    let unsetParticipants = request.hasOwnProperty('unsetParticipants') ? request.unsetParticipants : [];
    let self = this;
    Users.where({id: request.userCurrentID}).fetch().then(function (data) {
        let blockList = new BlockList.class();
        blockList.getListBlockConversation(request.userCurrentID, function (errBlockList, rsBlockList) {
            if (errBlockList) callback(errBlockList);

            Users
                .query((qb) => {
                    qb.where('id', 'not in', rsBlockList.blockListParticipants.concat(unsetParticipants));
                })
                .fetchAll({colums: ['id']})
                .then((resultMode) => {

                    let infoParticipants = [];
                    resultMode.forEach(function (items) {
                        let infoParticipant = {};
                        infoParticipant['type'] = request.conversationType[0];
                        infoParticipant['idConversation'] = null;
                        infoParticipant['title'] = '';
                        infoParticipant['creator_id'] = null;
                        infoParticipant['channel_id'] = null;

                        infoParticipants.push(
                            new Promise(function (resolveOne, rejectOne) {
                                Users
                                    .forge({id: items.get('id')})
                                    .fetch({withRelated: ['useContacts'], require: true})
                                    .then((dtModel) => resolveOne(dtModel))
                                    .catch((errUser) => rejectOne(errUser));
                            }).then(function (resultUser) {
                                infoParticipant['infoAccountParticipant'] = resultUser;
                                return infoParticipant;
                            })
                        );
                    });

                    self.promiseAllParticipants(infoParticipants, function (exPromise, result) {
                        if (exPromise) callback(exPromise);

                        responseData['infoParticipant'] = result;
                        callback(null, responseData);
                    });
                })
                .catch((ex) => callback(ex));
        });
    }).catch((exUser) => callback(exUser));
};

// Users.prototype.findByIdChat = function (id, callback) {
//     Users.where({id: id}).fetch({withRelated: ['useContacts', 'useBlockList', 'useParticipants']}).then(function (data) {
//         callback(null, data);
//     }).catch(function (err) {
//         callback(err);
//     });
// };

User.prototype.checkExitsListUsers = function (request, callback) {
    let blockList = new BlockList.class();
    blockList.getListBlockConversation(request.userCurrentID, function (errBlockList, blockList) {
        if (errBlockList) callback(errBlockList);
        Users
            .query((dq) => dq.where('id', 'in', request.listUserID))
            .fetchAll({columns: ["id"]})
            .then((modeData) => {
                callback(null, {blockListParticipants: blockList.blockListParticipants, listParticipant: modeData})
            })
            .catch(ex => callback(ex))
    });
};

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
            qb.where('phone', '=', dataRequest.loginId)
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
                        cfg_chat: dataRequest.cfg_chat,
                        // country: 'vn'
                    }
                ], function (info) {
                    // Some validation could take place here.
                    return new Contacts.model(info).save({'users_id': useModelData.id}, {transacting: t});
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


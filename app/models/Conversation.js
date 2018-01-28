'use strict';

const path = require('path');
const Promise = require('bluebird');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();

const knex = coreHelper.connectKnex();
const bookshelf = coreHelper.bookshelf();


const Participants = coreHelper.callModule(`${coreHelper.paths.MODELS}Participants.js`);
// const DeletedConversations = coreHelper.callModule(`${coreHelper.paths.MODELS}DeletedConversations.js`);
const BlockList = coreHelper.callModule(`${coreHelper.paths.MODELS}BlockList.js`);

var Conversations = bookshelf.Model.extend({
    tableName: 'conversation',
    hasTimestamps: true,
    conUser: function () {
        return this.belongsTo(coreHelper.callModule(`${coreHelper.paths.MODELS}Users.js`).model, 'id');
    },
    // conDeletedConversation: function () {
    //     return this.hasMany(coreHelper.callModule(`${coreHelper.paths.MODELS}DeletedConversations.js`).model, 'conversation_id');
    // },
    conParticipant: function () {
        return this.hasMany(coreHelper.callModule(`${coreHelper.paths.MODELS}Participants.js`).model, 'conversation_id', 'id'); //table , keyFK keylocal
    }
});

let Conversation = function () {
};

Conversation.prototype.getConversations = function (id, users_id, callback) {
    let blockList = new BlockList.class();
    blockList.getListBlockConversation(users_id, function (errBlockList, blockList) {
        if (errBlockList) callback(errBlockList);

        Conversations
            .where({id: id})
            .fetchAll({
                withRelated: [{
                    'conParticipant': function (qb) {
                        qb.where('users_id', '!=', users_id)
                            .where('users_id', 'not in', blockList.blockListParticipantGroup);
                    }
                }]
            })
            .then(function (modelConver) {
                callback(null, modelConver)
            })
            .catch(function (err) {
                callback(err);
            });
    });
};

Conversation.prototype.conversationsListUser = function (optionRequest, callback) {
    this.getConversations(optionRequest.id, optionRequest.userCurrentID, function (err, modelConversation) {
        if (err) callback(err);

        let infoParticipantPromise = [];

        modelConversation.forEach(function (elem) {
            elem.relations.conParticipant.forEach(function (elemUser) {
                let infoParticipant = {};
                infoParticipant['idConversation'] = elem.get('id');
                infoParticipant['title'] = elem.get('title');
                infoParticipant['creator_id'] = elem.get('creator_id');
                infoParticipant['channel_id'] = elem.get('channel_id');
                infoParticipant['type'] = elemUser.get('type');
                infoParticipant['is_accept_single'] = elemUser.get('is_accept_single');
                infoParticipant['is_accept_group'] = elemUser.get('is_accept_group');

                infoParticipantPromise.push(
                    new Promise(function (resolveOne, rejectOne) {

                        optionRequest.userModel
                            .query(function (dq) {
                                dq.where('id', elemUser.get('users_id'));
                            })
                            .fetch({withRelated: ['useContacts'], require: true})
                            .then(function (dtModel) {
                                resolveOne(dtModel);
                            })
                            .catch(function (errUser) {
                                rejectOne(errUser);
                            });

                    }).then(function (resultUser) {

                        infoParticipant['infoParticipant'] = resultUser;
                        return infoParticipant;
                    })
                );
            });
        });

        let resultConversationParticipant = [];

        Promise.all(infoParticipantPromise)
            .then(function (resultValueAllPromise) {
                resultValueAllPromise.forEach((element) => {
                    if (element.type === optionRequest.statusSingle) {
                        element.count = 1;
                        resultConversationParticipant.push(element);
                    } else {
                        // Group
                        let indexId = resultConversationParticipant.findIndex(x => x.idConversation == element.idConversation);
                        if (indexId !== -1) {
                            resultConversationParticipant[indexId].count += 1;
                            resultConversationParticipant[indexId].infoParticipant.push(element.infoParticipant);
                        } else {
                            let tmp = element.infoParticipant;
                            element.count = 1;
                            element.infoParticipant = [];
                            element.infoParticipant.push(tmp);

                            resultConversationParticipant.push(element);
                        }
                    }
                });

                callback(null, resultConversationParticipant);
            });
    })
};

Conversation.prototype.participantByUserId = function (req, callback) {
    Participants.model
        .where({users_id: req.userCurrentID})
        .fetchAll()
        .then(function (modelPart) {
            callback(null, modelPart)
        })
        .catch(function (err) {
            callback(err);
        });
}

Conversation.prototype.conversationsListSingleUser = function (req, callback) {
    this.participantByUserId(req, function (err, modelPartici) {
        if (err) callback(err);

        let conversationList = modelPartici.map(function (listItem) {
            return listItem.get('conversation_id');
        });

        Participants.model
            .query(function (q) {
                q.where('type', req.statusSingle).where('users_id', '!=', req.userCurrentID)
                    .where('conversation_id', 'IN', conversationList)
            })
            .fetchAll({
                withRelated: ['parConversation'],
                columns: ['id', 'users_id', 'conversation_id', 'is_accept_single', 'is_accept_group']
            })
            .then(function (reModel) {
                callback(null, reModel)
            })
            .catch(function (err) {
                callback(err)
            });
    });
};

Conversation.prototype.insertConversation = function (reqInsert, callback) {
    let dtConversation = {
        title: reqInsert.title,
        creator_id: reqInsert.creator_id,
        channel_id: reqInsert.channel_id
    };

    bookshelf.transaction(function (t) {
        return new Conversations(dtConversation)
            .save(null, {transacting: t})
            .tap(function (modelDataConversation) {
                return Promise.map(reqInsert.listParticipant, function (info) {
                    // Some validation could take place here.
                    return new Participants.model(info).save({'conversation_id': modelDataConversation.id}, {transacting: t});
                });
            });
    }).then(function (modelConversation) {
        callback(null, modelConversation);
    }).catch(function (err) {
        callback(err);
    });
};


module.exports = {model: Conversations, class: Conversation};
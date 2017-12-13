'use strict';

const path = require('path');
const Promise = require('bluebird');

const CoreHelper = require(path.join(__dirname, '/../../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();

const knex = coreHelper.connectKnex();
const bookshelf = coreHelper.bookshelf();


const Users = coreHelper.callModule(`${coreHelper.paths.MODELS}User.js`);
// const Participants = coreHelper.callModule(`${coreHelper.paths.MODELS}chat/Participants.js`);
// const DeletedConversations = coreHelper.callModule(`${coreHelper.paths.MODELS}chat/DeletedConversations.js`);

var Conversations = bookshelf.Model.extend({
    tableName: 'conversation',
    hasTimestamps: true,
    conUser: function () {
        return this.belongsTo(coreHelper.callModule(`${coreHelper.paths.MODELS}User.js`).model, 'id');
    },
    conDeletedConversation: function () {
        return this.hasMany(coreHelper.callModule(`${coreHelper.paths.MODELS}chat/DeletedConversations.js`).model, 'conversation_id');
    },
    conParticipant: function () {
        return this.hasMany(coreHelper.callModule(`${coreHelper.paths.MODELS}chat/Participants.js`).model, 'conversation_id', 'id'); //table , keyFK keylocal
    }
});

let Conversation = function () {
};

Conversation.prototype.getConversations = function (id, users_id, callback) {
    Conversations
        .where({id: id})
        .fetchAll({
            withRelated: [
                {
                    'conParticipant': function (qb) {
                        qb.where('users_id', '!=', users_id)
                    }
                }
            ]
        })
        .then(function (modelConver) {
            callback(null, modelConver)
        })
        .catch(function (err) {
            callback(err);
        });
}

Conversation.prototype.ConversationsListUser = function (id, users_id, callback) {
    let responseData = {};
    this.getConversations(id, users_id, function (err, modelConversation) {
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

                infoParticipantPromise.push(
                    new Promise(function (resolveOne, rejectOne) {

                        Users.model
                            .forge({id: elemUser.get('users_id')})
                            // .query(function (dq) {
                            // .where('id', elemUser.get('users_id'))
                            // })
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
                resultValueAllPromise.forEach((element, indx) => {
                    if (element.type === coreHelper.app.participants[0]) {
                        element.count = 1;
                        resultConversationParticipant.push(element);
                    } else {
                        // Group
                        let indexId = resultConversationParticipant.findIndex(x => x.idConversation == element.idConversation);
                        if (indexId !== -1) {
                            resultConversationParticipant[indexId].count += 1;
                            resultConversationParticipant[indexId].infoAccountParticipant.push(element.infoAccountParticipant);
                        } else {
                            let tmp = element.infoAccountParticipant;
                            element.count = 1;
                            element.infoAccountParticipant = [];
                            element.infoAccountParticipant.push(tmp);

                            resultConversationParticipant.push(element);
                        }
                    }
                });

                responseData['infoParticipant'] = resultConversationParticipant;
                callback(null, responseData);
            });
    })
};


module.exports = {model: Conversations, class: Conversation};
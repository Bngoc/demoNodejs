'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();

const knex = coreHelper.connectKnex();
const bookshelf = coreHelper.bookshelf();


const Users = coreHelper.callModule(`${coreHelper.paths.MODELS}Users.js`);
const Conversation = coreHelper.callModule(`${coreHelper.paths.MODELS}Conversation.js`);

var Participants = bookshelf.Model.extend({
    tableName: 'participants',
    hasTimestamps: true,
    parUser: function () {
        return this.belongsTo(coreHelper.callModule(`${coreHelper.paths.MODELS}Users.js`).model, 'id');
    },
    parConversation: function () {
        return this.hasOne(coreHelper.callModule(`${coreHelper.paths.MODELS}Conversation.js`).model, 'id', 'conversation_id');
    }
});

let Participant = function () {
}

// Participant.prototype.getConversation = function (dataRes, callback) {
//     Participants
//         .where('id', 'not in', dataRes.blockList)
//         .where({
//             "users_id": dataRes.users_id
//         })
//         // .fetchAll()
//         .fetchAll({withRelated: ['parConversation']})
//         // .fetchAll({withRelated: ['conversations'], columns: ['id', 'title', 'creator_id', 'channel_id']})
//         .then(function (modelParticipant) {
//             callback(null, modelParticipant)
//         })
//         .catch(function (err) {
//             callback(err);
//         });
// }

Participant.prototype.updateParticipant = function (reqUpdate, callback) {
    bookshelf
        .transaction(function (t) {
            Conversations
                .query((qb) => {
                    qb.where({'id': reqUpdate.conversationID})
                })
                .fetch({require: true})
                .then((dataModel) => {
                    reqUpdate.clauseUpdate = {
                        'is_accept_single': 122 || dataModel.get('is_accept_single'),
                        'is_accept_group': 122 || dataModel.get('is_accept_group')
                    };
                    dataModel
                        .save(reqUpdate.clauseUpdate, {transacting: t})
                        .then((resultModel) => callback(null, resultModel))
                        .catch((exUpdate) => callback(exUpdate));
                }).catch((ex) => callback(ex));
        })
        .then((modelConversation) => callback(null, modelConversation))
        .catch((err) => callback(err));
};


// Conversation.prototype.deleteParticipant = function (reqDelete, callback) {
//     bookshelf
//         .transaction(function (t) {
//             Conversations
//                 .query((qb) => {
//                     qb.where({'id': reqDelete.ParticipantID})
//                 })
//                 .fetch({require: true})
//                 .then((dataModel) => {
//                     dataModel
//                         .destroy({transacting: t})
//                         .then((resultModel) => callback(null, resultModel))
//                         .catch((exDelete) => callback(exDelete));
//                 }).catch((exGet) => callback(exGet));
//         })
//         .then((modelConversation) => callback(null, modelConversation))
//         .catch((err) => callback(err));
// };
//
// Participant.prototype.deleteParticipantConversation = function (reqDelete, callback) {
//     bookshelf
//         .transaction(function (t) {
//             Conversations
//                 .query((qb) => {
//                     qb.where({'conversation_id': reqDelete.conversationID})
//                 })
//                 .fetch({require: true})
//                 .then((dataModel) => {
//                     dataModel
//                         .destroy({transacting: t})
//                         .then((resultModel) => callback(null, resultModel))
//                         .catch((exDelete) => callback(exDelete));
//                 }).catch((exGet) => callback(exGet));
//         })
//         .then((modelConversation) => callback(null, modelConversation))
//         .catch((err) => callback(err));
// };

module.exports = {model: Participants, class: Participant};
'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();

const knex = coreHelper.connectKnex();
const bookshelf = coreHelper.bookshelf();


const Users = coreHelper.callModule(`${coreHelper.paths.MODELS}User.js`);
const Conversation = coreHelper.callModule(`${coreHelper.paths.MODELS}chat/Conversation.js`);

var Participants = bookshelf.Model.extend({
    tableName: 'participants',
    hasTimestamps: true,
    parUser: function () {
        return this.belongsTo(coreHelper.callModule(`${coreHelper.paths.MODELS}User.js`).model, 'id');
    },
    parConversation: function () {
        return this.hasOne(coreHelper.callModule(`${coreHelper.paths.MODELS}chat/Conversation.js`).model, 'id', 'conversation_id');
    }
});


// let Conversation = bookshelf.Model.extend({
//     tableName: 'conversation',
//     hasTimestamps: true,
//     users: function () {
//         return this.belongsTo(Users, 'id');
//     },
//     // deletedConversations: function () {
//     //     return this.hasMany(DeletedConversations, 'conversation_id');
//     // },
//     participants: function () {
//         return this.belongsTo(Participants, 'conversation_id', 'id');
//     }
// });

let Participant = function () {

}

Participant.prototype.getConversation = function (dataRes, callback) {
    Participants
        .where('id', 'not in', dataRes.blockList)
        .where({
            "users_id": dataRes.users_id
        })
        // .fetchAll()
        .fetchAll({withRelated: ['parConversation']})
        // .fetchAll({withRelated: ['conversations'], columns: ['id', 'title', 'creator_id', 'channel_id']})
        .then(function (modelParticipant) {
            callback(null, modelParticipant)
        })
        .catch(function (err) {
            callback(err);
        });
}

module.exports = {model: Participants, class: Participant};
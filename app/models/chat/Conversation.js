'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();

const knex = coreHelper.connectKnex();
const bookshelf = coreHelper.bookshelf();


// const Users = coreHelper.callModule(`${coreHelper.paths.MODELS}User.js`);
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

Conversation.prototype.getConversation = function (id, callback) {
    // Conversations
    //     .forge({'whereIn': {'id': [2,3,4]}})
    //     .fetchAll({withRelated: ['conParticipant']})
    //     .then(function (modelConver) {
    //         callback(null, modelConver)
    //     })
    //     .catch(function (err) {
    //         callback(err);
    //     });
}


module.exports = {model: Conversations, class: Conversation};
'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();

const knex = coreHelper.connectKnex();
const bookshelf =  coreHelper.bookshelf();

const User = coreHelper.callModule(`${coreHelper.paths.MODELS}User.js`);
const Participants = coreHelper.callModule(`${coreHelper.paths.MODELS}chat/Participants.js`);
const DeletedConversations = coreHelper.callModule(`${coreHelper.paths.MODELS}chat/DeletedConversations.js`);

let Conversation = bookshelf.Model.extend({
    tableName: 'conversation',
    hasTimestamps: true,
    conUser: function () {
        return this.belongsTo(User, 'id');
    },
    conDeletedConversation: function () {
        return this.hasMany(DeletedConversations, 'conversation_id');
    },
    conParticipant: function () {
        return this.belongsTo(Participants, 'conversation_id', 'id'); //table , keyFK keylocal
    }
});

// Conversation.prototype.

module.exports = Conversation;
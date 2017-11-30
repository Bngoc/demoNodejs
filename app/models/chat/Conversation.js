'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const User = coreHelper.callModule(`${coreHelper.paths.MODELS}User.js`);
const bookshelf = require('bookshelf')(coreHelper.connectKnex());

let Conversation = bookshelf.Model.extend({
    tableName: 'conversation',
    users: function () {
        return this.belongsTo(User, 'id');
    },
    deletedConversations: function () {
        return this.hasMany(DeletedConversations, 'conversation_id');
    }
});

let DeletedConversations = bookshelf.Model.extend({
    tableName: 'deleted_conversations',
    conversation: function () {
        return this.belongsTo(Conversation, 'id');
    }
});

module.exports = Conversation;
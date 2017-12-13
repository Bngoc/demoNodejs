'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const bookshelf = require('bookshelf')(coreHelper.connectKnex());


let DeletedConversations = bookshelf.Model.extend({
    tableName: 'deleted_conversations',
    hasTimestamps: true,
    conversation: function () {
        return this.belongsTo(coreHelper.callModule(`${coreHelper.paths.MODELS}Conversation.js`).model, 'id');
    }
});


module.exports = {model:DeletedConversations };
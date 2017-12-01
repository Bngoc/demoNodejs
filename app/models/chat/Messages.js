'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const bookshelf = require('bookshelf')(coreHelper.connectKnex());

const DeletedMessages = coreHelper.callModule(`${coreHelper.paths.MODELS}chat/DeletedMessages.js`);

let Messages = bookshelf.Model.extend({
    tableName: 'messages',
    hasTimestamps: true,
    deletedMessages: function () {
        return this.hasMany(DeletedMessages, 'messages_id');
    }
});

module.exports = Messages;
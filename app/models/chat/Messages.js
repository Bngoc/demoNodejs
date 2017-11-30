'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const bookshelf = require('bookshelf')(coreHelper.connectKnex());

let Messages = bookshelf.Model.extend({
    tableName: 'messages',
    deletedMessages: function () {
        return this.hasMany(DeletedMessages, 'messages_id');
    }
});

let DeletedMessages = bookshelf.Model.extend({
    tableName: 'deleted_messages',
    message: function () {
        return this.belongsTo(Messages, 'id');
    }
});


module.exports = Messages;
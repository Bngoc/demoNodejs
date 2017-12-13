'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const bookshelf = require('bookshelf')(coreHelper.connectKnex());


let Messages = bookshelf.Model.extend({
    tableName: 'messages',
    hasTimestamps: true,
    deletedMessages: function () {
        return this.hasMany(coreHelper.callModule(`${coreHelper.paths.MODELS}DeletedMessages.js`).model, 'messages_id');
    }
});

module.exports = {model: Messages};
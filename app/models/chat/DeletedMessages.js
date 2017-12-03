'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const bookshelf = require('bookshelf')(coreHelper.connectKnex());


let DeletedMessages = bookshelf.Model.extend({
    tableName: 'deleted_messages',
    hasTimestamps: true,
    message: function () {
        return this.belongsTo(coreHelper.callModule(`${coreHelper.paths.MODELS}chat/Messages.js`).model, 'id');
    }
});


module.exports = {model: DeletedMessages};
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
};

module.exports = {model: Participants, class: Participant};
'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();

const knex = coreHelper.connectKnex();
const bookshelf =  coreHelper.bookshelf();

const Users = coreHelper.callModule(`${coreHelper.paths.MODELS}User.js`);
const Conversation = coreHelper.callModule(`${coreHelper.paths.MODELS}chat/Conversation.js`);

let Participants = bookshelf.Model.extend({
    tableName: 'participants',
    hasTimestamps: true,
    parUser: function () {
        return this.belongsTo(Users, 'id');
    },
    parConversation: function () {
        return this.hasMany(Conversation, 'id', 'conversation_id');
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


Participants.prototype.getParticipant = function () {
  // return Participants
  //
};


module.exports = Participants;
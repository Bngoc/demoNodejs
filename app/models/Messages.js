'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const bookshelf = coreHelper.bookshelf();
const knex = coreHelper.connectKnex();

let Messages = bookshelf.Model.extend({
    tableName: 'messages',
    hasTimestamps: true,
    deletedMessages: function () {
        return this.hasOne(coreHelper.callModule(`${coreHelper.paths.MODELS}DeletedMessages.js`).model, 'messages_id');
    }
});


var Message = function () {
};

Message.prototype.getMessageConversation = function (req, callback) {
    Messages
        .query(function (q) {
            q.where('conversation_id', req.id)
                .orderBy('created_at', 'ASC')
                .limit(req.limit);
        })
        // .where({id: id})
        // .fetchAll({withRelated: ['deletedMessages']})
        .fetchAll({
            withRelated: [
                {
                    'deletedMessages': function (qb) {
                        qb.where('is_deleted', 1).where('users_id', req.userCurrentID);
                    }
                }
            ]
        })
        .then(function (data) {
            callback(null, data);
        }).catch(function (err) {
        callback(err);
    });
};


module.exports = {model: Messages, class: Message};
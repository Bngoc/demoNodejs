'use strict';

const path = require('path');
const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const bookshelf = coreHelper.bookshelf();
const knex = coreHelper.connectKnex();

let Messages = bookshelf.Model.extend({
    tableName: 'messages',
    hasTimestamps: true,
    // deletedMessages: function () {
    //     return this.hasOne(coreHelper.callModule(`${coreHelper.paths.MODELS}DeletedMessages.js`).model, 'messages_id');
    // }
    contactMessage: function () {
        return this.hasOne(coreHelper.callModule(`${coreHelper.paths.MODELS}Contacts.js`).model, 'users_id', 'sender_id');
    }
});


var Message = function () {
};

Message.prototype.getMessageConversation = function (req, callback) {
    Messages
        .query(function (qb) {
            qb.where('conversation_id', req.id)
                .andWhere(function () {
                    this.orWhere('is_deleted', '!=', 1)
                        .orWhere(function () {
                            this.where('sender_id', '!=', req.userCurrentID)
                                .where('is_deleted', '=', 1)
                        })
                })
                .orderBy('created_at', req.sort)
                .orderBy('id', 'ASC')
                .limit(req.limit)
                .offset(req.offset);
        })
        // .fetchAll()
        .fetchAll({withRelated: ['contactMessage']})
        // .fetchAll({
        //     withRelated: [
        //         {
        //             'contactMessage': function (qb) {
        //                 qb.where('is_deleted', 1).where('users_id', req.userCurrentID);
        //             }
        //         }
        //     ]
        // })
        .then(function (data) {
            callback(null, data);
        }).catch(function (err) {
        callback(err);
    });
};

Message.prototype.insert = function (dataInsert, callback) {
    bookshelf.transaction(function (transaction) {
        return new Messages(dataInsert)
            .save(null, {transacting: transaction})
            .then(function (modelMessage) {
                Messages
                    .forge({id: modelMessage.id})
                    .fetch({withRelated: ['contactMessage']})
                    .then(function (selectMessage) {
                        callback(null, selectMessage);
                    })
                    .catch((errMsg)=> {
                        callback(errMsg)
                    });
            })
            .catch(function (err) {
                callback(err)
            })
    });
}

Message.prototype.cronDeleteMessage = function (callback) {
    Messages
        .query((q) => {
            q.where('created_at', '<=', "2018-11-01");
            q.orderBy('created_at', 'DESC');
        })
        .fetchAll()
        .then(function (model) {
            callback(null, model);
        })
        .catch(function (err) {
            callback(err);
        });
};

module.exports = {model: Messages, class: Message};
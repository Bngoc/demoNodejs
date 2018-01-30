'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();

const bookshelf = require('bookshelf')(coreHelper.connectKnex());

let BlockLists = bookshelf.Model.extend({
    tableName: 'block_list',
    users: function () {
        return this.belongsTo(coreHelper.callModule(`${coreHelper.paths.MODELS}Users.js`).model, 'id');
    }
});

let BlockList = function () {
};

// don't use
// BlockList.prototype.getListBlockParticipant = function (id, callback) {
//     BlockLists
//         .query(function (qb) {
//             qb.where(function (q) {
//                 q.orWhere('users_id', id)
//                     .orWhere('prevent_participant', id);
//             });
//             qb.where('is_deleted', '!=', 0);
//         })
//         .fetchAll()
//         .then(function (modelBlockList) {
//             let resultBlockList = {};
//             let blockListConversation = [];
//             let blocklistParticipantGroup = [];
//             modelBlockList.forEach(function (elementItem) {
//                 if (id === elementItem.get('users_id') && elementItem.get('is_single_group') === 1) {
//                     blocklistParticipantGroup.push(elementItem.get('prevent_participant'));
//                 } else {
//                     blockListConversation.push(elementItem.get('conversation_id'));
//                 }
//             });
//
//             resultBlockList.blockListConversation = blockListConversation;
//             resultBlockList.blockListParticipantGroup = blocklistParticipantGroup;
//
//             let blockList = modelBlockList.map(function (itemList) {
//                 // if (itemList.get('users_id') == id && itemList.get('prevent_participant')) {
//                 //     return itemList.get('conversation_id');
//                 // } else if (itemList.get('prevent_participant') == id && itemList.get('users_id')){
//                 return itemList.get('conversation_id');
//                 // }
//             });
//
//             // let getBlockList = data.relations.useBlockList
//             //     .filter(function (isDelete) {
//             //         if (isDelete.get('is_deleted') != 0) {
//             //             return isDelete.get('prevent_participant');
//             //         }
//             //     })
//             //     .map(function (listItem) {
//             //         return listItem.get('prevent_participant');
//             //     });
//             callback(null, resultBlockList);
//         })
//         .catch(function (errModel) {
//             callback(errModel);
//         })
// };

BlockList.prototype.getListBlockConversation = function (user_id, callback) {
    BlockLists
        .query(function (qb) {
            qb.where('is_deleted', '!=', 0);
        })
        .fetchAll()
        .then(function (modelBlockList) {
            let resultBlockList = {};
            let blockListParticipants = [];
            let blockListConversation = [];
            let blockListParticipantGroup = [];
            modelBlockList.forEach(function (elementItem) {
                if (elementItem.get('is_single_group') === 0) {
                    if (user_id != elementItem.get('prevent_participant')) blockListParticipants.push(elementItem.get('prevent_participant'));
                    if (user_id != elementItem.get('users_id')) blockListParticipants.push(elementItem.get('users_id'));
                }
                if (elementItem.get('is_single_group') === 0 || elementItem.get('is_single_group') === 1 && elementItem.get('prevent_participant') === user_id) {
                    // is single - author - block conversation
                    blockListConversation.push(elementItem.get('conversation_id'));
                } else {
                    // mb in group
                    blockListParticipantGroup.push(elementItem.get('prevent_participant'));
                }
            });

            resultBlockList.blockListConversation = blockListConversation;
            resultBlockList.blockListParticipantGroup = blockListParticipantGroup;
            resultBlockList.blockListParticipants = blockListParticipants;

            callback(null, resultBlockList);
        })
        .catch(function (errModel) {
            callback(errModel);
        })
};

module.exports = {model: BlockLists, class: BlockList};
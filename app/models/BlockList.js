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

BlockList.prototype.getListBlockParticipant = function (id, callback) {
    BlockLists
        .query(function (qb) {
            qb.where(function (q) {
                q.orWhere('users_id', id)
                    .orWhere('prevent_participant', id);
            });
            qb.where('is_deleted', '!=', 0);
        })
        .fetchAll()
        .then(function (modelBlockList) {
            let blockList = modelBlockList.map(function (itemList) {
                // if (itemList.get('users_id') == id && itemList.get('prevent_participant')) {
                //     return itemList.get('conversation_id');
                // } else if (itemList.get('prevent_participant') == id && itemList.get('users_id')){
                return itemList.get('conversation_id');
                // }
            });

            // let getBlockList = data.relations.useBlockList
            //     .filter(function (isDelete) {
            //         if (isDelete.get('is_deleted') != 0) {
            //             return isDelete.get('prevent_participant');
            //         }
            //     })
            //     .map(function (listItem) {
            //         return listItem.get('prevent_participant');
            //     });
            callback(null, blockList);
        })
        .catch(function (errModel) {
            callback(errModel);
        })
};

module.exports = {model: BlockLists, class: BlockList};
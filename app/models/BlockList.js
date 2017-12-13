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

}

module.exports = {model: BlockLists, class: BlockList};
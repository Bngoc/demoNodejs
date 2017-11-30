'use strict';

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const User = coreHelper.callModule(`${coreHelper.paths.MODELS}User.js`);
const bookshelf = require('bookshelf')(coreHelper.connectKnex());

let BlockList = bookshelf.Model.extend({
    tableName: 'block_list',
    users: function () {
        return this.belongsTo(User, 'id');
    }
});

module.exports = BlockList;
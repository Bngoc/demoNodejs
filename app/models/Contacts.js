'use strict';

var resultSql = {
    error: '',
    msg: '',
    result: null
};

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();
const bookshelf = require('bookshelf')(coreHelper.connectKnex());

// let Users = bookshelf.Model.extend({
//     tableName: 'users',
//
//     contacts: function() {
//         return this.hasOne(Contacts);
//     }
//
//     // books: function() {
//     //     return this.hasMany(Book);
//     // }
//
// });

var Contact = bookshelf.Model.extend({
    tableName: 'contacts',
    users: function() {
        return this.belongsTo(Users);
    }
});


let Contacts = function (params) {
    this.id = params.id;
    this.users_id = params.users_id;
    this.first_name = params.first_name;
    this.middle_name = params.middle_name;
    this.last_name = params.last_name;
    this.user_name = params.user_name;
    this.country = params.country;
    this.gender = params.gender;
    this.mood_message = params.mood_message;
    this.status = params.status;
};

Contacts.prototype.inserts = function (dataRequest, callback) {
    new Contact(dataRequest).save().then(function(model) {
        resultSql.result = model;
        callback(resultSql);
    }).catch(function (err) {
        resultSql.error = err;
        callback(resultSql);
    });
};

Contacts.prototype.insert = function (connect, dataRequest, callback) {
    var myQuery = '';
    connect.query(myQuery, function (err, rows, filed) {
        if (err) {
            resultSql.msg = 'query error ... !';
            resultSql.error = myQuery;
        } else {
            //postgres sql result rows.row || mysql result rows
            resultSql.result = rows.rows ? (count(rows.rows) > 0) : (rows > 0);
        }
        callback(resultSql)
    });
};

Contacts.prototype.show = function (connect, dataRequest, callback) {

};

Contacts.prototype.update = function (connect, dataRequest, callback) {

};

Contacts.prototype.delete = function (connect, dataRequest, callback) {

};

module.exports = Contacts;
'use strict';

var resultSql = {
    error: '',
    msg: '',
    result: null
};

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
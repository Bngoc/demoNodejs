'use strict';

var result = {
    code: null,
    error: '',
    msg: '',
    result: null
};

const path = require('path');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const coreHelper = new CoreHelper();

const bookshelf = require('bookshelf')(coreHelper.connectKnex());

let Contacts = bookshelf.Model.extend({
    tableName: 'contacts',
    outputVirtuals: true,
    hasTimestamps: true,
    virtuals: {
        middle_name: function () {
            return this.get('first_name') + ' ' + this.get('last_name');
        }
    },
    contactUser: function () {
        return this.belongsTo(coreHelper.callModule(`${coreHelper.paths.MODELS}Users.js`).model, 'id');
    }
});


let Contact = function () {
    // this.id = params.id;
    // this.users_id = params.users_id;
    // this.first_name = params.first_name;
    // this.middle_name = params.middle_name;
    // this.last_name = params.last_name;
    // this.user_name = params.user_name;
    // this.country = params.country;
    // this.gender = params.gender;
    // this.mood_message = params.mood_message;
    // this.status = params.status;
};

Contact.prototype.updateContact = function (dataRequest, callback) {
    Contacts
        .forge(dataRequest.clause)
        .fetch({require: true})
        .then(function (modelContact) {
            modelContact
                .save(
                    {
                        status: (typeof dataRequest.dataUpdate.status !== 'undefined' ? dataRequest.dataUpdate.status : modelContact.get('status')),
                        is_life: (typeof dataRequest.dataUpdate.is_life !== 'undefined' ? dataRequest.dataUpdate.is_life : modelContact.get('is_life')),
                        country: (typeof dataRequest.dataUpdate.country !== 'undefined' ? dataRequest.dataUpdate.country : modelContact.get('country')),
                        gender: (typeof dataRequest.dataUpdate.gender !== 'undefined' ? dataRequest.dataUpdate.gender : modelContact.get('gender')),
                        mood_message: (typeof dataRequest.dataUpdate.mood_message !== 'undefined' ? dataRequest.dataUpdate.mood_message : modelContact.get('mood_message')),
                        user_name: (typeof dataRequest.dataUpdate.user_name !== 'undefined' ? dataRequest.dataUpdate.user_name : modelContact.get('user_name')),
                    })
                .then(function (model) {
                    callback(null, model);
                })
                .catch(function (errUpdate) {
                    callback(errUpdate);
                });
        })
        .catch(function (err) {
            callback(err);
        });
};

Contact.prototype.inserts = function (dataRequest, callback) {
    new Contacts(dataRequest).save().then(function (model) {
        result.result = model;
        callback(result);
    }).catch(function (err) {
        result.error = err;
        callback(result);
    });
};

Contact.prototype.insert = function (connect, dataRequest, callback) {
    var myQuery = '';
    connect.query(myQuery, function (err, rows, filed) {
        if (err) {
            result.msg = 'query error ... !';
            result.error = myQuery;
        } else {
            //postgres sql result rows.row || mysql result rows
            result.result = rows.rows ? (count(rows.rows) > 0) : (rows > 0);
        }
        callback(result)
    });
};

Contact.prototype.show = function (connect, dataRequest, callback) {

};

Contact.prototype.update = function (connect, dataRequest, callback) {

};

Contact.prototype.delete = function (connect, dataRequest, callback) {

};

// module.exports = {Contacts: Contacts, Contact:Contact };
// module.exports = Contacts;
module.exports = {model: Contacts, class: Contact};
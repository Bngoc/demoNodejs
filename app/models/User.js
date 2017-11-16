'use strict';

let User = function (params) {
    this.id = params.id;
    this.email = params.email;
    this.password = params.password;
    this.lastName = params.lastName;
    this.firstName = params.firstName;
    this.fullName = params.fullName;
    // ...etc
};

User.prototype.register = function (req, res, callback) {
    const connection = req.showResponse.connect;

    let resultData = [];

    var dataRequsest = {
        id: req.id ? req.id : 6
    };

    connection.connect(function (error) {
        if (!!error) {

            req.showResponse.title = 'Errors 404';
            req.showResponse.renderViews = 'errors/404.ejs';

            console.log('Fail connect ......!');
            callback(error, req.showResponse);
        } else {
            connection.query('SELECT * from product_counts where id = ?',
                dataRequsest.id, function (err, rows, filed) {
                    if (err) {

                        req.showResponse.title = 'query error ... !';
                        req.showResponse.name = 'SELECT * from product_counts where id = ?';

                        callback(err, req.showResponse);
                    } else {
                        callback(null, rows);
                    }
                });
        }
    });
};

User.prototype.show = function (req, res, callback) {

};

module.exports = User;

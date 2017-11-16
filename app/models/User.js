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
    const connection = req.showResponse.coreHelper.getConnect();

    let resultData = [];

    var dataRequsest = {
        id: req.id ? req.id : 6
    };

    connection.connect(function (error) {
        if (!!error) {

            req.showResponse.title = 'Errors 404';
            req.showResponse.renderViews = 'errors/404.ejs';

            console.log('Fail connect ......!', error, req.showResponse.coreHelper.getConfigInfoDb());
            callback(error, req.showResponse);
        } else {
            // use SQL DB raw, because support connect Mysql and Postgres Sql
            var myQuery = 'SELECT * from product_counts where id = ' + [dataRequsest.id];

            connection.query(myQuery, function (err, rows, filed) {
                if (err) {
                    req.showResponse.title = 'query error ... !';
                    req.showResponse.name = myQuery;
                    callback(err, req.showResponse);
                } else {
                    //postgres sql result rows.row
                    //mysql result rows
                    callback(null, rows.rows ? rows.rows : rows);
                }
            });
        }
    });
};


User.prototype.show = function (req, res, callback) {

};

module.exports = User;

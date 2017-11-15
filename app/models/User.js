'use strict'
// var connection = require("./../../lib/connection.js");


var User = function (params) {
    this.email = params.email;
    this.password = params.password;
    this.lastName = params.lastName;
    this.firstName = params.firstName;
    // ...etc
};

User.prototype.register = function (connection, req, res) {

    // connection.getConnection(function (error, connection) {
    // connection.doWhatever();

    // if (!!error) {
    //     tempCount.release();
    // } else  {
    //
    // }

    // });
    var resultData = [];

    var dataRequsest = {
        id: 4
    };

    // fetchID(data, callback) {
        connection.query('SELECT * from product_counts where id = ?',
            dataRequsest.id, function (err, rows, filed) {
                connection.end();

                if (err) {
                    // callback(err, null);

                    return resultData;
                } else
                    // callback(null, rows);
                    resultData.push(rows);
                    return resultData;
            });
    // }

    // fetchID(dataRequsest, function (err, content) {
    //     if (err) {
    //         console.log(err);
    //
    //         // Do something with your error...
    //     } else {
    //         resultData.push(content);
    //         console.log(resultData);
    //         // return resultData;
    //     }
    // });

    // return resultData;
};


module.exports = User;

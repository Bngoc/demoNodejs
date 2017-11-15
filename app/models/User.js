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
    global.resultData = [];

    var dataRequsest = {
        id: 6
    };

    // connection.connect(connectionString, (err, connection, done) => {
    //     const query = connection.query('SELECT * from product_counts where id = ?', dataRequsest.id);
    //     query.on('row', (row) => {
    //         resultData.push(row);
    //         console.log(resultData);
    //     });
    //     query.on('end', () => {
    //         // done();
    //         return resultData;
    //     });
    // });
    connection.getConnection(function (error, connection) {
        if (!!error) {
            connection.release();
        } else {
            connection.query('SELECT * from product_counts where id = ?',
                dataRequsest.id, function (err, rows, filed) {
                    if (err) {
                        // callback(err, null);

                        console.log('xxxxxxxxxxxxxxxx', rows);
                    } else
                    // callback(null, rows);
                        resultData.push(rows);
                    console.log('yyyyyyyyyyyyyyyyyyyyyy', rows, 'ccccccccccccccc', resultData);
                });
        }
    });

    console.log('___________________', resultData);
    return resultData;
};


module.exports = User;

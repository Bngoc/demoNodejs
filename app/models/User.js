var connection = require("./../../lib/connection.js");
var User = function (params) {
    this.email = params.email;
    this.password = params.password;
    this.lastName = params.lastName;
    this.firstName = params.firstName;
    // ...etc
};

User.prototype.register = function (newUser) {
    connection.getConnection(function (error, connection) {
        // connection.doWhatever();

        // if (!!error) {
        //     tempCount.release();
        // } else  {
        //
        // }

    });
};

module.exports = User;

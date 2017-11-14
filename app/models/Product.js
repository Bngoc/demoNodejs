var connection = require("./../../lib/connection.js");

var Product = function (params) {
    this.email = params.email;
    this.password = params.password;
    this.lastName = params.lastName;
    this.firstName = params.firstName;
    // ...etc
};

Product.prototype.register = function (newUser) {
    connection.getConnection(function (error, connection) {
    });
};

module.exports = Product;

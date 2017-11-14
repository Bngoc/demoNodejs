'use strict';
var User = require("../models/User.js");
var Product = require("../models/Product.js");
var UserController = require('./UserController.js');
var ViewsController = require('./ViewsController.js');


class ProductController extends ViewsController {
    constructor() {
        super();
        console.log('constructor brfore index product');
    }

    // index product
    getIndex(req, res, next) {
        console.log('index product');

        res.render('product/create', {name: "12243434", title: "nmgdgjd gldsjg sjlsj"});

        // var email = req.body.email;
        // var password = req.body.password;
        // var firstName = req.body.first_name;
        // var lastName = req.body.last_name;
        // var userId;
        //
        // var params = {
        //     email: email,
        //     password: password,
        //     first_name: firstName,
        //     last_name: lastName,
        // };

        var newUser = new User({});
        //
        try {
            //     //connect
            newUser.register();
            //     // do other things...
        } catch (ex) {
            throw ex;
        }
        // res.render('index')

    };

    // register
    register(req, res, next) {
        // var email = req.body.email;
        // var password = req.body.password;
        // var firstName = req.body.first_name;
        // var lastName = req.body.last_name;
        // var userId;
        //
        // var params = {
        //     email: email,
        //     password: password,
        //     first_name: firstName,
        //     last_name: lastName,
        // };
        // var newUser = new Product(params);
        //
        // try {
        //     //connect
        //     newUser.register();
        //     // do other things...
        // } catch (ex) {
        //     throw ex;
        // }
    };
}

module.exports = ProductController;
'use strict'

var path = require('path');

var User = require("./../models/User.js");
var Product = require("./../models/Product.js");

// var BaseController = require('./BaseController.js');
var UserController = require('./UserController.js');
var ViewsController = require('./ViewsController.js');

const CoreHelper = require(path.join(__dirname, '/../../config/CoreHelper.js'));
const getCoreHelper = new CoreHelper();
const getConnect = getCoreHelper.getConnect();


class ProductController extends ViewsController {
    constructor() {
        super();
        console.log('constructor brfore index product');
    }

    // index product
    getIndex(req, res, next) {
        try {
            console.log('index product ..................');

            // res.render('product/create', {name: "12243434", title: "nmgdgjd gldsjg sjlsj"});

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

            if (getConnect) {
               var rsData = newUser.register(getConnect, req, res);

               console.log(rsData, " ----- rsData");
            }

            // if (connection) {
            //     connection.connect(function (err) {
            //         if (!err) {
            //             console.log("Database is connected ... nn");
            //
            //             connection.query('SELECT * from product_counts LIMIT 2', function (errSql, rows, fields) {
            //                 connection.end();
            //                 if (!errSql)
            //                     console.log('The solution is: ', rows);
            //                 else
            //                     console.log('Error while performing Query.');
            //             });
            //
            //         } else {
            //             console.log("Error connecting database ... nn");
            //         }
            //     });
            // }

            //

            //     //connect
            // newUser.register();
            //     // do other things...


            res.render(getCoreHelper.paths.VIEWS + 'product/create.ejs', {name: 111, title: 5343, body: [], bodyfff: 343434});
        } catch (ex) {
            throw ex;
        }

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
'use strict';

const HelperViewController = require('./HelperViewController.js');
const helperViewController = new HelperViewController();

var User = require("./../models/User.js");
var Product = require("./../models/Product.js");

// var BaseController = require('./BaseController.js');
var UserController = require('./UserController.js');
var ViewsController = require('./ViewsController.js');

class ProductController extends ViewsController {
    constructor() {
        super();
        console.log('constructor brfore index product');
    }

    // index product
    getIndex(req, res, next) {
        try {

            var showResponse = helperViewController;
            showResponse.script = '<>';
            showResponse.css = '<link rel="stylesheet" href="/css/style.min.css?v=1.5.0">';
            showResponse.title = 'Home product';
            showResponse.media = 'media';
            // showResponse.meta = showResponse.setMeta();
            // showResponse.css = showResponse.defaultScriptCss();
            showResponse.renderViews = 'product/create.ejs';
            showResponse.body = [111, 4444, 5555];
            showResponse.bodyfff = 1111;
            showResponse.name = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

            console.log('index product ..................', showResponse);

            var params = {
                email: 'ems@gmail.com',
                password: '34567890-=567890-098765467890',
                first_name: 'bui',
                last_name: 'lastName',
            };

            var newUser = new User({});

            // newUser.id = 16;
            // newUser.email = params.email;
            // newUser.firstName = params.first_name;
            // newUser.password = params.password;
            // newUser.fulName = params.first_name + ' ' + params.last_name;

            req.showResponse = showResponse;


            var rsData = newUser.register(req, res, function (errr, resultData) {
                if (errr) {
                    res.render(req.showResponse.renderViews, resultData);
                } else {

                    resultData.forEach(function (value, indexs) {
                        console.log(value.product_id + ' ---- ' + indexs);
                    });

                    showResponse.name = JSON.stringify(resultData);

                    res.render(showResponse.renderViews, showResponse);
                }
            });
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
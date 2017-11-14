'use strict';

var User = require("../models/User.js");
var HomeController = require('./HomeController.js');


class UserController {
    constructor() {
        console.log('constructor  brfore index user');
    }

    login(requset, response) {
        var homeController = new HomeController();
        response.render('login', {layout: 11});
    }

    register(req, res, next) {
        var email = req.body.email;
        var password = req.body.password;
        var firstName = req.body.first_name;
        var lastName = req.body.last_name;
        var userId;

        var params = {
            email: email,
            password: password,
            first_name: firstName,
            last_name: lastName,
        };
        var newUser = new User(params);

        try {
            //connect
            newUser.register();
            // do other things...
        } catch (ex) {
            throw ex;
        }
    };
}

module.exports = UserController;
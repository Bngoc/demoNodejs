'use strict';

const HelperViewController = require('./HelperViewController.js');
const helperViewController = new HelperViewController();


var path = require('path'),
    fs = require('fs');

var User = require("../models/User.js");
var HomeController = require('./HomeController.js');
var ViewsController = require('./ViewsController.js');


class UserController {
    constructor() {
        console.log('constructor  brfore index user');
    }

    login(requset, response) {

        // var viewsController = new ViewsController();
        // var dataLayoutHtml = viewsController.renderLayout();
        //
        // var sampleHtmlContent = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/user/login.ejs'), 'utf-8');
        // dataLayoutHtml = dataLayoutHtml.replace('{CONTENT}', sampleHtmlContent);
        // response.writeHead(200, {"Context-type": "text/html"});
        // response.end(dataLayoutHtml);

        // var homeController = new HomeController();
        response.render('user/login.ejs', helperViewController);

        // var homeController = new HomeController();
        // response.render('login', {layout: 11});

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
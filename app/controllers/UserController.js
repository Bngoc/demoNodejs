'use strict';

const ViewController = require('./ViewController.js');
const helper = new ViewController();


var User = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}User.js`);
var HomeController = helper.coreHelper.callModule(`${helper.coreHelper.paths.CONTROLLERS}HomeController.js`);


class UserController {
    constructor() {
        console.log('constructor  brfore index user');
    }

    getLogin(requset, response) {

        var showResponse = helper;

        showResponse.title = 'Login - Đăng nhập - iNET';
        showResponse.header = showResponse.getHeader('Chào mừng đến ' + showResponse.coreHelper.sampleConfig.domain.host);
        showResponse.cssInclude = showResponse.readFileInclude(['css/style.user.css'], 'c');
        showResponse.isNotIncludeSidebar = true;


        response.render('user/login.ejs', helper);
    }

    getForgot (req, res, next) {
        var showResponse = helper;

        showResponse.title = 'Forgot - Đăng nhập - iNET';
        showResponse.header = showResponse.getHeader('Quên mật khẩu')
        showResponse.isNotIncludeSidebar = true;
        showResponse.cssInclude = showResponse.readFileInclude(['css/style.user.css'], 'c');

        res.render('user/forgot.ejs', showResponse);
    }

    getRegister(req, res, next) {
        var showResponse = helper;

        showResponse.title = 'Signup - Đăng nhập - iNET';
        showResponse.header = showResponse.getHeader('Đăng ký');
        showResponse.isNotIncludeSidebar = true;
        showResponse.cssInclude = showResponse.readFileInclude(['css/style.user.css'], 'c');

        res.render('user/register.ejs', showResponse);
    }

    postRegister(req, res, next) {
        try {
            var showResponse = helper;

            // showResponse.title = 'Home product';
            // showResponse.scriptInclude = showResponse.readFileInclude(['js/product/abc.js']);
            // showResponse.metaInclude = showResponse.readFileInclude(['<meta name="twitter:app:id:ipad" content="871299723"/>'], 'o');

            showResponse.content = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX content';
            showResponse.name = '';

            showResponse.renderViews = 'product/create';

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

            helper.coreHelper.connection(function (resultDataConnection) {
                const connection = resultDataConnection.data;

                if(resultDataConnection.error) {

                    showResponse.content = resultDataConnection.msg;

                    res.render(req.showResponse.renderViews, showResponse);
                } else {
                    req.connection = connection;

                    var rsData = newUser.checkExistUserName(req, res, function () {

                        res.render(showResponse.renderViews, showResponse);
                    });

                    // var rsData = newUser.register(req, res, function (errConnect, resultData) {
                    //     if (errConnect) {
                    //         res.render(req.showResponse.renderViews, resultData);
                    //     } else {
                    //
                    //         // if (resultData.length) {
                    //         //     resultData.forEach(function (value, indexs) {
                    //         //         console.log(value.product_id + ' ---- ' + indexs);
                    //         //     });
                    //         // }
                    //
                    //         showResponse.name = resultData;
                    //
                    //         res.render(showResponse.renderViews, showResponse);
                    //     }
                    // });
                }
            });



        } catch (ex) {
            throw ex;
            console.log('ERROR TRY_CATCH product');
        }
    };

    postRegisterXXXX(req, res, next) {

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

    getLogout(req, res, next) {

    }
}

module.exports = UserController;
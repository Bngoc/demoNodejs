'use strict';

const bcrypt = require('bcrypt');

const ViewController = require('./ViewController.js');
const helper = new ViewController();

var User = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}User.js`);
var Contacts = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Contacts.js`);
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

    getForgot(req, res, next) {
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

            showResponse.content = '';
            showResponse.name = '';
            showResponse.renderViews = 'errors/error.ejs';

            var dataRequest = {
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password,
                first_name: req.body.name,
                last_name: 'lastNamef',
            };

            var newUser = new User({});
            // newUser.id = 16;
            // newUser.email = params.email;
            // newUser.firstName = params.first_name;
            // newUser.password = params.password;
            // newUser.fulName = params.first_name + ' ' + params.last_name;

            req.showResponse = showResponse;

            const aliasRouter = helper.coreHelper.aliasRouter();

            // -------------------------C1-----------------------------------
            newUser.checkUser(dataRequest, function (result) {
                if (result.error) {
                    showResponse.header = 'Errror';
                    showResponse.content = JSON.stringify(result.error);

                    res.render(showResponse.renderViews, showResponse);
                } else {
                    var resultSql = result.result;
                    if (resultSql > 0) {
                        showResponse.renderViews = 'user/register.ejs';
                        res.redirect('/register');
                    } else {
                        var dtUser = {
                            email: dataRequest.email,
                            phone: dataRequest.phone,
                            lastactive: dataRequest.email,
                            password: bcrypt.hashSync(dataRequest.password, 10)
                        };

                        newUser.insertUser(dtUser, function (rsData) {

                            console.log(rsData, '--------------000---------------');
                            // showResponse.content = JSON.stringify(rsData);
                            // res.render(showResponse.renderViews, showResponse);

                            if (rsData.error) {
                                showResponse.header = 'Errror.';
                                showResponse.content = JSON.stringify(rsData.error);

                                res.render(showResponse.renderViews, showResponse);
                            } else {
                                var newContacts = new Contacts({});
                                var newContact = {
                                    users_id: rsData.result.id,
                                    first_name: 'XXX',
                                    last_name: 'anc',
                                    country: 'vn',
                                    gender: 1
                                };

                                newContacts.inserts(newContact, function (resultInsert) {
                                    if (resultInsert.error) {
                                        showResponse.header = 'Errror......';
                                        showResponse.content = JSON.stringify(resultInsert.error);

                                        res.render(showResponse.renderViews, showResponse);
                                    } else {
                                        res.redirect(aliasRouter.build('chat'));
                                    }
                                });
                            }
                        });
                    }
                }
            });


// ------------------------------------------------------------
            // ------------------------------C2------------------------------

            /*helper.coreHelper.connection(function (resultConnection) {
             const connect = resultConnection.connect;

             if (resultConnection.error || resultConnection.connect == null) {
             showResponse.content = resultConnection.msg;
             res.render(showResponse.renderViews, showResponse);
             } else {
             var newUser = new User({});
             newUser.checkExistUserName(connect, dataRequest, function (resultSql) {
             if (resultSql.error) {
             showResponse.content = resultSql.msg;
             res.render(showResponse.renderViews, showResponse);
             } else {
             const aliasRouter = helper.coreHelper.aliasRouter();
             const configDb = helper.coreHelper.getConfigInfoDb();


             if (resultSql.result) {
             // exist user
             showResponse.renderViews = 'user/register.ejs';
             // res.render(showResponse.renderViews, showResponse);
             //res.redirect(req.url) ~~ res.redirect(req.header('referrer'));
             res.redirect('/register');
             } else {
             // Save user
             newUser.email = dataRequest.email;
             newUser.phone = dataRequest.phone;
             newUser.password = bcrypt.hashSync(dataRequest.password, 10);
             newUser.lastactive = Date.now();

             console.log(JSON.stringify(newUser));
             newUser.insert(connect, configDb, newUser, function (resultDataInsert) {
             if (resultDataInsert.error) {
             showResponse.content = resultDataInsert.msg;
             // res.render(req.showResponse.renderViews, showResponse);
             } else {

             var newContacts = new Contacts({});
             newContacts.insert(connect, dataRequest, function (resultInsert) {
             if (resultInsert.error) {
             showResponse.content = resultInsert.msg;
             // res.render(req.showResponse.renderViews, resultData);
             } else {

             console.log('-----------chat-------------');
             // showResponse.name = '1234567890_____________';

             showResponse.renderViews = 'chat/index.ejs';

             // res.render(showResponse.renderViews);
             res.redirect(aliasRouter.build('chat'));
             // res.redirect('/chat');
             }
             });
             }
             });
             }
             }
             });
             }
             });*/
        } catch (ex) {
            throw ex;
            console.log('ERROR TRY_CATCH product');
            res.render(showResponse.renderViews, showResponse);
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
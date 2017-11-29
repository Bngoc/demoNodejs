'use strict';

const bcrypt = require('bcrypt');
const flash = require('connect-flash');

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

        let messagePassport = requset.flash('error');
        if (messagePassport.length) {
            try {
                let dataPassport = JSON.parse(messagePassport[0]);
                if (dataPassport.code || dataPassport.result == null) {
                    requset.flash('error_msg', "Nhập tài khoản không tồn tại hoặc pass sai .... :d");
                } else if (dataPassport.code == null && dataPassport.result) {
                    requset.flash('error_msg', "pass sai .... :d");
                }
            }
            catch (e) {
                requset.flash('error_msg', messagePassport[0]);
            }
        }

        showResponse.title = 'Login - Đăng nhập - XXX';
        showResponse.cssInclude = showResponse.readFileInclude(['css/style.user.css'], 'c');
        showResponse.error_msg = requset.flash('error_msg');
        showResponse.isNotIncludeSidebar = true;

        response.render('user/login.ejs', helper);
    }

    // todo error
    postLoginClone(req, res, next) {
        helper.coreHelper.passport().authenticate('whatIsThis', function (err, user, info) {
            // if (err) { return next(err); }

            let infoPassport = info;
            //{"code":null,"error":"","msg":"","result":null}'
            if (infoPassport.message) {
                let dataPassport = JSON.parse(infoPassport.message);
                // console.log('------------------------', dataPassport.code, user, '-----------------', infoPassport)
                if (dataPassport.code || dataPassport.result == null) {
                    req.flash('error_msg', dataPassport.code);
                    return res.redirect('/login');
                } else {
                    if (dataPassport.result && user) {
                        // console.log('_____________', dataPassport.result ,'_______________');
                        // req.logIn(user, function(err) {
                        //     if (err) { return next(err); }
                        //     return res.redirect('/users/' + user.username);
                        // });

                        // next(null, user);// res.redirect('/chat');

                    }
                }
            }
        })(req, res, next);
    }

    // C0 call ajax
    postLogin(req, res) {
        try {
            var request = {
                loginId: req.body.loginId,
                pwd: req.body.pwd
            };
            var responseData = {};

            if (req.xhr) {
                if (req.body.loginId && req.body.pwd) {
                    var user = new User({});
                    user.findUser(request, function (resultUser) {
                        if (resultUser.code) {

                            res.status(404).send(resultUser);
                        } else {
                            if (resultUser.result) {
                                if (bcrypt.compareSync(req.body.pwd, resultUser.result.attributes.password)) {
                                    // req.session.userCurrent = resultUser;
                                    res.status(200).send(resultUser);
                                } else {
                                    responseData.pwd = 'Sai pass rùi .... ^_^';
                                    res.status(200).send(responseData);
                                }
                            }
                            else {
                                responseData.loginId = "Nhập tài khoản khong ton tại hoặc pass sai .... :d";
                                res.status(200).send(responseData);
                            }
                        }
                    });
                } else if (req.body.loginId && req.body.pwd == '') {
                    responseData.pwd = "Nhập pwd vào .... :d";
                    res.status(200).send(responseData);
                } else if (req.body.loginId == '' && req.body.pwd) {
                    responseData.loginId = "Nhập tài khoản vào .... :d";
                    res.status(200).send(responseData);
                } else {
                    responseData.pwd = "Nhập pass vào .... :d";
                    responseData.loginId = "Nhập tài khoản vào .... :d";
                    res.status(200).send(responseData);
                }
            }
        }

        catch (e) {
            res.status(500).send();
        }
    }

    getForgot(req, res, next) {
        var showResponse = helper;

        showResponse.title = 'Forgot - Quên mật khẩu - XXX';
        showResponse.isNotIncludeSidebar = true;
        showResponse.cssInclude = showResponse.readFileInclude(['css/style.user.css'], 'c');

        res.render('user/forgot.ejs', showResponse);
    }

    postForgot(req, res, next) {

    }

    getRegister(req, res, next) {
        var showResponse = helper;

        showResponse.title = 'Signup - Đăng nhập - XXX';
        // showResponse.header = showResponse.getHeader('Đăng ký');
        showResponse.isNotIncludeSidebar = true;
        showResponse.errors = [];
        showResponse.cssInclude = showResponse.readFileInclude(['css/style.user.css'], 'c');

        res.render('user/register.ejs', showResponse);
    }

    postRegister(req, res, next) {
        try {
            var showResponse = helper;

            req.checkBody('name', 'Name ').notEmpty();
            req.checkBody('email', 'Name ').notEmpty();
            req.checkBody('email', 'Name ').isEmail();
            req.checkBody('phone', 'Name ').notEmpty();
            req.checkBody('password', 'Name ').notEmpty();
            req.checkBody('repassword', 'Nameddfdfdf dgdgdg ').equals(req.body.password);

            showResponse.cssInclude = showResponse.readFileInclude(['css/style.user.css'], 'c');
            showResponse.isNotIncludeSidebar = true;

            let errors = req.validationErrors();
            if (errors) {
                console.log(errors);
                showResponse.errors = errors;
                // showResponse.errors = JSON.stringify(errors);

                showResponse.renderViews = 'user/register.ejs';

                res.render(showResponse.renderViews, showResponse);
            } else {
                console.log('ok');


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
                    last_name: 'xxxx',
                    repassword: req.body.repassword
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
                newUser.checkUser(dataRequest, function (resultData) {
                    console.log(resultData);
                    if (resultData.code) {
                        showResponse.header = 'Errror.......';
                        showResponse.content = JSON.stringify(resultData.error);

                        res.render(showResponse.renderViews, showResponse);
                    } else {
                        var resultSql = resultData.result;

                        if (resultSql > 0) {
                            var smsNotification = {
                                flag: 'danger',
                                msg: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
                            }
                            showResponse.renderViews = 'user/register.ejs';
                            res.redirect('/register', smsNotification);
                        } else {
                            newUser.insertUser(dataRequest, function (rsData) {
                                if (rsData.code) {
                                    showResponse.header = 'Errror.';
                                    showResponse.content = JSON.stringify(rsData.error);

                                    res.render(showResponse.renderViews, showResponse);
                                } else {
                                    res.redirect('/login');
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
            }
        } catch (ex) {
            throw ex;
            console.log('ERROR TRY_CATCH product');
            res.render(showResponse.renderViews, showResponse);
        }
    }

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
    }

    getLogout(req, res, next) {
        req.logout();
        res.redirect('/login');
    }
}

module.exports = UserController;
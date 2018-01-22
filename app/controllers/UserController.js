'use strict';

const bcrypt = require('bcrypt');
const flash = require('connect-flash');

const ViewController = require('./ViewController.js');
const helper = new ViewController();

var User = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Users.js`);
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

    // C0 -> call ajax - not passport (no authenticate)
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

    // c1 login submit html - user filter middleware

    // c2 login submit html - authenticate
    postLoginClone(req, res, next) {
        helper.coreHelper.passport('local').authenticate('local', function (err, user, info) {
            // if (err) { return next(err); }

            let infoPassport = info;
            //{"code":null,"error":"","msg":"","result":null}'
            if (infoPassport.message) {
                let dataPassport = JSON.parse(infoPassport.message);
                if (dataPassport.code || dataPassport.result == null) {
                    req.flash('error_msg', dataPassport.code);
                    return res.redirect('/login');
                } else {
                    if (dataPassport.result && user) {
                        req.logIn(user, function (err) {
                            if (err) {
                                return next(err);
                            }
                            return res.redirect('/chat');
                        });
                    }
                }
            }
        })(req, res, next);
    }

    // c3 -> call Ajax - authenticate
    postLoginAjax(req, res, next) {
        if (req.xhr) {
            var responseDataMap = {
                url: '',
                validate: [],
                msg: '',
                code: '',
                status: false
            };

            if (req.body.loginId && req.body.pwd) {
                helper.coreHelper.passport('local').authenticate('local', function (err, user, info) {
                    if (err) return next(err);

                    let infoPassport = info;
                    //{"code":null,"error":"","msg":"","result":null}'
                    if (infoPassport.message) {
                        let dataPassport = JSON.parse(infoPassport.message);
                        if (dataPassport.code || dataPassport.result == null) {
                            responseDataMap.code = dataPassport.code || 'ERR0003';
                            responseDataMap.msg = 'Account not exits';
                            res.status(200).send(responseDataMap);
                        } else {
                            if (dataPassport.result && user) {
                                req.logIn(user, function (err) {
                                    if (err) {
                                        responseDataMap.code = "ERR0003";
                                        responseDataMap.msg = 'Login Fail....!';
                                        res.status(200).send(responseDataMap);
                                    } else {
                                        var dataRequest = {
                                            clause: {users_id: user.id},
                                            dataUpdate: {is_life: 1},
                                        };
                                        var newContacts = new Contacts.class();
                                        newContacts.updateContact(dataRequest, function (errUpdate, rsModel) {
                                            if (errUpdate) next(errUpdate);

                                            req.session.cfg_chat = rsModel.get('cfg_chat');
                                            responseDataMap.status = true;
                                            responseDataMap.url = 'chat';
                                            responseDataMap.msg = 'Login success';
                                            res.status(200).send(responseDataMap);
                                        });
                                    }
                                });
                            } else {
                                responseDataMap.code = "ERR0003";
                                responseDataMap.msg = 'Account or password not authentication';
                                res.status(200).send(responseDataMap);
                            }
                        }
                    } else {
                        responseDataMap.code = "ERR0004";
                        responseDataMap.msg = 'ERROR: Server Not Response';
                        res.status(200).send(responseDataMap);
                    }
                })(req, res, next);
            } else {
                responseDataMap.code = 'ERR0001';
                responseDataMap.msg = 'Account is empty';
                var validateMsg = [];
                if (req.body.loginId == '' && req.body.pwd) {
                    validateMsg.push({param: 'loginId', msg: 'Account is required'})
                }
                else if (req.body.loginId && req.body.pwd == '') {
                    validateMsg.push({param: 'pwd', smg: 'Password is required'})
                } else {
                    validateMsg.push(
                        {param: 'loginId', msg: 'Account is required'},
                        {param: 'pwd', msg: 'Password is required'}
                    );
                }
                responseDataMap.validate = validateMsg;

                res.status(200).send(responseDataMap);
            }
        } else {
            res.status(500).send('Not use Jquery request to server....!');
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

    // submit - html
    postRegister(req, res, next) {
        try {
            var showResponse = helper;

            req.checkBody('name', 'Name is required').notEmpty();
            req.checkBody('email', 'Email is required').notEmpty();
            req.checkBody('email', 'Email not is email ').isEmail();
            req.checkBody('phone', 'Phone is required').notEmpty();
            req.checkBody('phone', 'Phone is Nunmber ').isNumeric();
            req.checkBody('password', 'Password is required').notEmpty();
            req.checkBody('password', 'The password length must be between 6 and 20.').isLength({min: 6, max: 20});
            req.checkBody('repassword', 'Re-Password is required').notEmpty();
            req.checkBody('repassword', 'Password does not match the confirm password ').equals(req.body.password);

            showResponse.cssInclude = showResponse.readFileInclude(['css/style.user.css'], 'c');
            showResponse.isNotIncludeSidebar = true;

            let errors = req.validationErrors();
            if (errors) {
                showResponse.errors = errors;
                showResponse.renderViews = 'user/register.ejs';

                res.render(showResponse.renderViews, showResponse);
            } else {

                // showResponse.title = 'Home product';
                // showResponse.scriptInclude = showResponse.readFileInclude(['js/product/abc.js']);
                // showResponse.metaInclude = showResponse.readFileInclude(['<meta name="twitter:app:id:ipad" content="871299723"/>'], 'o');

                showResponse.content = '';
                showResponse.name = '';
                showResponse.renderViews = 'errors/error.ejs';
                let cfgChat = helper.coreHelper.callModule(`${helper.coreHelper.paths.CONFIG}cfgChat.js`);

                var dataRequest = {
                    phone: req.body.phone,
                    email: req.body.email,
                    password: req.body.password,
                    first_name: req.body.name,
                    last_name: 'xxxx',
                    repassword: req.body.repassword,
                    cfg_chat: JSON.stringify(cfgChat)
                };

                var newUser = new User();

                req.showResponse = showResponse;
                // const aliasRouter = helper.coreHelper.aliasRouter();

                // -------------------------C1 connect DB Knex vs Bookshelf -----------------------------------
                newUser.checkUser(dataRequest, function (resultData) {
                    if (resultData.code) {
                        showResponse.header = 'Errror.......';
                        showResponse.content = JSON.stringify(resultData);

                        res.render(showResponse.renderViews, showResponse);
                    } else {
                        var resultSql = resultData.result;

                        if (resultSql > 0) {
                            req.flash('userExits', 'Tai khoan da ton tai');
                            showResponse.renderViews = 'user/register.ejs';
                            res.redirect('/register');
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


                // -----------------------------END C1-------------------------------
                // ------------------------------C2 connect DB not Lib------------------------------
                /*
                 helper.coreHelper.connection(function (resultConnection) {
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
                 });
                 */
            }
        } catch (ex) {
            throw ex;
            console.log('ERROR TRY_CATCH');
            res.render(showResponse.renderViews, showResponse);
        }
    }

    // submit - ajax
    postRegisterAjax(req, res, next) {
        if (req.xhr) {
            let responseData = {
                url: '',
                validate: [],
                msg: '',
                code: '',
                status: false
            };
            req.checkBody('name', 'Name is required').notEmpty();
            req.checkBody('email', 'Email is required').notEmpty();
            req.checkBody('email', 'Email not is email ').isEmail();
            req.checkBody('phone', 'Phone is required').notEmpty();
            req.checkBody('phone', 'Phone is Nunmber ').isNumeric();
            req.checkBody('password', 'Password is required').notEmpty();
            req.checkBody('password', 'The password length must be between 6 and 20.').isLength({min: 6, max: 20});
            req.checkBody('repassword', 'Re-Password is required').notEmpty();
            req.checkBody('repassword', 'Password does not match the confirm password ').equals(req.body.password);

            let errors = req.validationErrors();
            if (errors) {
                responseData.validate = errors;
                responseData.code = 'ERR0001';
                res.status(200).send(responseData);
            } else {
                var newUser = new User.class();
                let cfgChat = helper.coreHelper.callModule(`${helper.coreHelper.paths.CONFIG}cfgChat.js`);

                var dataRequest = {
                    phone: req.body.phone,
                    email: req.body.email,
                    password: req.body.password,
                    first_name: req.body.name,
                    last_name: 'xxx-xx',
                    repassword: req.body.repassword,
                    cfg_chat: JSON.stringify(cfgChat)
                };

                newUser.checkUser(dataRequest, function (resultData) {
                    if (resultData.code) {
                        responseData.code = resultData.code;
                        responseData.msg = 'Error: Sql execute select error';
                        res.status(200).send(responseData);
                    } else {
                        var resultSql = resultData.result;

                        if (resultSql > 0) {
                            responseData.code = 'ERR0002';
                            responseData.msg = 'Tai khoan da ton tai';
                            res.status(200).send(responseData);
                        } else {
                            newUser.insertUser(dataRequest, function (rsData) {
                                if (rsData.code) {
                                    responseData.code = 'ERR0003';
                                    responseData.msg = 'Error: Sql execute insert error';
                                } else {
                                    responseData.status = true;
                                    responseData.url = 'login'
                                }
                                res.status(200).send(responseData);
                            });
                        }
                    }
                    // res.status(200).send(responseData);
                });
            }
        } else {
            res.status(500).send('Not use Jquery request to server....!')
        }
    }

    getLogout(req, res, next) {
        if (req.session.passport.user) {
            var dataRequest = {
                clause: {users_id: req.session.passport.user},
                dataUpdate: {is_life: 0},
            };
            var newContacts = new Contacts.class();
            newContacts.updateContact(dataRequest, function (errUpdate, rsModel) {
                if (errUpdate) next(errUpdate);

                req.session.destroy();
                req.logOut();
                res.redirect('/login');
            });
        } else {
            res.redirect('/login');
        }
    }

    // ---------------------------------------------- angular -----------------------------------------
    postLoginAngular(req, res, next) {
        if (req.xhr) {
            var responseDataMap = {
                url: '',
                validate: [],
                msg: '',
                code: '',
                status: false
            };

            if (req.body.loginId && req.body.pwd) {
                helper.coreHelper.passport('local').authenticate('local', function (err, user, info) {
                    if (err) return next(err);

                    let infoPassport = info;
                    //{"code":null,"error":"","msg":"","result":null}'
                    if (infoPassport.message) {
                        let dataPassport = JSON.parse(infoPassport.message);
                        if (dataPassport.code || dataPassport.result == null) {
                            responseDataMap.code = dataPassport.code || 'ERR0003';
                            responseDataMap.msg = 'Account not exits';
                            res.status(200).send(responseDataMap);
                        } else {
                            if (dataPassport.result && user) {
                                req.logIn(user, function (err) {
                                    if (err) {
                                        responseDataMap.code = "ERR0003";
                                        responseDataMap.msg = 'Login Fail....!';
                                        res.status(200).send(responseDataMap);
                                    } else {
                                        let dataRequest = {
                                            clause: {users_id: user.id},
                                            dataUpdate: {is_life: 1},
                                        };
                                        let newContacts = new Contacts.class();
                                        let dataRequestToken = {
                                            data: {
                                                users_id: user.id,
                                            },
                                            expiresIn: helper.coreHelper.sampleConfig.domain.maxAge
                                        };
                                        let token = helper.coreHelper.createSignToken(helper.coreHelper.sampleConfig.APP_SECRET, dataRequestToken);
                                        newContacts.updateContact(dataRequest, function (errUpdate, rsModel) {
                                            if (errUpdate) next(errUpdate);

                                            req.session.cfg_chat = rsModel.get('cfg_chat');
                                            responseDataMap.status = true;
                                            responseDataMap.url = '/chat';
                                            responseDataMap.msg = 'Login success';
                                            responseDataMap.token = token;

                                            res.status(200).send(responseDataMap);
                                        });
                                    }
                                });
                            } else {
                                responseDataMap.code = "ERR0003";
                                responseDataMap.msg = 'Account or password not authentication';
                                res.status(200).send(responseDataMap);
                            }
                        }
                    } else {
                        responseDataMap.code = "ERR0004";
                        responseDataMap.msg = 'ERROR: Server Not Response';
                        res.status(200).send(responseDataMap);
                    }
                })(req, res, next);
            } else {
                responseDataMap.code = 'ERR0001';
                responseDataMap.msg = 'Account is empty';
                var validateMsg = [];
                if (req.body.loginId == '' && req.body.pwd) {
                    validateMsg.push({param: 'loginId', msg: 'Account is required'})
                }
                else if (req.body.loginId && req.body.pwd == '') {
                    validateMsg.push({param: 'pwd', smg: 'Password is required'})
                } else {
                    validateMsg.push(
                        {param: 'loginId', msg: 'Account is required'},
                        {param: 'pwd', msg: 'Password is required'}
                    );
                }
                responseDataMap.validate = validateMsg;

                res.status(200).send(responseDataMap);
            }
        } else {
            res.status(500).send('Not use Jquery request to server....!');
        }
    }

    postLogoutAngular(req, res, next) {
        if (req.session !== undefined) {
            if (req.session.hasOwnProperty('passport')) {
                if (req.session.passport.user) {
                    var dataRequest = {
                        clause: {users_id: req.session.passport.user},
                        dataUpdate: {is_life: 0},
                    };
                    var newContacts = new Contacts.class();
                    newContacts.updateContact(dataRequest, function (errUpdate, rsModel) {
                        if (errUpdate) next(errUpdate);

                        req.session.destroy();
                        req.logOut();
                        res.status(200).send(['/login']);
                    });
                }
            }
        } else {
            res.status(200).send(['/login']);
        }
    }
}

module.exports = UserController;
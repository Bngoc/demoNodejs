'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const flash = require('connect-flash');

class Passport {
    configPassport(coreHelper) {
        var User = coreHelper.callModule(`${coreHelper.paths.MODELS}User.js`);
        var newUser = new User({});

        // serialize sessions
        passport.serializeUser(function (user, done) {
            done(null, user.id)
        });

        passport.deserializeUser(function (id, done) {
            newUser.findOne({id: id}, function (err, user) {
                done(err, user)
            })
        });

        // use these strategies
        passport.use('whatIsThis', this.configLocalStrategy(coreHelper));

        return passport;
    }

    configLocalStrategy(coreHelper) {
        var localStrategy = new LocalStrategy({
            usernameField: 'loginId',
            passwordField: 'pwd',
        }, function (username, password, callback) {
            var User = coreHelper.callModule(`${coreHelper.paths.MODELS}User.js`);
            var newUser = new User({});

            newUser.findUser({loginId: username}, function (resultUser) {
                if (resultUser.code) {
                    return callback(resultUser.code, false, {messageLogin: JSON.stringify(resultUser)});
                } else {
                    if (resultUser.result) {
                        if (bcrypt.compareSync(password, resultUser.result.attributes.password)) {
                            // res.status(200).send(resultUser);
                            return callback(null, resultUser.result.attributes);
                        } else {
                            return callback(resultUser.code, false, {messageLogin: JSON.stringify(resultUser)});
                            // responseData.pwd = 'Sai pass rùi .... ^_^';
                            // res.status(200).send(responseData);
                        }
                    }
                    else {
                        // responseData.loginId = "Nhập tài khoản khong ton tại hoặc pass sai .... :d";
                        // res.status(200).send(responseData);
                        return callback(resultUser.code, false, {messageLogin: JSON.stringify(resultUser)});
                    }
                }
            });
        });

        return localStrategy;
    }
}

module.exports = Passport;

// ____________________________________

// var User = require('../models/user');
// var passport = require('passport');
//
// module.exports = function (app) {
//     app.get('/login', function (req, res) {
//         // hiển thị view login và login message nếu nó tồn tại.
//         res.render('login', {message: req.flash('loginMessage')});
//     });
//
//     app.get('/signup', function (req, res) {
//
// // hiển thị view login
//         res.render('signup', {message: req.flash('signupMessage')});
//     });
//
// // route này phải đi qua 1 middleware kiểm tra trạng thái đăng nhập,
// //chỉ người dùng
// // đã đăng nhập mới có thể vào trang này.
//     app.get('/profile', isLoggedIn, function (req, res) {
//         res.render('profile', {
//             user: req.user
//             // lấy thông tin người dùng trong session
//             //và truyền qua view
//         });
//     });
//
// // đăng xuất
//     app.get('/logout', function (req, res) {
//         req.logout();
//         res.redirect('/login');
//     });
// };
//
// // route middleware kiểm tra để chắc chắn là
// // người dùng đã đăng nhập
// function isLoggedIn(req, res, next) {
//
// // nếu người dùng đã đăng nhập thì tiếp tục thực hiện
//     if (req.isAuthenticated())
//         return next();
//
// // ngược lại điều hướng về đăng nhập.
//     res.redirect('/login');
// }
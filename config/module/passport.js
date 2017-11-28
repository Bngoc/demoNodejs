'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

class Passport {
    configPassport(coreHelper) {
        // serialize sessions
        passport.serializeUser(function (user, done) {
            console.log('________', user, '________');
            // if (user.code && user)
                done(null, user.id)
        });

        passport.deserializeUser(function (id, done) {
            User.findOne({_id: id}, function (err, user) {
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

            newUser.findUser({'loginId': username}, function (rsUser) {
                if (rsUser.code == null && rsUser.result) {
                    if (bcrypt.compareSync(password, rsUser.result.attributes.password)) {
                        callback(null, rsUser.result);
                    }
                }
                // callBack Faile
                callback(rsUser.code, rsUser.result);
            });

            // password = crypt.sha1(password);
            // usersTable.findOne({'user_name': username, 'password': password}, function (err, user) {
            //     if (err) {
            //         return callback(err);
            //     }
            //     if (!user) return callback(null, false);
            //     return callback(null, user);
            // });
        });

        return localStrategy;
    }
}

module.exports = Passport;
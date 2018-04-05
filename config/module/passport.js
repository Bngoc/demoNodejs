'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const bcrypt = require('bcrypt');
const flash = require('connect-flash');

class Passport {
    configPassport(coreHelper) {
        var User = coreHelper.callModule(`${coreHelper.paths.MODELS}Users.js`);
        var newUser = new User.class({});

        // serialize sessions
        passport.serializeUser(function (user, done) {
            done(null, user.id)
        });

        // sau khi xac thuc thi kiem tra cac router gui len server
        passport.deserializeUser(function (id, done) {
            newUser.findById(id, function (err, user) {
                done(err, user)
            })
        });

        // use these strategies
        passport.use('local', this.configLocalStrategy(coreHelper));
        // passport.use('facebook', this.configFacebook(coreHelper));

        return passport;
    }

    configPassportFB(coreHelper) {
        var User = coreHelper.callModule(`${coreHelper.paths.MODELS}Users.js`);
        var newUser = new User({});

        // serialize sessions
        passport.serializeUser(function (user, done) {
            // done(null, user.id)
            done(null, 1);
        });

        // sau khi xac thuc thi kiem tra cac router gui len server
        passport.deserializeUser(function (id, done) {
            // newUser.findOne({id: id}, function (err, user) {
            //     done(err, user)
            // })
            done(null, true);
        });

        // use these strategies
        passport.use('facebook', new this.configFacebook(coreHelper));

        return passport;
    }

    configFacebook(coreHelper) {
        let configAuth = coreHelper.callModule(`${coreHelper.CONFIG}/auth`);
        var facebookStrategy = new FacebookStrategy(configAuth.facebookAuth,

            // facebook will send back the tokens and profile
            function (access_token, refresh_token, profile, done) {
                var User = coreHelper.callModule(`${coreHelper.paths.MODELS}Users.js`);
                var newUser = new User({});

                // asynchronous
                process.nextTick(function () {

                    // find the user in the database based on their facebook id
                    User.findOne({'id': profile.id}, function (err, user) {

                        // if there is an error, stop everything and return that
                        // ie an error connecting to the database
                        if (err)
                            return done(err);

                        // if the user is found, then log them in
                        if (user) {
                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user found with that facebook id, create them
                            var newUser = new User();

                            // set all of the facebook information in our user model
                            newUser.fb.id = profile.id; // set the users facebook id
                            newUser.fb.access_token = access_token; // we will save the token that facebook provides to the user
                            newUser.fb.firstName = profile.name.givenName;
                            newUser.fb.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
                            newUser.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                            // save our user to the database
                            newUser.save(function (err) {
                                if (err)
                                    throw err;

                                // if successful, return the new user
                                return done(null, newUser);
                            });
                        }
                    });
                });
            });
    }

    configLocalStrategy(coreHelper) {
        var localStrategy = new LocalStrategy({
            usernameField: 'loginId',
            passwordField: 'pwd',
        }, function (username, password, callback) {
            var User = coreHelper.callModule(`${coreHelper.paths.MODELS}Users.js`);
            var newUser = new User.class({});
            newUser.findUser({loginId: username}, function (resultUser) {
                if (resultUser.code) {
                    return callback(null, false, {message: JSON.stringify(resultUser)});
                } else {
                    if (resultUser.result) {
                        if (bcrypt.compareSync(password, resultUser.result.attributes.password)) {
                            // res.status(200).send(resultUser);
                            return callback(null, resultUser.result.attributes, {message: JSON.stringify(resultUser)});
                        } else {
                            return callback(null, false, {message: JSON.stringify(resultUser)});
                            // responseData.pwd = 'Sai pass rùi .... ^_^';
                            // res.status(200).send(responseData);
                        }
                    }
                    else {
                        // responseData.loginId = "Nhập tài khoản khong ton tại hoặc pass sai .... :d";
                        // res.status(200).send(responseData);
                        return callback(null, false, {message: JSON.stringify(resultUser)});
                    }
                }
            });
        });

        return localStrategy;
    }
}

module.exports = Passport;
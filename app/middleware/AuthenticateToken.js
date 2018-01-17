'use strict';

const jwt = require('jsonwebtoken');

// jwt.verify(token, 'shhhhh', function(err, decoded) {
//     console.log(decoded.foo) // bar
// });

class AuthenticateToken {
    isAuthenticated(req, res, next) {

        // do any checks you want to in here

        // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
        // you can do this however you want with whatever variables you set up
        if (req.isAuthenticated())
        // if (req.user.authenticated)
            return next();

        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        // req.flash('error_msg', 'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ');
        res.redirect('/login');
    }

    authenticatedRegister(req, res, next) {
        if (!req.isAuthenticated())
            return next();

        // req.flash('userExits', 'Account is logged');
        res.redirect('/');
    }
}

module.exports = AuthenticateToken;
'use strict';

class AuthenticateAngular {
    isAuthenticated(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.sendStatus(401);
        // res.redirect('/login');
    }

    authenticatedRegister(req, res, next) {
        if (!req.isAuthenticated())
            return next();

        res.redirect('/');
    }
}

module.exports = AuthenticateAngular;
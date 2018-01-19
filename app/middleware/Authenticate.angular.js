'use strict';

class AuthenticateAngular {
    isAuthenticated(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.status(401).send({url: '/login'});
    }

    authenticatedRegister(req, res, next) {
        if (!req.isAuthenticated())
            return next();

        res.status(401).send({url: '/'});
    }
}

module.exports = AuthenticateAngular;
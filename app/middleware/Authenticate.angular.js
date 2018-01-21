'use strict';

class AuthenticateAngular {
    isAuthenticated(req, res, next) {
        if (req.isAuthenticated())
            return next();

        req.session.destroy();
        req.logOut();
        res.status(401).send({url: '/login'});
    }

    authenticatedRegister(req, res, next) {
        if (!req.isAuthenticated())
            return next();

        if (req.headers.authorization.split(" ")[1] === undefined) {
            req.session.destroy();
            req.logOut();
            res.sendStatus(401);
        } else {
            res.status(401).send({url: '/'});
        }
    }
}

module.exports = AuthenticateAngular;
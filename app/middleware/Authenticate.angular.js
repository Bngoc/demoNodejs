'use strict';

class AuthenticateAngular {
    isAuthenticated(req, res, next) {
        // console.log('req.body', req)
        // if (req.isAuthenticated())
            return next();

        // req.session.destroy();
        // req.logOut();
        // res.status(401).send({url: '/login'});
    }

    authenticatedRegister(req, res, next) {
        if (!req.isAuthenticated())
            return next();

        if (typeof req.headers.authorization !== 'undefined' && req.headers.authorization.split(" ")[1] === undefined) {
            req.session.destroy();
            req.logOut();
            res.status(401).send({url: '/login'});
        } else {
            res.status(401).send({url: '/'});
        }
    }
}

module.exports = AuthenticateAngular;
'use strict';

const jwt = require('jsonwebtoken');

class AuthenticateToken {
    verifyToken(req, res, next) {
        try {
            if (typeof req.headers.authorization !== 'undefined' && req.headers.authorization.split(' ')[0] === 'Bearer') {
                let token = req.headers.authorization.split(" ")[1];
                jwt.verify(token, req.secret, (err, decoded) => {
                    if (err) {
                        req.session.destroy();
                        req.logOut();
                        res.status(401).send({url: '/login'});
                    } else {
                        return next();
                    }
                });
            } else {
                res.sendStatus(401);
            }
        } catch (ex) {
            req.session.destroy();
            req.logOut();
            res.sendStatus(401);
        }
    }
}

module.exports = AuthenticateToken;
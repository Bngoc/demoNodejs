'use strict';

const jwt = require('jsonwebtoken');


class AuthenticateToken {
    verifyToken(req, res, next) {
        try {
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                let token = req.headers.authorization.split(" ")[1];
                jwt.verify(token, req.secret, (err, decoded) => {
                    if (err) {
                        res.status(401).send({url: 'login'});
                    } else {
                        return next();
                    }
                });
            }
        } catch (ex) {
            res.sendStatus(401);
        }
    }
}

module.exports = AuthenticateToken;
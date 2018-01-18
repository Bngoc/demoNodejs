'use strict';

const jwt = require('jsonwebtoken');


class AuthenticateToken {
    verifyToken(req, res, next) {
        try {
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                let token = req.headers.authorization.split(" ")[1];
                jwt.verify(token, req.secret, (err, decoded) => {
                    // console.log(err, decoded);
                    if (err) {
                        // res.redirect('/');
                        // res.status(401).send('login');
                        res.sendStatus(401);
                    } else {
                        return next();
                    }
                });
            }
        } catch (ex) {
            res.sendStatus(401);
            // res.redirect('/');
            // res.status(401).send('I need login');
        }
    }
}

module.exports = AuthenticateToken;
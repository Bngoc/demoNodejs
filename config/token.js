'use strict';

const jwt = require('jsonwebtoken');

class Token {
    signToken(keySecret, reqData) {
        return jwt.sign({wft90: reqData.data}, keySecret, {expiresIn: '1d'});
    }
}

module.exports = Token;

// https://gist.github.com/thebigredgeek/230368bd92aa19e3f6638b659edf5cef
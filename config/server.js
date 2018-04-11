'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');
const config = require('config');

class Server {
    createServer(app, opt) {
        try {
            if (config.get('domain.ssl') !== true) {
                var serverHttp = http.createServer(app).listen(config.get('domain.port'), config.get('domain.host'));
                return serverHttp;
            }
            else {
                const httpsOptions = {
                    cert: fs.readFileSync(`${opt.paths.CONFIG}/ssl/local.nodejs.vn/server.crt`, 'utf8'),
                    key: fs.readFileSync(`${opt.paths.CONFIG}/ssl/local.nodejs.vn/server.key`, 'utf8'),
                    ca: fs.readFileSync(`${opt.paths.CONFIG}/ssl/local.nodejs.vn/ca.crt`, 'utf8'),
                    requestCert: config.get('domain.requestCert'),
                    rejectUnauthorized: config.get('domain.rejectUnauthorized'),
                    passphrase: config.get('domain.passphrase'),
                    family: config.get('domain.family')
                };

                //run -> chmod 755 generate-certificates.sh in ssl
                //run -> ./generate-certificates.sh
                // add cert for browers
                var serverHttps = https.createServer(httpsOptions, app).listen(config.get('domain.port'), config.get('domain.host'), function (err) {
                    console.log("server started at port " + serverHttps.address().address, serverHttps.address().port);
                }).on('error', (e) => {
                    console.error('Run Server... ', e);
                });
                return serverHttps;
            }
        } catch (ex) {
            console.log('ERROR: NOT RUNNING SERVER.....', ex);
        }
    }
}

module.exports = Server;
'use strict';

const fs = require('fs');
// const http = require('http');
const https = require('https');


class Server {
    createServer(app, opt) {
        try {
            // var serverHttp = http.createServer(app).listen(opt.config.domain.port, opt.config.domain.host);
            // return serverHttp;
            const httpsOptions = {
                cert: fs.readFileSync(`${opt.paths.CONFIG}/ssl/server.crt`, 'utf8'),
                key: fs.readFileSync(`${opt.paths.CONFIG}/ssl/server.key`, 'utf8'),
                // ca: fs.readFileSync(`${opt.paths.CONFIG}/ssl/ca.cert`, 'utf8'),
                requestCert: opt.config.domain.requestCert,
                rejectUnauthorized: opt.config.domain.rejectUnauthorized,
                passphrase: opt.config.domain.passphrase,
                family: opt.config.domain.family
            };

            //run -> chmod 755 generate-certificates.sh in ssl
            //run -> ./generate-certificates.sh
            // add cert for browers
            var serverHttps = https.createServer(httpsOptions, app).listen(opt.config.domain.port, opt.config.domain.host, function (err) {
                console.log("server started at port " + serverHttps.address().address, serverHttps.address().port);
            }).on('error', (e) => {
                console.error(e);
            });
            return serverHttps;
        } catch (err) {
            console.log('ERROR: NOT RUNNING SERVER.....', err);
        }
    }
}

module.exports = Server;
'use strict';

const fs = require('fs');
// const http = require('http');
const https = require('https');


class Server {
    createServer(app, opt) {
        const httpsOptions = {
            cert: fs.readFileSync(`${opt.paths.CONFIG}/ssl/server.crt`),
            key: fs.readFileSync(`${opt.paths.CONFIG}/ssl/server.key`)
        };
        // var serverHttp = http.createServer(app).listen(opt.config.domain.port, opt.config.domain.host);
        //run -> chmod 755 generate-certificates.sh in ssl
        //run -> ./generate-certificates.sh
        // add cert for browers
        var serverHttps = https.createServer(httpsOptions, app).listen(opt.config.domain.port, opt.config.domain.host);
        return serverHttps;
    }
}

module.exports = Server;
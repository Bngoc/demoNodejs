'use strict';

const http = require('http');

class Server {
    createServer(app, config) {
        var server = http.createServer(app);
        // server.listen(config.domain.port);
        server.listen(config.domain.port, config.domain.host);
        return server;
    }
}

module.exports = Server;
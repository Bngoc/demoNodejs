'use strict';

//convert url ?ab=name&f=1
const url = require('url');
//authenticate
const passport = require('passport');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const express = require('express');
const i18n = require('i18n');
const expressValidator = require('express-validator');
const errorhandler = require('errorhandler');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const sharedSession = require("express-socket.io-session");
const socketIo = require('socket.io');
const SocketAntiSpam = require('socket-anti-spam');
const redis = require('redis');
const client = redis.createClient();
const sessionStore = new session.MemoryStore();
// use hander log
const env = process.env.NODE_ENV || 'development';
// Cors
const cors = require('cors');
const connectRedis = require('connect-redis')(session);
const config = require('config');
const jwt = require('jsonwebtoken');

class Express {

    configExpress(app, coreHelper) {

        app.set('view engine', 'ejs');
        app.engine('html', ejs.renderFile);
        app.set('views', coreHelper.paths.VIEWS);
        app.set('layout', 'layouts/master');
        // Set True NOT use element CSS SCRIPT ... response.render()
        app.set("layout extractScripts", false);
        app.set("layout extractStyles", false);
        app.set("layout extractMetas", true);
        app.set("layout extractTitles", true);
        app.set('port', config.domain.port);
        app.set('view options', {layout: 'layouts/master'});
        // app.set('path_model', paths.models);
        app.use(expressLayouts);

        app.use(logger('dev'));

        // Cookies.
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(bodyParser.text({type: 'text/html'}));
        app.use(expressValidator());
        // app.use(expressValidator(customValidator()));
        app.use(methodOverride('X-HTTP-Method-Override'));

        app.set('secretNode', coreHelper.app.secret);
        this.configSession(app, coreHelper);

        //Global vars
        app.use(function (req, res, next) {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.warning_msg = req.flash('warning_msg');
            res.locals.notify_msg = req.flash('notify_msg');
            res.locals.user = req.user || null;

            next();
        });

        app.use(cors({
            origin: '*',
            credentials: false,
            methods: 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS',
            allowedHeaders: 'Content-Type,Authorization,Accept,Origin,Access-Control-Allow-Origin'
        }));

        app.use(methodOverride(function (req, res) {
            if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                // look in urlencoded POST bodies and delete it
                let method = req.body._method;
                delete req.body._method;
                return method
            }
        }));

        // public folder public
        app.use(express.static(coreHelper.paths.PUBLIC));

        app.use(errorhandler());
        app.use(favicon(coreHelper.paths.IMAGES + 'favicon.ico'));
    };

    configSocket(server, app, coreHelper, callback) {
        let ioSocket = socketIo(server);
        ioSocket.use(sharedSession(this.configSession(app, coreHelper)), {autoSave: true});

        const socketAntiSpam = new SocketAntiSpam({
            banTime: 1,                     // Ban time in minutes
            kickThreshold: 10,              // User gets kicked after this many spam score
            kickTimesBeforeBan: 2,          // User gets banned after this many kicks
            banning: true,                  // Uses temp IP banning after kickTimesBeforeBan
            io: ioSocket,                   // Bind the socket.io variable
            //redis: client                // Redis client if you are sharing multiple servers
        });

        ioSocket.set('origins', '*:*');
        ioSocket.use(function (socket, next) {
            if (socket.handshake.query && socket.handshake.query.token) {
                jwt.verify(socket.handshake.query.token, config.APP_SECRET, function (err, decoded) {
                    if (err) return next(new Error('Authentication error'));
                    socket.socketUserID = (decoded.wft90 && decoded.wft90.users_id) ? decoded.wft90.users_id : null;
                    socket.decodeToken = decoded;
                    next();
                });
            } else {
                next(new Error('Authentication error'));
            }
        });

        callback(ioSocket, socketAntiSpam);
    }

    //https secure: true,
    configSession(app, isSocket = false) {
        const dbSession = new connectRedis({
            client: client,
            host: config.domain.host,
            port: config.domain.port,
            prefix: config.domain.prefix,
            disableTTL: true
        });

        // Session.
        let sessionConfig = session({
            secret: config.APP_SECRET,
            name: config.APP_KEY,
            store: dbSession,
            // store: sessionStore,
            saveUninitialized: true,
            resave: false,
            cookie: {
                secure: config.domain.ssl,
                httpOnly: true,
                maxAge: config.domain.maxAge * 1000,
            }
        });

        if (isSocket) {

        }
        app.use(cookieParser(config.APP_SECRET));
        app.use(sessionConfig);

        // Passport.
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
        // app.use(i18n.init);

        return sessionConfig;
    }
}

module.exports = Express;

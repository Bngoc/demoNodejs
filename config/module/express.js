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
const sessionStore = new session.MemoryStore();
// use hander log
const env = process.env.NODE_ENV || 'development';


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
        app.set('port', coreHelper.sampleConfig.domain.port);
        app.set('view options', {layout: 'layouts/master'});
        // app.set('path_model', paths.models);
        app.use(expressLayouts);

        app.use(logger('dev'));
        // use encode url
        app.use(bodyParser.urlencoded({extended: true}));
        //JSON
        app.use(bodyParser.json());
        app.use(bodyParser.text({type: 'text/html'}));
        app.use(expressValidator());
        // app.use(expressValidator(customValidator()));
        app.use(methodOverride('X-HTTP-Method-Override'));

        app.set('secretNode', coreHelper.app.secret);
        // app.use(cookieParser('secret'));
        // app.use(this.configSession());
        // app.use(passport.initialize());
        // app.use(passport.session());
        // app.use(flash());

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

        app.use(methodOverride(function (req, res) {
            if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                // look in urlencoded POST bodies and delete it
                var method = req.body._method;
                delete req.body._method;
                return method
            }
        }));

        // public folder public
        app.use(express.static(coreHelper.paths.PUBLIC));

        app.use(errorhandler());
        app.use(favicon(coreHelper.paths.IMAGES + 'favicon.ico'));
    };

    configSocket(server, app, coreHelper) {
        let io = socketIo(server);
        io.use(sharedSession(this.configSession(app, coreHelper)), {autoSave: true});

        return io;
    }

    //https secure: true,
    configSession(app, coreHelper) {
        let sessionConfig = session({
            secret: coreHelper.sampleConfig.APP_SECRET,
            name: coreHelper.sampleConfig.APP_KEY,
            store: sessionStore,
            saveUninitialized: true,
            resave: false,
            cookie: {
                secure: coreHelper.sampleConfig.domain.ssl,
                httpOnly: true,
                maxAge: coreHelper.sampleConfig.domain.maxAge * 1000,
            }
        });
        app.use(cookieParser(coreHelper.sampleConfig.APP_SECRET));
        app.use(sessionConfig);
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
        // app.use(i18n.init);

        return sessionConfig;
    }
}

module.exports = Express;

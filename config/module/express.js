'use strict';
/**
 * Module dependencies.
 */
const ejs = require('ejs');
const expressLayouts  = require('express-ejs-layouts');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const express = require('express');
const i18n = require('i18n');
// const expressValidator = require('express-validator');

const errorhandler     = require('errorhandler');
const favicon = require('serve-favicon');
// const cookieParser     = require('cookie-parser');
// const session          = require('express-session');
// const flash            = require('express-flash');
// const env              = process.env.NODE_ENV || 'development';

/**
 * include config
 */
// const paths    = require("../paths");
// const config   = require(paths.config + "config");
// const customValidator = require(paths.config_module + "validator");

// var cookieParserConfig = cookieParser();
// var sessionConfig = session({
//     secret: config.session_secret,
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//         secure: false,
//         maxAge: (3600000 * 24) * 14, // 2 week
//     }
// });

/**
 * Expose
 */

class Express {

    configExpress(app, coreHelper, passport) {
        app.set('view engine', 'ejs');
        app.engine('html', ejs.renderFile);
        app.set('views', coreHelper.paths.VIEWS);
        app.set('layout', 'layouts/master');
        // Set True NOT use elemment response.render()
        app.set("layout extractScripts", false);
        app.set("layout extractStyles", false);
        app.set("layout extractMetas", true);
        app.set("layout extractTitles", true);
        app.set('port', coreHelper.sampleConfig.domain.port);
        app.set('view options', {layout: 'layouts/master'});
        // app.set('path_model', paths.models);
        app.use(expressLayouts);

        app.use(logger('dev'));
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(bodyParser.text({type: 'text/html'}));
        // app.use(expressValidator(customValidator()));
        app.use(methodOverride('X-HTTP-Method-Override'));
        app.use(methodOverride(function (req, res) {
            if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                // look in urlencoded POST bodies and delete it
                var method = req.body._method
                delete req.body._method
                return method
            }
        }));

        app.use(express.static(coreHelper.paths.PUBLIC));
        // app.use('/images',express.static(coreHelper.paths.JS));
        // app.use('/images', express.static(coreHelper.paths.CSS));
        // app.use('/images', express.static(coreHelper.paths.IMAGES));

        app.use(errorhandler());
        app.use(favicon(coreHelper.paths.IMAGES + 'favicon.ico'));
    };
}

// exports.configSession = function(app, passport) {
//     app.use(cookieParserConfig);
//     app.use(sessionConfig);
//     app.use(passport.initialize());
//     app.use(passport.session());
//     app.use(flash());
//     app.use(i18n.init);
//     return sessionConfig;
// }


module.exports = Express;

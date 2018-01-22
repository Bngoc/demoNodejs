'use strict';

const passport = require('passport');
var Router = require('named-routes');
var router = new Router();
//https://github.com/alubbe/named-routes

class Routers {
    useRoutes(app, coreHelper) {

        router.extendExpress(app);
        router.registerAppHelpers(app);

        let useMiddleware = coreHelper.callModule(`${coreHelper.paths.MIDDLEWARE}Authenticate.js`, true);
        let productController = coreHelper.callModule(`${coreHelper.paths.CONTROLLERS}ProductController.js`, true);
        let homeController = coreHelper.callModule(`${coreHelper.paths.CONTROLLERS}HomeController.js`, true);
        let chatController = coreHelper.callModule(`${coreHelper.paths.CONTROLLERS}ChatController.js`, true);
        let userController = coreHelper.callModule(`${coreHelper.paths.CONTROLLERS}UserController.js`, true);

        // ---------------------- List router ----------------------------
        app.get('/', 'user', homeController.getIndex);

        app.get("/login", useMiddleware.authenticatedRegister, userController.getLogin);
        // --------------------C0 ------------------
        // app.post("/login", userController.postLogin);
        // --------------------C1 ------------------
        // app.post("/login", coreHelper.passport('local').authenticate('local', { successRedirect: '/chat', failureRedirect: '/login', failureFlash: true}));
        // --------------------C2 ------------------
        // app.post("/login", userController.postLoginClone);
        // ------------------- c3 -------------------
        app.post("/login", useMiddleware.authenticatedRegister, userController.postLoginAjax);

        app.get("/forgot", useMiddleware.authenticatedRegister, userController.getForgot);
        app.post("/forgot", userController.postForgot);
        app.get("/register", useMiddleware.authenticatedRegister, userController.getRegister);
        // ------------------- c1 -------------------
        // app.post("/register", userController.postRegister);
        // ------------------- c2 -------------------
        app.post("/register", useMiddleware.authenticatedRegister, userController.postRegisterAjax);
        app.get('/logout', userController.getLogout);

        // app.get('/auth/facebook', coreHelper.passport('facebook').authenticate('facebook', {scope : ['public_profile', 'email']}));
        // app.get('/auth/facebook/callback', passport.authenticate('facebook', {successRedirect: '/profile', failureRedirect: '/'}));


        app.get("/product", productController.getIndex);
        // app.get("/chat", 'chat', chatController.getIndex);
        app.get("/chat", 'chat', useMiddleware.isAuthenticated, chatController.getIndex);
        app.post("/chat/content-chat", 'chat.change.content', chatController.postContentChat);
        app.post("/chat/list-contact", 'chat.list.contact', chatController.postListContact);


        // --------------------Test ------------------------------------------------
        app.get('/admin/user/:id', 'admin.user.edit', [useMiddleware.isAuthenticated], homeController.getIndex);
        // router.add('get', '/admin/user/:id', function() {
        //     var url = router.build('admin.user.edit', {id: 2}); // /admin/user/2
        // },{
        //     name: 'admin.user.edit'
        // });

        app.get("/param/:param1/:param2", function (requset, response) {
            // response.writeHead(200, {'Content-Type': 'text/html'});
            // fs.createReadStream(__dirname + '/../resources/layouts/master.ejs', 'utf-8').pipe(response);

            // fs.createReadStream(__dirname + '/../resources/view/apa.html', 'utf-8').pipe(response);
            var pa1 = requset.params.param1;
            var pa2 = requset.params.param2;
            var rs = `param1 / param2 => ${pa1} / ${pa2}`;
            // response.send(rs);
            console.log('FFFFFFFFFFFFFFFFFFFFFF ', rs);
            response.sendFile(coreHelper.paths.VIEWS + 'layouts/master.ejs', 'utf-8');
            // response.sendFile(coreHelper.paths.resolve(__dirname + '/../resources/layouts/master.ejs'), 'utf-8');
        });
        // --------------------End Test ------------------------------------------------


        // -----------------------------------S Angular 5-------------------------------------------
        let useMiddlewareAngular = coreHelper.callModule(`${coreHelper.paths.MIDDLEWARE}Authenticate.angular.js`, true);
        let useAuthenticateApiToken = coreHelper.callModule(`${coreHelper.paths.MIDDLEWARE}AuthenticateApiToken.js`, true);

        app.post("/api/login", 'api.login', [useMiddlewareAngular.authenticatedRegister], userController.postLoginAngular);
        app.post("/api/logout", 'api.logout', [useAuthenticateApiToken.verifyToken], userController.getLogoutAngular);

        app.get('/api/as', 'user', homeController.getIndex1);
        app.get('/api/chat', 'api.chat.index', [useAuthenticateApiToken.verifyToken, useMiddlewareAngular.isAuthenticated], chatController.getIndexAngular);
        app.post("/api/chat/content-chat", 'api.chat.content.chat', [useAuthenticateApiToken.verifyToken, useMiddlewareAngular.isAuthenticated], chatController.postApiContentChat);
        app.post("/api/chat/list-contact", 'api.chat.list.contact', [useAuthenticateApiToken.verifyToken, useMiddlewareAngular.isAuthenticated], chatController.postApiListContact);
        // -----------------------------------E Angular 5-------------------------------------------

        return router;
    }
}


module.exports = Routers;
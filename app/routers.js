'use strict';

class Routers {
    useRoutes(app, coreHelper) {
        let useMiddleware = coreHelper.callModule(`${coreHelper.paths.MIDDLEWARE}Authenticate.js`, true);

        let productController = coreHelper.callModule(`${coreHelper.paths.CONTROLLERS}ProductController.js`, true);
        let homeController = coreHelper.callModule(`${coreHelper.paths.CONTROLLERS}HomeController.js`, true);
        let chatController = coreHelper.callModule(`${coreHelper.paths.CONTROLLERS}ChatController.js`, true);
        let userController = coreHelper.callModule(`${coreHelper.paths.CONTROLLERS}UserController.js`, true);

        app.get("/", homeController.getIndex);

        app.get("/login", userController.getLogin);
        app.get("/forgot", userController.getForgot);
        app.get("/register", userController.getRegister);
        app.post("/signup", userController.postRegister);
        app.get("/product", productController.getIndex);

        app.get("/chat", useMiddleware.isAuthenticated, chatController.getIndex);
        app.post("/chat/content-chat", chatController.getContentChat);

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
        }).bind(coreHelper);
    }
}

module.exports = Routers;
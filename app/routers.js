'use strict';

var UserController = require('./controllers/UserController.js');
var ProductController = require('./controllers/ProductController.js');
var HomeController = require('./controllers/HomeController.js');

var userController = new UserController();
var productController = new ProductController;
var homeController = new HomeController;

class Routers {
    useRoutes(app, paths) {

        app.get("/", homeController.index);
        app.get("/login", userController.login);
        app.post("/register", userController.register);
        app.get("/product", productController.getIndex);

        app.get("/param/:param1/:param2", function (requset, response) {
            // response.writeHead(200, {'Content-Type': 'text/html'});
            // fs.createReadStream(__dirname + '/../resources/layouts/master.ejs', 'utf-8').pipe(response);

            // fs.createReadStream(__dirname + '/../resources/view/apa.html', 'utf-8').pipe(response);
            var pa1 = requset.params.param1;
            var pa2 = requset.params.param2;
            var rs = `param1 / param2 => ${pa1} / ${pa2}`;
            // response.send(rs);
            console.log('FFFFFFFFFFFFFFFFFFFFFF ', rs);
            response.sendFile(paths.VIEWS + 'layouts/master.ejs', 'utf-8');
            // response.sendFile(path.resolve(__dirname + '/../resources/layouts/master.ejs'), 'utf-8');
        }).bind(paths);
    }
}

module.exports = Routers;
var express = require('express');
var path = require('path');
var userRouter = express.Router();

var UserController = require('./controllers/UserController.js');
var ProductController = require('./controllers/ProductController.js');
var HomeController = require('./controllers/HomeController.js');

var userController = new UserController();
var productController = new ProductController;
var homeController = new HomeController;

userRouter.get("/", homeController.index);
userRouter.get("/users/login", userController.login);
userRouter.post("/users/register", userController.register);
userRouter.get("/product", productController.getIndex);



userRouter.get("/param/:param1/:param2", function (requset, response) {
    // response.writeHead(200, {'Content-Type': 'text/html'});
    // fs.createReadStream(__dirname + '/../resources/view/apa.html', 'utf-8').pipe(response);
    var pa1 = requset.params.param1;
    var pa2 = requset.params.param2;
    var rs = `param1 / param2 => ${pa1} / ${pa2}`;
    // response.send(rs);
    response.sendFile(path.resolve(__dirname + '/../resources/view/apa.html'), 'utf-8');
});


module.exports = userRouter;
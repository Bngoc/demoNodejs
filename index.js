const express = require('express');
// var app = express();

var CoreHelper = require('./config/CoreHelper.js');
var callCoreHelper = new CoreHelper();

callCoreHelper.createFileConfig(function (err, done) {
    if (err) {
        console.log('ERROR Run server ...', err);
    } else {

        // ------------- Run app ----------------------
        var runServer = callCoreHelper.runServer();

        callCoreHelper.runExpress();
        callCoreHelper.runRoutes();
        callCoreHelper.getConnect();
        callCoreHelper.connectKnex();

        callCoreHelper.runSocket(runServer);
    }
});

// const sampleConfig = require(`${paths.CONFIG}/config.json`);
// const sampleConfigRoutes = require(`${paths.APP}/routers.js`);
// const sampleConfigServer = require(`${paths.CONFIG}/server.js`);
// const sampleConfigRoutes = require(`${paths.APP}/routers.js`);


// var configServer = sampleConfigServer(samplePaths);


/*



 app.set('layouts engine', "ejs");
 app.use(express.static(__dirname + '/../public'));
 //app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
 app.set("layout", __dirname + '/../public/css');
 app.set("views",
 [
 path.join(__dirname, '/../resources/views/user'),
 path.join(__dirname, '/../resources/views/characters/'),
 path.join(__dirname, '/../resources/views/product/'),
 path.join(__dirname, '/../resources/views/layouts/'),
 path.resolve(__dirname + '/../resources/views'),
 ]);

 app.set('view options', {
 titleDocument: 'document nodejs',
 layout: false
 });

 app.use('/', userRouter);
 var server = http.createServer(app);
 var io = require('socket.io')(server);

 var nspIOTest = io.of('/!*');

 // nspIOTest.on('connection', function (socketTest) {
 //     console.log(`connection socketTest -  ${socketTest.id}`);
 // });
 //
 // nspIOTest.emit('messagensp', 'nspIOTest.broadcast connected!');

 // server listening for client
 io.on('connection', function (socket) {
 console.log(`connection -  ${socket.id}`);
 // chi thang phat ra => socket.emit
 socket.emit('message', {content: 'You are connected server private!', importance: '1', 'socketID': socket.id});

 // gui toan bo trong mang tru thang phat ra => socket.broadcast.emit
 //socket.broadcast.emit('message', 'Another client has just connected!' + socket.id);

 // all ==> io.sockets.emit
 io.sockets.emit('message', {content: 'You are connected -- all!', importance: '1', 'socketID': socket.id});

 socket.on('message', function (message) {
 console.log('A client is speaking to me! They’re saying: ' + message);
 });

 //disconnect socket by id
 socket.on('disconnect', function () {
 console.log(`disconnect -  ${socket.id}`);
 socket.emit('message', {content: 'bye bye!', importance: null, 'socketID': socket.id});
 });

 socket.on('send-data-test', function (datasocketAll) {
 ////private
 // socket.emit('send-data-test', 'send -= private' + datasocketAll + ' ' + socket.id);
 ////all
 // io.sockets.emit('send-data-test', 'send -= all' + datasocketAll + ' '  + socket.id);
 //// all / private
 // socket.broadcast.emit('send-data-test', 'send -= all / private ' + datasocketAll + ' ' + socket.id);
 //// io.to(socket.id).emit()
 });

 });

 var route, routes = [];

 app._router.stack.forEach(function(middleware){
 if(middleware.route){ // routes registered directly on the app
 routes.push(middleware.route);
 } else if(middleware.name === 'router'){ // router middleware
 middleware.handle.stack.forEach(function(handler){
 route = handler.route;
 route && routes.push(route);
 });
 }
 });


 // var server = http.createServer(function (requset, response) {
 //     response.writeHead(200, {'Content-Type': 'text/html'});
 //     fs.createReadStream(__dirname + '/../resources/layouts/master.ejs', 'utf-8').pipe(response);
 //
 // });
 server.listen(1230);

 // app.engine('html', require('hbs').__express);
 // app.set('views', __dirname+'/views/');
 // app.set('layouts engine', 'hbs');
 //
 // app.get('/', function(req, res) {
 //     res.render('main/index',{title :"page index"});
 // });*/

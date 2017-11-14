var express = require('express'),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    userRouter = require('./../app/routers.js');


var app = express();
app.set('view engine', "ejs");
app.use(express.static(__dirname + '/../public/'));
app.set("layout", __dirname + '/../public/css/');
app.set("views",
    [
        path.join(__dirname, '/../resources/views/user/'),
        path.join(__dirname, '/../resources/views/characters/'),
        path.join(__dirname, '/../resources/views/product/'),
        path.resolve(__dirname + '/../resources/views/')
    ]);

app.set('view options', {
    layout: false
});

app.set('i18n', 'off');
app.get('log dir', __dirname + '/../public/logs/');

app.use('/', userRouter);
var server = http.createServer(app);
var io = require('socket.io')(server);

var nspIOTest = io.of('/nspIOTest');

nspIOTest.on('connection', function (socketTest) {
    console.log(`connection socketTest -  ${socketTest.id}`);
});

nspIOTest.emit('messagensp', 'nspIOTest.broadcast connected!');

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


// var server = http.createServer(function (requset, response) {
//     response.writeHead(200, {'Content-Type': 'text/html'});
//     fs.createReadStream(__dirname + '/../resources/view/apa.html', 'utf-8').pipe(response);
//
// });
server.listen(1230);

// app.engine('html', require('hbs').__express);
// app.set('views', __dirname+'/views/');
// app.set('view engine', 'hbs');
//
// app.get('/', function(req, res) {
//     res.render('main/index',{title :"page index"});
// });
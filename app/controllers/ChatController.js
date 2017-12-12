'use strict';

// const socketIo = require('socket.io');
// const sharedSession = require("express-socket.io-session");
// var io;

const ViewController = require('./ViewController.js');
const helper = new ViewController();

var User = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}User.js`);
var Contacts = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Contacts.js`);
var BlockList = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}chat/BlockList.js`);
var Conversation = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}chat/Conversation.js`);
var DeletedConversations = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}chat/DeletedConversations.js`);
var DeletedMessages = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}chat/DeletedMessages.js`);
var Messages = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}chat/Messages.js`);
var Reports = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}chat/Reports.js`);

var BaseController = require('./BaseController.js');

const HEIGHT_BOX_CHAT_MAX = 130;
const HEIGHT_BOX_CHAT_MIN = 56;

class ChatController extends BaseController {

    getIndex(req, res, next) {

        var showResponse = helper;
        const aliasRouter = helper.coreHelper.aliasRouter();
        showResponse.header = showResponse.getHeader('CHAT');
        showResponse.cssInclude = showResponse.readFileInclude(['css/chat.custom.css', 'css/chat.test.css'], 'c');
        showResponse.title = 'Home chat';
        showResponse.isNotIncludeSidebar = true;
        showResponse.scriptInclude = showResponse.readFileInclude(['js/socket/client.js', 'js/socket/chat.js']);
        showResponse.renderViews = 'chat/index.ejs';

        let userCurrent = req.user;

        if (userCurrent) {
            var newUser = new User.class({});
            newUser.findByIdChat(userCurrent.attributes.id, function (err, rsData) {
                if (err) {
                    return next(err);
                }

                let notiContacts = rsData.infoAccount.relations.useContacts;

                showResponse.testData = rsData;

                let ioClone = helper.coreHelper.IO();
                ioClone.on('connection', function (socket) {
                    let conversation = [];
                    rsData.infoParticipant.forEach(function (element, indx) {
                        socket.join(element.channel_id);
                        conversation.push({
                            userCurrent: userCurrent.attributes.id,
                            type: element.type,
                            title: element.title,
                            channel_id: element.channel_id,
                            statusID: notiContacts.attributes.status,
                            statusName: helper.coreHelper.app.chatStatus[notiContacts.attributes.status],
                            listStatus: Object.values(helper.coreHelper.app.chatStatus).join(' ')
                        })
                    });

                    console.log(socket.adapter.rooms);

                    socket.broadcast.emit('testUser', conversation);
                    console.log(`\n-------------------------->>>>  ${JSON.stringify(socket.handshake.session)} \n`);
                });


                showResponse.userName = notiContacts ? notiContacts.attributes.middle_name : '';
                showResponse.userID = notiContacts ? notiContacts.attributes.id : '';
                showResponse.status = notiContacts ? helper.coreHelper.app.chatStatus[notiContacts.attributes.status] : '';
                showResponse.listStatus = helper.coreHelper.app.chatStatus;
                showResponse.urlUpdareStatus = aliasRouter.build('chat.change.status');


                // res.locals.listParticipants = infoParticipant ? infoParticipant : null;
                // req.session.listParticipants = infoParticipant ? infoParticipant : null;

                showResponse.listParticipant = rsData.infoParticipant ? rsData.infoParticipant : null;


                console.log('---------------------------------', helper.coreHelper.app.chatStatus[notiContacts.attributes.status]);

                showResponse.maxHeightBoxChat = HEIGHT_BOX_CHAT_MAX;
                showResponse.minHeightBoxChat = HEIGHT_BOX_CHAT_MIN;


                res.render(showResponse.renderViews, showResponse);
            });
        } else {
            res.redirect('/');
        }
    }

    postContentChat(req, res, next) {
        var showResponseChat = {};

        showResponseChat.maxHeightBoxChat = HEIGHT_BOX_CHAT_MAX;
        showResponseChat.minHeightBoxChat = HEIGHT_BOX_CHAT_MIN;
        showResponseChat.imgProfile = req.body.imgProfile;
        showResponseChat.userName = req.body.userName;
        showResponseChat.renderViews = 'chat/content.chat.ejs';

        // zender view before send data
        //{layout: 'ajax'}
        res.render(showResponseChat.renderViews, {data: showResponseChat, layout: false}, function (err, renderHtml) {
            if (err) {
                res.send(err);
            } else {
                var response = {
                    html: renderHtml,
                    err: err,
                };

                res.status(200).send(response);
            }
        });
    }

    postChangeStatus(req, res) {
        var responseAjax = {
            status: false,
            code: null,
            msg: ''
        };
        if (req.xhr) {
            let userCurrent = req.user;
            if (userCurrent) {
                var newContacts = new Contacts.class();
                var dataRequest = {
                    clause: {users_id: userCurrent.attributes.id},
                    dataUpdate: {status: parseInt(req.body.status)},
                };

                newContacts.updateContact(dataRequest, function (err, rsModel) {
                    if (err) {
                        responseAjax.code = err;
                    } else {
                        responseAjax.status = true;
                    }
                    res.status(200).send(responseAjax);
                });
            } else {
                responseAjax.code = 'ERR0001';
                responseAjax.msg = 'Account current is empty';
                res.status(200).send(responseAjax);
            }
        } else {
            responseAjax.code = 'ERR0000';
            res.status(500).send(responseAjax);
        }
    }

    socketIO(io) {
        io.on('connection', function (socket) {
            // console.log(socket);

            // var cookies = cookie.parse(socket.handshake.headers.cookie);
            // console.log(cookies);

            // var user = socket.handshake.session.user;


            // var userCurrent = express_session.req.user;
            // console.log('express_session.req.user', socket.request);

            // passport    = require('passport');
            // console.log(`\n______________________________________________>>>>  ${JSON.stringify(socket.handshake.session.user)} \n`);

            // if (userCurrent.length) {
            //     var newUser = new User.class({});
            //     newUser.findConversation(userCurrent.attributes.id, function (err, rsDataConversation) {
            //         if (err) rsDataConversation = {};
            //
            //         socket.broadcast.emit('sendListConversation', JSON.stringify(rsDataConversation));
            //     });
            // }

            // chi thang phat ra => socket.emit
            socket.emit('message', {
                content: 'You are connected server private!',
                importance: '1',
                'socketID': socket.id
            });

            // gui toan bo trong mang tru thang phat ra => socket.broadcast.emit
            //socket.broadcast.emit('message', 'Another client has just connected!' + socket.id);

            // all ==> io.sockets.emit
            io.sockets.emit('message', {
                content: 'You are connected -- all!',
                importance: '1',
                'socketID': socket.id
            });

            socket.on('message', function (message) {
                console.log('A client is speaking to me! They’re saying: ' + message);
            });

            //disconnect socket by id
            socket.on('disconnect', function () {
                console.log(`disconnect -  ${socket.id}`);
                socket.emit('message', {content: 'bye bye!', importance: null, 'socketID': socket.id});
            });

            socket.on('sendDataMsg', function (datasocketAll) {
                ////private
                socket.emit('sendDataPrivate', 'send -= private' + datasocketAll + '---' + socket.id);
                ////all
                // io.sockets.emit('send-data-test', 'send -= all' + datasocketAll + ' '  + socket.id);
                //// all / private
                socket.broadcast.emit('sendDataBroadCast', 'send -= all / private ' + datasocketAll + ' --- ' + socket.id);
                //// io.to(socket.id).emit()
            });

        });
    }
}

module.exports = ChatController;

'use strict';

// const socketIo = require('socket.io');
// const sharedSession = require("express-socket.io-session");
// var io;

const ViewController = require('./ViewController.js');
const helper = new ViewController();

const User = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Users.js`);
const Contacts = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Contacts.js`);
const BlockList = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}BlockList.js`);
const Conversation = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Conversation.js`);
const DeletedConversations = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}DeletedConversations.js`);
const DeletedMessages = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}DeletedMessages.js`);
const Messages = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Messages.js`);
const Reports = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Reports.js`);

var BaseController = require('./BaseController.js');

const HEIGHT_BOX_CHAT_MAX = 130;
const HEIGHT_BOX_CHAT_MIN = 56;
var socketIO = {};
var isIO = {};
let statusSingle = helper.coreHelper.app.participants[0];
const defaultImgSingleUser = "/images/users.png";
const defaultImgGroupUser = "/images/group.png";


class ChatController extends BaseController {

    getIndex(req, res, next) {
        try {
            var self = this;
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
                    let requestCurrent = {
                        userCurrentID: userCurrent.attributes.id,
                        statusID: notiContacts.attributes.status,
                        statusName: helper.coreHelper.app.chatStatus[notiContacts.attributes.status],
                        listStatus: Object.values(helper.coreHelper.app.chatStatus).join(' '),
                        statusSingle: statusSingle
                    };
                    req.session.requestCurrentStatus = requestCurrent;

                    var chatController = new ChatController();
                    chatController.convertDataListSocket(rsData.infoParticipant, requestCurrent, function (err, done) {
                        if (err) next(err);
                    });

                    showResponse.userName = notiContacts ? notiContacts.attributes.middle_name : '';
                    showResponse.userID = notiContacts ? notiContacts.attributes.id : '';
                    showResponse.status = notiContacts ? helper.coreHelper.app.chatStatus[notiContacts.attributes.status] : '';
                    showResponse.listStatus = helper.coreHelper.app.chatStatus;
                    showResponse.urlUpdareStatus = aliasRouter.build('chat.change.status');
                    showResponse.urlChangeContent = aliasRouter.build('chat.change.content');
                    showResponse.statusSingle = statusSingle;
                    showResponse.pathImgSingle = defaultImgSingleUser;
                    showResponse.pathImgGroup = defaultImgGroupUser;

                    // res.locals.listParticipants = infoParticipant ? infoParticipant : null;
                    // req.session.listParticipants = infoParticipant ? infoParticipant : null;

                    showResponse.listParticipant = rsData.infoParticipant ? rsData.infoParticipant : null;
                    showResponse.maxHeightBoxChat = HEIGHT_BOX_CHAT_MAX;
                    showResponse.minHeightBoxChat = HEIGHT_BOX_CHAT_MIN;


                    res.render(showResponse.renderViews, showResponse);
                });
            } else {
                res.redirect('/');
            }
        } catch (ex) {
            throw ex;
            console.log('ERROR TRY_CATCH CHAT INDEX');
        }
    }

    postContentChat(req, res, next) {
        var showResponseChat = {};

        showResponseChat.maxHeightBoxChat = HEIGHT_BOX_CHAT_MAX;
        showResponseChat.minHeightBoxChat = HEIGHT_BOX_CHAT_MIN;
        showResponseChat.imgProfile = req.body.imgProfile;
        showResponseChat.userName = req.body.userName;

        showResponseChat.renderViews = 'chat/content.chat.ejs';
        let userCurrent = req.user;

        if (parseInt(req.body.dataConversation) && userCurrent) {
            let conversation = new Conversation.class();
            let optionRequset = {
                id: parseInt(req.body.dataConversation),
                userCurrentID: userCurrent.attributes.id,
                userModel: User.model,
                statusSingle: statusSingle
            };

            conversation.conversationsListSingleUser(optionRequset, function (errPart, modelListUser) {
                if (errPart) next(err);

                let listUserParticipant = modelListUser.map(function (listUser) {
                    let listUserRelations = listUser.relations.parConversation;
                    return {usersId: listUser.get('users_id'), channelId: listUserRelations.get('channel_id')};
                });

                conversation.conversationsListUser(optionRequset, function (err, infoConversation) {
                    if (err) next(err);

                    infoConversation.forEach(function (elem) {
                        showResponseChat.dataType = elem.type;
                        showResponseChat.dataChannelId = elem.channel_id;
                        showResponseChat.dataOwerId = elem.creator_id;
                        showResponseChat.isCurrentOwerId = elem.creator_id == userCurrent.attributes.id;
                        showResponseChat.dataConversation = elem.idConversation;
                        showResponseChat.countParticipants = elem.count;
                        showResponseChat.isTypeSingle = showResponseChat.dataType == statusSingle;

                        let urlImagesAvatar = "";
                        let listParticipant = [];
                        if (showResponseChat.isTypeSingle) {
                            let eleSingle = elem.infoParticipant;
                            let useContactsSingle = eleSingle.relations.useContacts;
                            let indexFindUserSingle = listUserParticipant.findIndex(x => x.usersId == useContactsSingle.get('users_id'));
                            urlImagesAvatar = useContactsSingle.get('path_img') ? useContactsSingle.get('path_img') : defaultImgSingleUser;
                            let tempPartSingle = {
                                email: eleSingle.get('email'),
                                phone: eleSingle.get('phone'),
                                user_name: useContactsSingle.get('user_name'),
                                users_id: useContactsSingle.get('users_id'),
                                first_name: useContactsSingle.get('first_name'),
                                last_name: useContactsSingle.get('last_name'),
                                middle_name: useContactsSingle.get('middle_name'),
                                gender: useContactsSingle.get('gender'),
                                is_life: useContactsSingle.get('is_life'),
                                mood_message: useContactsSingle.get('mood_message'),
                                status: useContactsSingle.get('status'),
                                statusName: helper.coreHelper.app.chatStatus[useContactsSingle.get('status')],
                                strListStatus: Object.values(helper.coreHelper.app.chatStatus).join(' '),
                                isFriendCurrent: (indexFindUserSingle !== -1),
                                channelID: (indexFindUserSingle !== -1) ? listUserParticipant[indexFindUserSingle].channelId : null
                            };
                            listParticipant.push(tempPartSingle)
                        } else {
                            elem.infoParticipant.forEach(function (ele) {
                                let relationsUseContacts = ele.relations.useContacts;
                                let indexFindUser = listUserParticipant.findIndex(x => x.usersId == relationsUseContacts.get('users_id'));
                                urlImagesAvatar = relationsUseContacts.get('path_img_group') ? relationsUseContacts.get('path_img_group') : defaultImgGroupUser;
                                let tempPartGroup = {
                                    email: ele.get('email'),
                                    phone: ele.get('phone'),
                                    user_name: relationsUseContacts.get('user_name'),
                                    users_id: relationsUseContacts.get('users_id'),
                                    first_name: relationsUseContacts.get('first_name'),
                                    last_name: relationsUseContacts.get('last_name'),
                                    middle_name: relationsUseContacts.get('middle_name'),
                                    gender: relationsUseContacts.get('gender'),
                                    is_life: relationsUseContacts.get('is_life'),
                                    mood_message: relationsUseContacts.get('mood_message'),
                                    status: relationsUseContacts.get('status'),
                                    statusName: helper.coreHelper.app.chatStatus[relationsUseContacts.get('status')],
                                    strListStatus: Object.values(helper.coreHelper.app.chatStatus).join(' '),
                                    isFriendCurrent: (indexFindUser !== -1),
                                    channelID: (indexFindUser !== -1) ? listUserParticipant[indexFindUser].channelId : null
                                };
                                listParticipant.push(tempPartGroup);

                            });
                        }

                        showResponseChat.listParticipant = listParticipant;
                        showResponseChat.urlImagesAvatar = urlImagesAvatar;
                    });
                    // zender view before send data
                    //{layout: 'ajax'}
                    res.render(showResponseChat.renderViews, {
                        data: showResponseChat,
                        layout: false
                    }, function (err, renderHtml) {
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
                });
            });
        } else {
            res.status(500).send('ERR');
        }
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
                        res.status(200).send(responseAjax);
                    } else {
                        var newUser = new User.class({});
                        newUser.findByIdChat(userCurrent.attributes.id, function (err, rsData) {
                            if (err) {
                                responseAjax.code = err;
                                res.status(200).send(responseAjax);
                            } else {
                                let notiContacts = rsData.infoAccount.relations.useContacts;
                                let requestCurrent = {
                                    userCurrentID: userCurrent.attributes.id,
                                    statusID: notiContacts.attributes.status,
                                    statusName: helper.coreHelper.app.chatStatus[notiContacts.attributes.status],
                                    listStatus: Object.values(helper.coreHelper.app.chatStatus).join(' '),
                                    statusSingle: statusSingle
                                };
                                let chatController = new ChatController();

                                chatController.convertDataListSocket(rsData.infoParticipant, requestCurrent, function (err, done) {
                                    if (err) {
                                        responseAjax.code = err;
                                    }
                                    responseAjax.status = true;

                                    res.status(200).send(responseAjax);
                                });
                            }
                        });
                    }
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
        isIO = io;
        io.on('connection', function (socket) {
            socketIO = socket;


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

ChatController.prototype.convertDataListSocket = function (infoConversation, requestOption, callback) {
    // let conversation = [];
    infoConversation.forEach(function (element) {
        let conversationClone = {
            userCurrent: requestOption.userCurrentID,
            type: element.type,
            title: element.title,
            channel_id: element.channel_id,
            statusID: requestOption.statusID,
            statusName: requestOption.statusName,
            listStatus: requestOption.listStatus,
            isTypeSingle: element.type == requestOption.statusSingle
        };

        // conversation.push(conversationClone);
        // if (conversationClone.isTypeSingle) {
        socketIO.broadcast.to(element.channel_id).emit('listUserConversation', conversationClone);
        // socketIO.to(element.channel_id).emit('listUserConversation', conversationClone);
        // }
        socketIO.join(element.channel_id);
    });

    // console.log(socketIO.adapter.rooms, JSON.stringify(infoConversation));
    // socketIO.broadcast.emit('listUserConversation', conversation);
    // isIO.sockets.emit('listUserConversation', conversation);

    callback(null, true);
};

module.exports = ChatController;

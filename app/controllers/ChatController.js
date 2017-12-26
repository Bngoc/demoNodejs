'use strict';

//https://github.com/Automattic/kue
const kue = require('kue');
const queue = kue.createQueue();

const ViewController = require('./ViewController.js');
const helper = new ViewController();

const User = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Users.js`);
const Contacts = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Contacts.js`);
const BlockList = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}BlockList.js`);
const Conversation = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Conversation.js`);
// const DeletedConversations = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}DeletedConversations.js`);
// const DeletedMessages = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}DeletedMessages.js`);
const Messages = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Messages.js`);
const Reports = helper.coreHelper.callModule(`${helper.coreHelper.paths.MODELS}Reports.js`);
const libFunction = helper.coreHelper.callModule(`${helper.coreHelper.paths.LIB}LibFunction.js`, true);
var BaseController = require('./BaseController.js');

const HEIGHT_BOX_CHAT_MAX = 130;
const HEIGHT_INPUT_BOX_MAX = 100;
const HEIGHT_BOX_CHAT_MIN = 56;
const STATUS_SINGLE = helper.coreHelper.app.participants[0];
const IMG_SINGLE_USER = "/images/users.png";
const IMG_GROUP_USER = "/images/group.png";
const STATUS_HIDDEN_NAME = helper.coreHelper.app.chatStatus[4];
const STATUS_HIDDEN_NAME_REPLACE = helper.coreHelper.app.chatStatus[1];
const CLASS_UNDEFINED = 'undefined';
const MOOD_MESSAGE_REQUEST = 'User not share information';
const MOOD_MESSAGE_RESPONSIVE = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX';
var allClients = [];
var userStatus = [];
var messageType = helper.coreHelper.app.messageType;
var conversationType = helper.coreHelper.app.participants;
let typeMsgSwapKeyValue = libFunction.swap(messageType);
let typeConversationSwapKeyValue = libFunction.swap(conversationType);

class ChatController extends BaseController {

    getIndex(req, res, next) {
        try {
            var showResponse = helper;
            const aliasRouter = helper.coreHelper.aliasRouter();
            showResponse.header = showResponse.getHeader('CHAT');
            showResponse.cssInclude = showResponse.readFileInclude(['css/chat.custom.css', 'css/chat.test.css'], 'c');
            showResponse.title = 'Home chat';
            showResponse.isNotIncludeSidebar = true;
            showResponse.scriptInclude = showResponse.readFileInclude(['js/socket/client.js', 'js/socket/chat.js', "js/libCommonChat.js"]);
            showResponse.renderViews = 'chat/index.ejs';

            let userCurrent = req.user;
            if (userCurrent) {
                var newUser = new User.class({});
                newUser.findByIdChat(userCurrent.attributes.id, function (err, rsData) {
                    if (err) return next(err);

                    let notiContacts = rsData.infoAccount.relations.useContacts;
                    let requestCurrent = {
                        userCurrentID: userCurrent.attributes.id,
                        statusID: notiContacts.attributes.status,
                        statusName: helper.coreHelper.app.chatStatus[notiContacts.attributes.status],
                        listStatus: Object.values(helper.coreHelper.app.chatStatus).join(' '),
                        statusSingle: STATUS_SINGLE,
                        infoAccount: rsData.infoAccount
                    };
                    let statusUser = helper.coreHelper.app.chatStatus[notiContacts.attributes.status];

                    showResponse.userName = notiContacts ? notiContacts.attributes.middle_name : '';
                    showResponse.moodMessage = notiContacts ? notiContacts.attributes.mood_message : '';
                    showResponse.userID = notiContacts ? notiContacts.attributes.id : '';
                    showResponse.status = notiContacts ? statusUser : '';
                    showResponse.listStatus = helper.coreHelper.app.chatStatus;
                    showResponse.urlChangeContent = aliasRouter.build('chat.change.content');
                    showResponse.statusSingle = STATUS_SINGLE;
                    showResponse.pathImgSingle = IMG_SINGLE_USER;
                    showResponse.pathImgGroup = IMG_GROUP_USER;
                    showResponse.classStatusCurrent = (statusUser != STATUS_HIDDEN_NAME) ? statusUser : STATUS_HIDDEN_NAME_REPLACE;
                    showResponse.classUndefined = CLASS_UNDEFINED;
                    showResponse.classStatusHidden = STATUS_HIDDEN_NAME;
                    showResponse.classReplaceStatusHidden = STATUS_HIDDEN_NAME_REPLACE;

                    showResponse.listParticipant = rsData.infoParticipant ? rsData.infoParticipant : null;
                    showResponse.maxHeightBoxChat = HEIGHT_BOX_CHAT_MAX;
                    showResponse.maxHeightInputBoxChat = HEIGHT_INPUT_BOX_MAX;
                    showResponse.minHeightBoxChat = HEIGHT_BOX_CHAT_MIN;

                    // save session - share socket io
                    req.session.currentStatus = requestCurrent;
                    req.session.isLife = notiContacts ? (notiContacts.attributes.is_life == 1) : false;
                    req.session.infoParticipant = rsData.infoParticipant;

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
        let userCurrent = req.user;
        req.session.dataChannelID = null;

        try {
            showResponseChat.maxHeightBoxChat = HEIGHT_BOX_CHAT_MAX;
            showResponseChat.maxHeightInputBoxChat = HEIGHT_INPUT_BOX_MAX;
            showResponseChat.minHeightBoxChat = HEIGHT_BOX_CHAT_MIN;
            showResponseChat.userName = req.body.userName;
            showResponseChat.hexCodeId = userCurrent.attributes.id ? 'hex-' + userCurrent.attributes.id : null;

            if (parseInt(req.body.dataConversation) && userCurrent) {
                showResponseChat.renderViews = 'chat/content.chat.ejs';
                let conversation = new Conversation.class();
                let optionRequset = {
                    id: parseInt(req.body.dataConversation),
                    userCurrentID: userCurrent.attributes.id,
                    userModel: User.model,
                    statusSingle: STATUS_SINGLE
                };

                conversation.conversationsListSingleUser(optionRequset, function (errPart, modelListUser) {
                    if (errPart) return next(errPart);

                    let listUserParticipant = modelListUser.map(function (listUser) {
                        let listUserRelations = listUser.relations.parConversation;
                        return {
                            codePartId: listUser.get('id'),
                            usersId: listUser.get('users_id'),
                            is_accept_single: listUser.get('is_accept_single'),
                            is_accept_group: listUser.get('is_accept_group'),
                            channelId: listUserRelations.get('channel_id'),
                            conversationID: listUser.get('conversation_id')
                        };
                    });

                    conversation.conversationsListUser(optionRequset, function (err, infoConversation) {
                        if (err) return next(err);

                        infoConversation.forEach(function (elem) {
                            showResponseChat.dataType = elem.type;
                            showResponseChat.dataChannelId = elem.channel_id;
                            showResponseChat.dataOwnerId = elem.creator_id;
                            showResponseChat.isCurrentOwnerId = elem.creator_id == userCurrent.attributes.id;
                            showResponseChat.dataConversation = elem.idConversation;
                            showResponseChat.countParticipants = elem.count;
                            showResponseChat.isTypeSingle = showResponseChat.dataType == STATUS_SINGLE;
                            showResponseChat.is_accept = elem.is_accept_single;
                            showResponseChat.hiddenStatusName = STATUS_HIDDEN_NAME;
                            showResponseChat.replaceStatusName = STATUS_HIDDEN_NAME_REPLACE;

                            let urlImagesAvatar = "";
                            let listParticipant = [];
                            if (showResponseChat.isTypeSingle) {
                                let eleSingle = elem.infoParticipant;
                                let useContactsSingle = eleSingle.relations.useContacts;
                                let indexFindUserSingle = listUserParticipant.findIndex(x => x.usersId == useContactsSingle.get('users_id'));
                                let booleanFindUserSingle = (indexFindUserSingle !== -1);
                                let moodMessageTemp = "";
                                let tempClassStatus = "";
                                let tempChatStatusName = helper.coreHelper.app.chatStatus[useContactsSingle.get('status')];
                                if (elem.is_accept_single) {
                                    moodMessageTemp = showResponseChat.isCurrentOwnerId ? MOOD_MESSAGE_REQUEST : MOOD_MESSAGE_RESPONSIVE;
                                    tempClassStatus = CLASS_UNDEFINED;
                                } else {
                                    if (useContactsSingle.get('mood_message')) {
                                        moodMessageTemp = useContactsSingle.get('mood_message');
                                    } else {
                                        moodMessageTemp = (tempChatStatusName == STATUS_HIDDEN_NAME) ? STATUS_HIDDEN_NAME_REPLACE : tempChatStatusName;
                                    }
                                    tempClassStatus = (tempChatStatusName == STATUS_HIDDEN_NAME) ? STATUS_HIDDEN_NAME_REPLACE : tempChatStatusName;
                                }

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
                                    statusName: tempChatStatusName,
                                    strListStatus: Object.values(helper.coreHelper.app.chatStatus).join(' '),
                                    isFriendCurrent: booleanFindUserSingle ? (listUserParticipant[indexFindUserSingle].is_accept_single != 1) : false,
                                    channelID: booleanFindUserSingle ? listUserParticipant[indexFindUserSingle].channelId : null,
                                    conversationID: booleanFindUserSingle ? listUserParticipant[indexFindUserSingle].conversationID : null,
                                    moodMessageShow: moodMessageTemp,
                                    classStatus: tempClassStatus,
                                    codePartId: booleanFindUserSingle ? listUserParticipant[indexFindUserSingle].codePartId : null,
                                };

                                showResponseChat.isFriendCurrentSingle = tempPartSingle.isFriendCurrent;
                                listParticipant.push(tempPartSingle);
                                urlImagesAvatar = useContactsSingle.get('path_img') ? useContactsSingle.get('path_img') : IMG_SINGLE_USER;
                            } else {
                                elem.infoParticipant.forEach(function (ele) {
                                    let relationsUseContacts = ele.relations.useContacts;
                                    let indexFindUser = listUserParticipant.findIndex(x => x.usersId == relationsUseContacts.get('users_id'));
                                    let booleanFindUser = (indexFindUser !== -1);
                                    let tempChatStatusGroupName = helper.coreHelper.app.chatStatus[relationsUseContacts.get('status')];
                                    let tempClassStatusGroup = "";
                                    let tempMoodMessageGroup = "";
                                    let isFriendCurrent = booleanFindUser ? (listUserParticipant[indexFindUser].is_accept_single != 1) : false;

                                    if (booleanFindUser) {
                                        if (relationsUseContacts.get('mood_message')) {
                                            tempMoodMessageGroup = relationsUseContacts.get('mood_message');
                                        } else {
                                            tempMoodMessageGroup = (tempChatStatusGroupName == STATUS_HIDDEN_NAME) ? STATUS_HIDDEN_NAME_REPLACE : tempChatStatusGroupName;
                                        }
                                        tempClassStatusGroup = isFriendCurrent ? ((tempChatStatusGroupName == STATUS_HIDDEN_NAME) ? STATUS_HIDDEN_NAME_REPLACE : tempChatStatusGroupName) : CLASS_UNDEFINED;
                                    } else {
                                        tempMoodMessageGroup = showResponseChat.isCurrentOwnerId ? MOOD_MESSAGE_REQUEST : MOOD_MESSAGE_RESPONSIVE;
                                        tempClassStatusGroup = CLASS_UNDEFINED;
                                    }

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
                                        statusName: tempChatStatusGroupName,
                                        strListStatus: Object.values(helper.coreHelper.app.chatStatus).join(' '),
                                        isFriendCurrent: isFriendCurrent,
                                        channelID: booleanFindUser ? listUserParticipant[indexFindUser].channelId : null,
                                        conversationID: booleanFindUser ? listUserParticipant[indexFindUser].conversationID : null,
                                        moodMessageShow: tempMoodMessageGroup,
                                        classStatus: tempClassStatusGroup,
                                        codePartId: booleanFindUser ? listUserParticipant[indexFindUser].codePartId : null,
                                    };
                                    listParticipant.push(tempPartGroup);
                                    urlImagesAvatar = relationsUseContacts.get('path_img_group') ? relationsUseContacts.get('path_img_group') : IMG_GROUP_USER;
                                });
                                showResponseChat.isFriendCurrentSingle = true;
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
            } else if ((req.body.dataConversation === "") && parseInt(req.body.valAuthor) && userCurrent) {
                // NOT FRIEND AND NOT REQUEST
                showResponseChat.renderViews = 'chat/request.chat.ejs';
                let user = new User.class();

                user.findUserFullById(parseInt(req.body.valAuthor), function (err, modelUser) {
                    if (err) return next(err);

                    let useContacts = modelUser.relations.useContacts;
                    showResponseChat.infoParticipant = modelUser;
                    showResponseChat.classStatus = CLASS_UNDEFINED;
                    showResponseChat.moodMessageShow = MOOD_MESSAGE_REQUEST;
                    showResponseChat.urlImagesAvatar = useContacts.get('path_img') ? useContacts.get('path_img') : IMG_SINGLE_USER;

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
            } else {
                res.status(500).send('ERR');
            }
        } catch (ex) {
            res.status(500).send('ERR');
        }
    }

    socketConnection(io) {
        var s60 = 1000 * 60 * 1;
        io.on('connection', function (socket) {
            io.sockets.emit('send-data-test', socket.id);
            var reconnection = true,
                reconnectionDelay = 5000,
                reconnectionTry = 0;

            let chatController = new ChatController();
            let userCurrent = chatController.getSessionByName(socket, 'passport');
            chatController.setSessionByName(socket, 'isActiveCurrent', userCurrent.user ? userCurrent.user : null);
            socket.isActiveLoadPageCurrent = userCurrent.user ? userCurrent.user : null;
            // allClients.push(socket.id);

            if (userCurrent) {
                userStatus.push({'isCheck': true, 'user_id': userCurrent.user});

                let chatController = new ChatController();
                let newContacts = new Contacts.class();
                let newUser = new User.class();
                let currentStatus = chatController.getSessionByName(socket, 'currentStatus');
                let infoParticipant = chatController.getSessionByName(socket, 'infoParticipant');
                if (currentStatus && infoParticipant) {
                    let reqListRooms = infoParticipant.map(function (getRoomId) {
                        return getRoomId.channel_id;
                    });
                    chatController.setSessionByName(socket, 'listRooms', reqListRooms);

                    chatController.convertDataListSocket(socket, infoParticipant, currentStatus);
                    chatController.deleteSessionByName(socket, 'infoParticipant');

                    if (!chatController.getSessionByName(socket, 'isLife')) {
                        var dataRequest = {
                            clause: {users_id: socket.users_id},
                            dataUpdate: {
                                is_life: 1
                            },
                        };
                        chatController.queueUpdateContact(socket, dataRequest, currentStatus);
                        chatController.updateSessionByName(socket, 'isLife', true);
                    }
                }

                socket.on('msgContentChat', function (reqData) {
                    let conversationId = reqData.data.dataConversation ? parseInt(reqData.data.dataConversation) : null;
                    if (conversationId) {
                        let message = new Messages.class();
                        let requestMessage = {
                            id: conversationId,
                            limit: 200,
                            userCurrentID: userCurrent.user
                        };

                        message.getMessageConversation(requestMessage, function (errMessage, modelMessage) {

                            if (errMessage) {
                                return 1;
                            } else {
                                if (modelMessage.length) {
                                    process.nextTick(function () {
                                        let resModelMessage = {};
                                        resModelMessage.inversTypeMsg = typeMsgSwapKeyValue;
                                        resModelMessage.inversTypeGuid = typeConversationSwapKeyValue;
                                        // resModelMessage.data = modelMessage.toJSON();

                                        resModelMessage.option = {
                                            userCurrentId: userCurrent.user,
                                            isLoad: false
                                        };
                                        let lengthModel = modelMessage.length;
                                        let resultListMessage = [];
                                        let listMessage = {};
                                        let listMsgTemp = [];

                                        modelMessage.forEach(function (element, index) {
                                            let isUserFuture = ((index + 1) >= lengthModel) ? false : (modelMessage.models[(index + 1)].attributes.sender_id === element.attributes.sender_id);

                                            if (isUserFuture === false) {
                                                listMsgTemp.push(element.attributes);

                                                listMessage.data = listMsgTemp;
                                                listMessage.contactMessage = element.relations.contactMessage.toJSON();
                                                listMessage.isSingle = (typeConversationSwapKeyValue[reqData.data.dataType] == 0);
                                                listMessage.isUserCurrent = (element.attributes.sender_id == userCurrent.user);
                                                resultListMessage.push(listMessage);
                                                listMsgTemp = [];
                                                listMessage = {};

                                            } else {
                                                listMsgTemp.push(element.attributes);
                                            }
                                        });
                                        resModelMessage.listMsg = resultListMessage;
                                        socket.emit('msgContent', resModelMessage);
                                    });
                                } else {

                                }
                            }
                        });
                    }
                });


                socket.on('updateUser', function (reqData) {

                    var dataRequest = {
                        clause: {users_id: currentStatus.userCurrentID},
                        dataUpdate: {
                            status: parseInt(reqData.data.status)
                            // is_life: parseInt(reqData.data.status) == defaultStatusHidden ? 0 : undefined
                        },
                    };
                    chatController.queueUpdateContact(socket, dataRequest, currentStatus);
                });

                socket.on('sendDataMsg', function (dataSendChat) {
                    if (dataSendChat) {

                        dataSendChat.channelId = dataSendChat.dataChannel;
                        dataSendChat.valueMsg = dataSendChat.dataValueMsg;

                        socket.emit('sendDataPrivate', dataSendChat);

                        if (dataSendChat.dataChannel) {
                            socket.broadcast.to(dataSendChat.dataChannel).emit('sendDataBroadCast', dataSendChat);
                        }
                    }
                });


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


                // var interval_obj = setInterval(function () {
                //     isReconnectionOn = socket.connected;
                //     // clearInterval(interval_obj);
                //     console.log("10x________________________", userCurrent, isReconnectionOn);
                // }, 10000);

                console.log('xxxxxxxxxxxxxx -> ', JSON.stringify(socket.handshake.session), socket.isActiveLoadPageCurrent);

                let s60Revert = setTimeout(function () {
                    if (socket.isActiveLoadPageCurrent) {
                        socket.isActiveLoadPageCurrent = null;

                        console.log('com..................', socket.isActiveLoadPageCurrent);

                        var dataRequest = {
                            clause: {users_id: socket.users_id},
                            dataUpdate: {
                                status: 2
                            }
                        };

                        chatController.queueUpdateContact(socket, dataRequest, chatController.getSessionByName(socket, 'currentStatus'));
                        io.sockets.emit('expiresTime60', "het 1 minute");
                    }
                }, s60);

                // 3s
                socket.on('pingServer', (data) => {
                    clearTimeout(s60Revert);
                });

                socket.on('pong', (data) => {
                    // if (socket.isActiveLoadPageCurrent)
                    // if (gh)
                    //     io.emit('ping', userCurrent);

                    // socket.isActiveLoadPageCurrent = userCurrent.user;
                });

                // // 30 minutine - reload page
                // setTimeout(function () {
                //     if (socket.isActiveLoadPageCurrent) {
                //         socket.isActiveLoadPageCurrent = null;
                //         console.log('com...xxxx..................', socket.isActiveLoadPageCurrent);
                //         // io.sockets.emit('reload', {});
                //         socket.emit('expiresTime60', "het 30 minute");
                //     }
                // }, 1000 * 60 * 30);


                setInterval(function () {


                    socket.emit('expiresTime60', "--------test------- 3s -> " + socket.isActiveLoadPageCurrent);
                }, 3000)

            }

            //disconnect socket by id
            socket.on('disconnect', function () {
                let indexSocketIDDisconnect = allClients.indexOf(socket);
                // allClients.splice(indexSocketIDDisconnect, 1);

                // let isReconnectionOff = socket.connected;
                // var interval_obj = setInterval(function () {
                //     isReconnectionOff = false
                //     clearInterval(interval_obj);
                //     console.log("8x________________________", userCurrent, isReconnectionOff);
                // }, 8000);
                //
                // let isReconnectionOffEnd = true;
                // var intervalObjEnd = setInterval(function () {
                //     isReconnectionOffEnd = false;
                //     clearInterval(intervalObjEnd);
                //     console.log("12x________________________", userCurrent, isReconnectionOffEnd);
                // }, 12000);

                // setTimeout(function () {
                //     let isReconnection = isReconnectionOn ? true : isReconnectionOffEnd;
                //     console.log('_______15s_________________', userCurrent, isReconnection);
                //     // socket.disconnect();
                // }, 15000);

                // if (reconnection === true) {
                //     setTimeout(function () {
                //         reconnection = false;
                //     }, reconnectionDelay);
                // }

                // setTimeout(function () {
                //     if (socket.isActiveCurrent) {
                //         // chatController.deleteSessionByName(socket, 'isActiveCurrent');
                //         socket.isActiveLoadPageCurrent = null;
                //         console.log('--------------------------------11111111111111', socket.isActiveLoadPageCurrent);
                //
                //     }
                // }, 180000);

                console.log('18S --------------------------------', socket.isActiveLoadPageCurrent);


                // let indexSocketIdConnect = allClients.indexOf(socket.id);
                // if (indexSocketIdConnect !== -1)
                //     allClients.splice(indexSocketIdConnect, 1);
                // console.log('xxxxxxxxxxxxxx ----> ', indexSocketIdConnect, JSON.stringify(allClients));

                if (socket.isActiveCurrent == null) {
                    if (userCurrent) {

                        var dataRequest = {
                            clause: {users_id: socket.users_id},
                            dataUpdate: {
                                is_life: 0
                            },
                            milliSecond: 1000,
                            updateLastMinute: 2
                        };

                        // chatController.queueUpdateContact(socket, dataRequest, chatController.getSessionByName(socket, 'currentStatus'));
                        socket.emit('reload', {});
                    }
                }
                console.log(`disconnect ----------------------------------------  ${socket.id}`);
                socket.emit('messageDisconnect', {content: 'bye bye!', importance: null, 'socketID': socket.id});


                // // logout
                // if (chatController.getSessionByName(socket, 'isLogout') === true) {
                //     console.log('logout');
                // }

            });

        });
    }
}

ChatController.prototype.getSessionUser = function (socket) {
    return socket.handshake.session ? socket.handshake.session : false;
};

ChatController.prototype.getSessionByName = function (socket, nameSession) {
    let resultSession = false;
    if (nameSession) {
        let sessionByName = socket.handshake.session[nameSession] ? socket.handshake.session[nameSession] : false;
        if (sessionByName) {
            resultSession = socket.handshake.session[nameSession];
        }
    }

    return resultSession;
};

ChatController.prototype.setSessionByName = function (socket, nameSession, dataSave) {
    let resultSession = false;
    if (nameSession) {
        // let sessionByName = socket.handshake.session[nameSession] ? socket.handshake.session[nameSession] : false;
        // if (sessionByName) {
        socket.handshake.session[nameSession] = dataSave;
        socket.handshake.session.save();
        resultSession = true;
        // }
    }

    return resultSession;
};

ChatController.prototype.saveSessionByName = function (socket, nameSession, dataSave) {
    let resultSession = false;
    if (nameSession) {
        let sessionByName = socket.handshake.session[nameSession] ? socket.handshake.session[nameSession] : false;
        if (sessionByName) {
            socket.handshake.session[nameSession] = dataSave;
            socket.handshake.session.save();
            resultSession = true;
        }
    }

    return resultSession;
};

ChatController.prototype.deleteSessionByName = function (socket, nameSession) {
    let resultDelete = false;
    if (nameSession) {
        let sessionByName = socket.handshake.session[nameSession] ? socket.handshake.session[nameSession] : false;
        if (sessionByName) {
            delete socket.handshake.session[nameSession];
            socket.handshake.session.save();
            resultDelete = true;
        }
    }

    return resultDelete;
};

ChatController.prototype.updateSessionByName = function (socket, nameSession, dataUpdate) {
    let resultDelete = false;
    if (nameSession) {
        let sessionByName = socket.handshake.session[nameSession] ? socket.handshake.session[nameSession] : false;
        if (sessionByName) {
            socket.handshake.session[nameSession] = dataUpdate;
            socket.handshake.session.save();
            resultDelete = true;
        }
    }

    return resultDelete;
};

ChatController.prototype.convertDataListSocket = function (socket, infoConversation, requestOption) {
    try {
        // let reqListRooms = infoConversation.map(function (getRoomId) {
        //     return getRoomId.channel_id;
        // });
        // let sendBroadcastRoom = [];
        // let listRooms = socket.adapter.rooms;
        // for (var idRoom in listRooms) {
        //     if (reqListRooms.includes(idRoom)) {
        //         let room = listRooms[idRoom]['sockets'];
        //         for (var socketId in room) {
        //             if (socketId != socket.id) {
        //                 if (!sendBroadcastRoom.includes(socketId)) sendBroadcastRoom.push(socketId);
        //             }
        //         }
        //     }
        // }

        socket.users_id = requestOption.userCurrentID;
        infoConversation.forEach(function (element) {
            let conversationClone = {
                userCurrent: requestOption.userCurrentID,
                type: element.type,
                title: element.title,
                channel_id: element.channel_id,
                statusID: requestOption.statusID,
                statusName: requestOption.statusName,
                listStatus: requestOption.listStatus,
                isTypeSingle: element.type == requestOption.statusSingle,
                classCurrentStatus: requestOption.classCurrentStatus
            };

            socket.join(element.channel_id);
            // C1
            socket.broadcast.to(element.channel_id).emit('listUserConversation', conversationClone);
            // C2
            // socket.broadcast.in(sendBroadcastRoom).emit('listUserConversation', conversationClone);
        });

        // console.log('________', JSON.stringify(socket.adapter.rooms));
        // console.log('sendBroadcastRoom ________', JSON.stringify(sendBroadcastRoom));
        // socket.broadcast.emit('listUserConversation', conversation);

        return true;
    } catch (ex) {
        return false;
    }
};

ChatController.prototype.updateUserListSocket = function (socket, dataRequest, currentStatus, done) {
    let responsiveData = {
        code: null,
        msg: '',
        data: {},
        status: false
    };

    try {
        let newContacts = new Contacts.class();
        let newUser = new User.class();
        let chatController = new ChatController();

        newContacts.updateContact(dataRequest, function (err, rsModel) {
            if (err) {
                responsiveData['msg'] = err;
                responsiveData['code'] = 'ERR0002';
                done(err, responsiveData);
            } else {
                newUser.findByIdChat(currentStatus.userCurrentID, function (err, modelData) {
                    if (err) {
                        responsiveData['msg'] = err;
                        responsiveData['code'] = 'ERR0002';
                        done(err, responsiveData);
                    } else {
                        let notiContacts = modelData.infoAccount.relations.useContacts;
                        let updateStatusCurrent = helper.coreHelper.app.chatStatus[notiContacts.attributes.status];
                        let requestCurrent = {
                            userCurrentID: currentStatus.userCurrentID,
                            statusID: notiContacts.attributes.status,
                            statusName: updateStatusCurrent,
                            listStatus: Object.values(helper.coreHelper.app.chatStatus).join(' '),
                            statusSingle: STATUS_SINGLE,
                            classCurrentStatus: (dataRequest.dataUpdate.is_life == 0 || (STATUS_HIDDEN_NAME == updateStatusCurrent) ? STATUS_HIDDEN_NAME_REPLACE : updateStatusCurrent),
                            classCurrentStatusPrivate: (STATUS_HIDDEN_NAME == updateStatusCurrent) ? STATUS_HIDDEN_NAME_REPLACE : updateStatusCurrent,
                        };

                        let isStatus = chatController.convertDataListSocket(socket, modelData.infoParticipant, requestCurrent);
                        responsiveData['msg'] = !isStatus ? 'Done' : responsiveData['msg'];
                        responsiveData['code'] = !isStatus ? 'ERR0003' : responsiveData['code'];
                        responsiveData['status'] = isStatus;
                        responsiveData['data'] = {
                            statusName: requestCurrent.statusName,
                            listStatus: requestCurrent.listStatus,
                            classCurrentStatus: requestCurrent.classCurrentStatusPrivate
                        };

                        socket.emit('resUpdateUserPrivate', responsiveData);
                        // chatController.updateSessionByName(socket, 'currentStatus', []);

                        done(null, responsiveData);
                    }
                });
            }
        });
    } catch (ex) {
        responsiveData['code'] = 'ERR0001';
        responsiveData['msg'] = 'Request Error';
        socket.emit('resUpdateUserPrivate', responsiveData);
        done(ex, responsiveData);
    }
};

ChatController.prototype.queueUpdateContact = function (socket, dataRequest, currentStatus) {
    var chatController = new ChatController();
    let milliSeconds = dataRequest.milliSecond ? dataRequest.milliSecond : 1;
    let updateLastMinute = dataRequest.updateLastMinute ? (parseInt(dataRequest.updateLastMinute) * 60) : 0;

    let newJob = {
        dataRequest: dataRequest,
        currentStatus: currentStatus
    };
    // setTimeout(function () {
    queue.create('updateContact', newJob).priority('high').attempts(5).save(function (err) {
        if (!err) return queue.id + ' - updateContact';
    }).on('updateContact complete', function (id, result) {
        kue.Job.get(id, function (err, job) {
            if (err) return;
            job.remove(function (err) {
                if (err) throw err;
                console.log('removed completed job #%d', job.id);
            });
        });
    });

    queue.process('updateContact', function (job, done) {
        chatController.updateUserListSocket(socket, job.data.dataRequest, job.data.currentStatus, function (err, resultData) {
            if (err) console.log('NOT UPDATE USER', err)
        });
    });
    // }, updateLastMinute);
}


kue.Job.rangeByState('complete', 0, 0, 'asc', function (err, jobs) {
    jobs.forEach(function (job) {
        job.remove(function () {
            console.log('removed ', job.id);
        });
    });
});

module.exports = ChatController;

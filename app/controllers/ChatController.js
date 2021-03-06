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


//config chat
const PAGE_SIZE_NUMBER = 10;
const HEIGHT_BOX_CHAT_MAX = 130;
const HEIGHT_INPUT_BOX_MAX = 100;
const HEIGHT_BOX_CHAT_MIN = 56;

const chatStatus = helper.coreHelper.app.chatStatus;
const messageType = helper.coreHelper.app.messageType;
const conversationType = helper.coreHelper.app.participants;
const cfgChat = helper.coreHelper.app.cfg_chat;
const typeMsgSwapKeyValue = libFunction.swap(messageType);
// const typeConversationSwapKeyValue = libFunction.swap(conversationType);

class ChatController extends BaseController {

    getIndex(req, res, next) {
        try {
            let chatController = new ChatController();
            var showResponse = helper;
            const aliasRouter = helper.coreHelper.aliasRouter();
            showResponse.header = showResponse.getHeader('CHAT');
            showResponse.cssInclude = showResponse.readFileInclude(['css/chat.custom.css', 'css/chat.test.css'], 'c');
            showResponse.title = 'Home chat';
            showResponse.isNotIncludeSidebar = true;
            showResponse.scriptInclude = showResponse.readFileInclude([
                "js/support/menu-info-chat.js",
                "js/support/libCommonChat.js",
                "js/support/listContacts.js",
                'js/socket/client.js',
                'js/socket/chat.js'
            ]);
            showResponse.renderViews = 'chat/index.ejs';

            let userCurrent = req.user;
            if (userCurrent) {
                let requestSql = {
                    userCurrentID: userCurrent.attributes.id,
                    conversationType: Object.keys(conversationType).map(function (k) {
                        return conversationType[k]
                    })
                };
                var newUser = new User.class({});
                newUser.findByIdChat(requestSql, function (err, rsData) {
                    if (err) return next(err);

                    let notiContacts = rsData.infoAccount.relations.useContacts;
                    let requestCurrent = {
                        userCurrentID: userCurrent.attributes.id,
                        statusID: notiContacts.attributes.status,
                        statusName: chatStatus[notiContacts.attributes.status],
                        listStatus: Object.values(chatStatus).join(' '),
                        statusSingle: cfgChat.status_single,
                        infoAccount: rsData.infoAccount
                    };
                    let statusUser = chatStatus[notiContacts.attributes.status];

                    showResponse.userName = notiContacts ? notiContacts.attributes.middle_name : '';
                    showResponse.classStatusCurrent = (statusUser != cfgChat.status_hidden_name) ? statusUser : cfgChat.status_hidden_name_replace;
                    showResponse.moodMessage = notiContacts ? notiContacts.attributes.mood_message : '';
                    showResponse.userID = notiContacts ? notiContacts.attributes.id : '';
                    showResponse.status = notiContacts ? statusUser : '';
                    showResponse.listStatus = chatStatus;
                    showResponse.urlChangeContent = aliasRouter.build('chat.change.content');

                    let option = {
                        isSearch: false,
                        valSearch: null,
                        cfg_chat: helper.coreHelper.app
                    };
                    showResponse.dataContactList = JSON.stringify(libFunction.renderContactListAll(rsData.infoParticipant, option), true);

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
            showResponseChat.page = 1;
            showResponseChat.userName = req.body.userName;
            showResponseChat.hexCodeId = userCurrent.attributes.id ? 'hex-' + userCurrent.attributes.id : null;
            // let chatController = new ChatController();

            if (parseInt(req.body.dataConversation) && userCurrent) {
                showResponseChat.renderViews = 'chat/content.chat.ejs';
                let conversation = new Conversation.class();
                let optionRequest = {
                    id: parseInt(req.body.dataConversation),
                    userCurrentID: userCurrent.attributes.id,
                    userModel: User.model,
                    statusSingle: cfgChat.status_single
                };

                conversation.conversationsListSingleUser(optionRequest, function (errPart, modelListUser) {
                    if (errPart) return next(errPart);

                    let listUserParticipant = modelListUser.map(function (listUser) {
                        return {
                            codePartId: listUser.get('id'),
                            usersId: listUser.get('users_id'),
                            is_accept_single: listUser.get('is_accept_single'),
                            is_accept_group: listUser.get('is_accept_group'),
                            channelId: listUser.relations.parConversation.get('channel_id'),
                            conversationID: listUser.get('conversation_id')
                        };
                    });

                    conversation.conversationsListUser(optionRequest, function (err, infoConversation) {
                        if (err) return next(err);

                        infoConversation.forEach(function (elem) {
                            showResponseChat.dataType = elem.type;
                            showResponseChat.dataChannelId = elem.channel_id;
                            showResponseChat.dataOwnerId = elem.creator_id;
                            showResponseChat.isCurrentOwnerId = elem.creator_id == userCurrent.attributes.id;
                            showResponseChat.dataConversation = elem.idConversation;
                            showResponseChat.countParticipants = elem.count;
                            showResponseChat.isTypeSingle = showResponseChat.dataType == cfgChat.status_single;
                            showResponseChat.is_accept = elem.is_accept_single;
                            showResponseChat.hiddenStatusName = cfgChat.status_hidden_name;
                            showResponseChat.replaceStatusName = cfgChat.status_hidden_name_replace;

                            let urlImagesAvatar = "";
                            let listParticipant = [];
                            if (showResponseChat.isTypeSingle) {
                                let eleSingle = elem.infoParticipant;
                                let useContactsSingle = eleSingle.relations.useContacts;
                                let indexFindUserSingle = listUserParticipant.findIndex(x => x.usersId == useContactsSingle.get('users_id'));
                                let moodMessageTemp = "";
                                let tempClassStatus = "";
                                let tempChatStatusName = chatStatus[useContactsSingle.get('status')];
                                if (elem.is_accept_single) {
                                    moodMessageTemp = showResponseChat.isCurrentOwnerId ? cfgChat.mood_message_request : cfgChat.mood_message_responsive;
                                    tempClassStatus = cfgChat.class_undefined;
                                } else {
                                    if (useContactsSingle.get('mood_message')) {
                                        moodMessageTemp = useContactsSingle.get('mood_message');
                                    } else {
                                        moodMessageTemp = (tempChatStatusName == cfgChat.status_hidden_name) ? cfgChat.status_hidden_name_replace : tempChatStatusName;
                                    }
                                    tempClassStatus = (tempChatStatusName == cfgChat.status_hidden_name) ? cfgChat.status_hidden_name_replace : tempChatStatusName;
                                }
                                let optionRender = {
                                    eleSingle: eleSingle,
                                    strListStatus: Object.values(chatStatus).join(' '),
                                    moodMessageTemp: moodMessageTemp,
                                    tempClassStatus: tempClassStatus,
                                    indexFindUserSingle: indexFindUserSingle,
                                    tempChatStatusName: tempChatStatusName
                                };
                                let tempPartSingle = libFunction.renderDataContentChat(useContactsSingle, listUserParticipant, optionRender);

                                showResponseChat.isFriendCurrentSingle = tempPartSingle.isFriendCurrent;
                                listParticipant.push(tempPartSingle);
                                urlImagesAvatar = useContactsSingle.get('path_img') ? useContactsSingle.get('path_img') : cfgChat.img_single_user;
                            } else {
                                elem.infoParticipant.forEach(function (ele) {
                                    let relationsUseContacts = ele.relations.useContacts;
                                    let indexFindUser = listUserParticipant.findIndex(x => x.usersId == relationsUseContacts.get('users_id'));
                                    let booleanFindUser = (indexFindUser !== -1);
                                    let tempChatStatusGroupName = chatStatus[relationsUseContacts.get('status')];
                                    let tempClassStatusGroup = "";
                                    let tempMoodMessageGroup = "";
                                    let isFriendCurrent = booleanFindUser ? (listUserParticipant[indexFindUser].is_accept_single != 1) : false;

                                    if (booleanFindUser) {
                                        if (relationsUseContacts.get('mood_message')) {
                                            tempMoodMessageGroup = relationsUseContacts.get('mood_message');
                                        } else {
                                            tempMoodMessageGroup = (tempChatStatusGroupName == cfgChat.status_hidden_name) ? cfgChat.status_hidden_name_replace : tempChatStatusGroupName;
                                        }
                                        tempClassStatusGroup = isFriendCurrent ? ((tempChatStatusGroupName == cfgChat.status_hidden_name) ? cfgChat.status_hidden_name_replace : tempChatStatusGroupName) : cfgChat.class_undefined;
                                    } else {
                                        tempMoodMessageGroup = showResponseChat.isCurrentOwnerId ? cfgChat.mood_message_request : cfgChat.mood_message_responsive;
                                        tempClassStatusGroup = cfgChat.class_undefined;
                                    }

                                    let optionRender = {
                                        eleSingle: ele,
                                        strListStatus: Object.values(chatStatus).join(' '),
                                        moodMessageTemp: tempMoodMessageGroup,
                                        tempClassStatus: tempClassStatusGroup,
                                        indexFindUserSingle: indexFindUser,
                                        tempChatStatusName: tempChatStatusGroupName
                                    };
                                    let tempPartGroup = libFunction.renderDataContentChat(relationsUseContacts, listUserParticipant, optionRender);

                                    listParticipant.push(tempPartGroup);
                                    urlImagesAvatar = relationsUseContacts.get('path_img_group') ? relationsUseContacts.get('path_img_group') : cfgChat.img_group_user;
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
                                var response = {html: renderHtml, err: err};

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
                    showResponseChat.classStatus = cfgChat.class_undefined;
                    showResponseChat.moodMessageShow = cfgChat.mood_message_request;
                    showResponseChat.urlImagesAvatar = useContacts.get('path_img') ? useContacts.get('path_img') : cfgChat.img_single_user;

                    res.render(showResponseChat.renderViews, {
                        data: showResponseChat,
                        layout: false
                    }, function (err, renderHtml) {
                        if (err) {
                            res.send(err);
                        } else {
                            var response = {html: renderHtml, err: err};

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

    postListContact(req, res, next) {
        var showResponseChat = {
            data: [],
            option: {},
            done: false,
            err: '',
            msg: ''
        };
        try {
            if (req.user) {
                let isAuthenticatesSingle = req.body.isAuthenticatesSingle === 'true';
                let requestConversation = {
                    userCurrentID: req.user.attributes.id,
                    conversationType: (isAuthenticatesSingle ? [conversationType[0]] : Object.keys(conversationType).map(function (k) {
                        return conversationType[k]
                    })),
                    isAuthenticatesSingle: isAuthenticatesSingle
                };
                let user = new User.class();
                user.findByIdChat(requestConversation, function (errConversation, modelConversation) {
                    if (errConversation) {
                        res.status(500).send(errConversation)
                    } else {
                        let tempModelConversation = modelConversation.infoParticipant;
                        if (isAuthenticatesSingle === false) {
                            let option = {
                                isSearch: req.body.isSearch !== undefined ? req.body.isSearch === 'true' : false,
                                valSearch: req.body.valSearch !== undefined ? req.body.valSearch : null,
                                cfg_chat: helper.coreHelper.app
                            };

                            let resultListContactAll = libFunction.renderContactListAll(tempModelConversation, option);

                            res.status(200).send(resultListContactAll);
                        } else {
                            showResponseChat.option.isConversationSingle = isAuthenticatesSingle ? req.body.dataType === conversationType[0] : null;

                            let option = {single: conversationType[0]};
                            let dataResult = libFunction.getListContactSingle(tempModelConversation, option);
                            dataResult.sort(function (a, b) {
                                return a.created_at - b.created_at;
                            });

                            showResponseChat.data = dataResult;
                            showResponseChat.done = true;
                            showResponseChat.msg = 'success';

                            res.status(200).send(showResponseChat);
                        }
                    }
                });
            } else {
                showResponseChat.err = 'ERR0002';
                showResponseChat.done = 'failed';
                showResponseChat.msg = 'ERR0003';
                res.status(200).send(showResponseChat)
            }
        } catch (ex) {
            res.status(500).send(ex)
        }
    }

    socketConnection(io) {
        var s60 = 1000 * 60 * 1;
        io.on('connection', function (socket) {
            let chatController = new ChatController();
            let userCurrent = chatController.getSessionByName(socket, 'passport');
            let cfgChatUser = chatController.supportConfigChat(chatController.getSessionByName(socket, 'cfg_chat'));
            chatController.setSessionByName(socket, 'isActiveCurrent', userCurrent.user ? userCurrent.user : null);
            socket.isActiveLoadPageCurrent = userCurrent.user ? userCurrent.user : null;

            if (userCurrent) {
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
                    let page = reqData.data.page !== undefined ? parseInt(reqData.data.page) : 1;

                    if (conversationId) {
                        let message = new Messages.class();
                        let requestMessage = {
                            id: conversationId,
                            userCurrentID: userCurrent.user,
                            limit: cfgChatUser.page_size_number,
                            offset: cfgChatUser.page_size_number * (page - 1),
                            sort: 'DESC'

                        };

                        message.getMessageConversation(requestMessage, function (errMessage, modelMessage) {
                            if (errMessage) {
                                return 1;
                            } else {
                                process.nextTick(function () {
                                    let reqOption = {
                                        userCurrent: userCurrent
                                    };
                                    let modelMsgArray = modelMessage.models.map(function (eleModel) {
                                        return eleModel;
                                    });
                                    let isScrollTop = reqData.data.isScrollTop !== undefined ? reqData.data.isScrollTop : false;
                                    if (isScrollTop === false) modelMsgArray.reverse();
                                    let resModelMessage = chatController.convertListMessage(modelMsgArray, reqOption);

                                    // resModelMessage.isScrollTop = isScrollTop;
                                    resModelMessage.isLoadTop = reqData.data.isScrollTop !== undefined ? true : false;
                                    resModelMessage.channelId = reqData.data.dataChannelID;
                                    socket.emit('msgContent', resModelMessage);
                                });
                            }
                        });
                    } else {
                        let resModelMessageNull = {};
                        resModelMessageNull.isLoadTop = reqData.data.isScrollTop !== undefined ? true : false;
                        resModelMessageNull.channelId = reqData.data.dataChannelID;
                        resModelMessageNull.isLength = 0;
                        socket.emit('msgContent', resModelMessageNull);
                    }
                });

                socket.on('sendDataMsg', function (dataSendChat) {
                    if (dataSendChat) {
                        let message = new Messages.class();
                        dataSendChat.channelId = dataSendChat.dataChannel;
                        dataSendChat.valueMsg = dataSendChat.dataValueMsg;
                        let reqDataInsert = {
                            conversation_id: dataSendChat.dataConversation,
                            sender_id: userCurrent.user,
                            participants_id: dataSendChat.listCodePart,
                            message_type: messageType[1],
                            message: dataSendChat.dataValueMsg,
                            guid: dataSendChat.dataType
                        };

                        message.insert(reqDataInsert, function (err, modelMsg) {
                            if (err) return 1;

                            process.nextTick(function () {
                                let reqOption = {
                                    userCurrent: userCurrent
                                };
                                let modelMsgArray = [];
                                modelMsgArray.push(modelMsg);
                                let resModelMessage = chatController.convertListMessage(modelMsgArray, reqOption);
                                resModelMessage.isLoadTop = dataSendChat.isScrollTop !== undefined ? true : false;

                                socket.emit('sendDataPrivate', resModelMessage);

                                if (dataSendChat.dataChannel) {
                                    // not user current because show for other user
                                    resModelMessage.listMsg[0].isUserCurrent = false;
                                    resModelMessage.channelId = dataSendChat.dataChannel;
                                    socket.broadcast.to(dataSendChat.dataChannel).emit('sendDataBroadCast', resModelMessage);
                                }
                            });
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

                socket.on('updateActionConversationGroup', function (reqActionConversation) {
                    if (reqActionConversation.isSingle === true && reqActionConversation.act === 'add') {
                        // create conversaton
                        //user part - use current - list author
                        if (reqActionConversation.userParticipant.length && reqActionConversation.listAuthorId.length) {
                            let userParticipant = reqActionConversation.userParticipant;
                            userParticipant.push(userCurrent.user);
                            let listParticipant = [];
                            userParticipant.forEach(function (items) {
                                let temp = {};
                                temp.users_id = items;
                                temp.type = conversationType[1];
                                temp.is_accept_group = 0;
                                listParticipant.push(temp);
                            });

                            reqActionConversation.listAuthorId.forEach(function (items) {
                                let temp = {};
                                temp.users_id = items;
                                temp.is_accept_group = 1;
                                temp.type = conversationType[1];
                                listParticipant.push(temp);
                            });
                            let reqModelsInsert = {
                                title: reqActionConversation.title,
                                creator_id: userCurrent.user,
                                channel_id: libFunction.randomStringGenerate(),
                                listParticipant: listParticipant
                            };

                            let conversation = new Conversation.class();
                            conversation.insertConversation(reqModelsInsert, function (err, modelConversation) {
                                console.log(reqModelsInsert);
                            });
                        }
                    } else if (reqActionConversation.conversationId && reqActionConversation.act === 'update') {
                        // update conversation user in table participant
                        if (reqActionConversation.listAuthorId.length) {

                        }
                    }
                });

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

                // let s60Revert = setTimeout(function () {
                //     if (socket.isActiveLoadPageCurrent) {
                //         socket.isActiveLoadPageCurrent = null;
                //
                //         console.log('com..................', socket.isActiveLoadPageCurrent);
                //
                //         var dataRequest = {
                //             clause: {users_id: socket.users_id},
                //             dataUpdate: {
                //                 status: 2
                //             }
                //         };
                //         chatController.queueUpdateContact(socket, dataRequest, chatController.getSessionByName(socket, 'currentStatus'));
                //         // io.sockets.emit('expiresTime60', "het 1 minute");
                //     }
                // }, s60);

                //// 3s
                // socket.on('pingServer', (data) => {
                // clearTimeout(s60Revert);
                // });
                // socket.on('pong', (data) => {
                // if (socket.isActiveLoadPageCurrent)
                // if (gh)
                //     io.emit('ping', userCurrent);
                // socket.isActiveLoadPageCurrent = userCurrent.user;
                // });
                // // 30 minutine - reload page
                // setTimeout(function () {
                //     if (socket.isActiveLoadPageCurrent) {
                //         socket.isActiveLoadPageCurrent = null;
                //         console.log('com...xxxx..................', socket.isActiveLoadPageCurrent);
                //         // io.sockets.emit('reload', {});
                //         socket.emit('expiresTime60', "het 30 minute");
                //     }
                // }, 1000 * 60 * 30);
                // setInterval(function () {
                // socket.emit('expiresTime60', "--------test------- 3s -> " + socket.isActiveLoadPageCurrent);
                // }, 3000)
            }

            //disconnect socket by id
            socket.on('disconnect', function () {
                // let indexSocketIDDisconnect = allClients.indexOf(socket);
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
        socket.handshake.session[nameSession] = dataSave;
        socket.handshake.session.save();
        resultSession = true;
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
        return true;
    } catch (ex) {
        return false;
    }
};

ChatController.prototype.updateUserListSocket = function (socket, dataRequest, currentStatus, done) {
    let responsiveData = {code: null, msg: '', data: {}, status: false};

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
                let requestSql = {
                    userCurrentID: currentStatus.userCurrentID,
                    conversationType: Object.keys(conversationType).map(function (k) {
                        return conversationType[k]
                    })
                };
                newUser.findByIdChat(requestSql, function (err, modelData) {
                    if (err) {
                        responsiveData['msg'] = err;
                        responsiveData['code'] = 'ERR0002';
                        done(err, responsiveData);
                    } else {
                        let notiContacts = modelData.infoAccount.relations.useContacts;
                        let updateStatusCurrent = chatStatus[notiContacts.attributes.status];
                        let requestCurrent = {
                            userCurrentID: currentStatus.userCurrentID,
                            statusID: notiContacts.attributes.status,
                            statusName: updateStatusCurrent,
                            listStatus: Object.values(chatStatus).join(' '),
                            statusSingle: cfgChat.status_single,
                            classCurrentStatus: (dataRequest.dataUpdate.is_life == 0 || (cfgChat.status_hidden_name == updateStatusCurrent) ? cfgChat.status_hidden_name_replace : updateStatusCurrent),
                            classCurrentStatusPrivate: (cfgChat.status_hidden_name == updateStatusCurrent) ? cfgChat.status_hidden_name_replace : updateStatusCurrent,
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

ChatController.prototype.convertListMessage = function (modelArrayMessage, reqOption) {
    let resModelMessage = {};
    let lengthModel = modelArrayMessage.length;
    resModelMessage.isLength = lengthModel;
    resModelMessage.inverseTypeMsg = typeMsgSwapKeyValue;

    if (modelArrayMessage.length) {
        resModelMessage.option = {
            userCurrentId: reqOption.userCurrent.user
        };

        let resultListMessage = [];
        let listMessage = {};
        let listMsgTemp = [];

        modelArrayMessage.forEach(function (element, index) {
            let isUserFuture = ((index + 1) >= lengthModel) ? false : (modelArrayMessage[(index + 1)].attributes.sender_id === element.attributes.sender_id);

            if (isUserFuture === false) {
                listMsgTemp.push(element.attributes);

                listMessage.data = listMsgTemp;
                listMessage.contactMessage = element.relations.contactMessage.toJSON();
                listMessage.isSingle = element.attributes.is_single_group == 0;
                listMessage.isUserCurrent = (element.attributes.sender_id == reqOption.userCurrent.user);
                resultListMessage.push(listMessage);
                listMsgTemp = [];
                listMessage = {};

            } else {
                listMsgTemp.push(element.attributes);
            }
        });
        resModelMessage.listMsg = resultListMessage;
    } else {

    }
    return resModelMessage;
}

ChatController.prototype.supportConfigChat = function (jsonConfigChat) {
    try {
        return JSON.parse(jsonConfigChat);
    } catch (ex) {
        return null;
    }
}

kue.Job.rangeByState('complete', 0, 0, 'asc', function (err, jobs) {
    jobs.forEach(function (job) {
        job.remove(function () {
            console.log('removed ', job.id);
        });
    });
});

module.exports = ChatController;

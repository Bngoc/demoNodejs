'use strict';

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
            var newUser = new User();
            newUser.findByIdChat(userCurrent.attributes.id, function (err, rsData) {
                if (err) {
                    return next(err);
                }

                let notiContacts = rsData.relations.contacts;

                showResponse.userName = notiContacts ? notiContacts.attributes.middle_name : '';
                showResponse.status = notiContacts ? helper.coreHelper.app.chatStatus[notiContacts.attributes.status] : '';
                showResponse.listStatus = helper.coreHelper.app.chatStatus;
                showResponse.urlUpdareStatus = aliasRouter.build('chat.change.status');


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
        if (req.xhr) {
            let userCurrent = req.user;
            if (userCurrent) {
                var newContacts = new Contacts();
                var dataRequest = {
                    clause: {users_id: userCurrent.attributes.id},
                    dataUpdate: {status: parseInt(req.body.status)},
                };

                newContacts.updateContact(dataRequest, function (err, rsModel) {
                    if (err) {
                        res.status(200).send(err);
                    } else {
                        res.status(200).send(rsModel);
                    }
                });
            }
        } else {
            res.status(500).send('ERR0000');
        }
    }
}

module.exports = ChatController;

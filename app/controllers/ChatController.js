'use strict';

const HelperViewController = require('./HelperViewController.js');
const helperViewController = new HelperViewController();


var path = require('path'),
    fs = require('fs'),
    ejs = require('ejs');

var ViewsController = require('./ViewsController.js');
var BaseController = require('./BaseController.js');

const HEIGHT_BOX_CHAT_MAX = 130;
const HEIGHT_BOX_CHAT_MIN = 56;

class ChatController extends BaseController {

    getIndex(requset, response, next) {

        var showResponse = helperViewController;

        showResponse.header = showResponse.getHeader('CHAT');
        showResponse.cssInclude = showResponse.readFileInclude(['css/chat.custom.css', 'css/chat.test.css'], 'c');
        showResponse.title = 'Home chat';
        showResponse.isNotIncludeSidebar = true;
        showResponse.maxHeightBoxChat = HEIGHT_BOX_CHAT_MAX;
        showResponse.minHeightBoxChat = HEIGHT_BOX_CHAT_MIN;

        showResponse.scriptInclude = showResponse.readFileInclude(['js/socket/client.js']);

        showResponse.renderViews = 'chat/index.ejs';

        response.render(showResponse.renderViews, showResponse);
    }

    getContentChat(req, res, next) {
        var showResponseChat = helperViewController;

        showResponseChat.maxHeightBoxChat = HEIGHT_BOX_CHAT_MAX;
        showResponseChat.minHeightBoxChat = HEIGHT_BOX_CHAT_MIN;

        showResponseChat.imgProfile = req.body.imgProfile;
        showResponseChat.userName = req.body.userName;

        showResponseChat.renderViews = 'chat/content.chat.ejs';

        // res.status(200).send(showResponseChat);

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
}

module.exports = ChatController;

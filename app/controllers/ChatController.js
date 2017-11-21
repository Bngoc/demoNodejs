'use strict';

const HelperViewController = require('./HelperViewController.js');
const helperViewController = new HelperViewController();


var path = require('path'),
    fs = require('fs');

var ViewsController = require('./ViewsController.js');
var BaseController = require('./BaseController.js');


class ChatController extends BaseController {

    getIndex(requset, response, next) {

        var showResponse = helperViewController;

        showResponse.header = showResponse.getHeader('CHAT');
        showResponse.cssInclude = showResponse.readFileInclude(['css/chat.custom.css', 'css/chat.test.css'], 'c');
        showResponse.title = 'Home chat';
        showResponse.isNotIncludeSidebar = true;
        showResponse.maxHeightBoxChat = 130;
        showResponse.minHeightBoxChat = 56;

        showResponse.scriptInclude = showResponse.readFileInclude(['js/socket/client.js']);

        showResponse.renderViews = 'chat/index.ejs';

        response.render(showResponse.renderViews, showResponse);
    }
}

module.exports = ChatController;

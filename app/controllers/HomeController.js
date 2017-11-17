'use strict';

const HelperViewController = require('./HelperViewController.js');
const helperViewController = new HelperViewController();


var path = require('path'),
    fs = require('fs');

var ViewsController = require('./ViewsController.js');
var BaseController = require('./BaseController.js');


class HomeController extends BaseController {

    index(requset, response, next) {

        var showResponse = helperViewController;

        showResponse.cssInclude = showResponse.getCssCommon(['main.css']);
        // showResponse.title = 'Home welcome';
        showResponse.media = 'media';
        showResponse.name = 1111;
        showResponse.content = 'Home welcome content ????s';

        showResponse.renderViews = 'home/index.ejs';

        response.render(showResponse.renderViews, showResponse);


        /*var viewsController = new ViewsController();
         var dataLayoutHtml = viewsController.renderLayout();
         console.log(dataLayoutHtml);

         var defineTitleDocument = 'bbbbbbbbbbbbbbbbbbbbbbbbbbb';
         var defineHead = '<link href="/css/style.css" rel="stylesheet">';
         var defineTopHeader = '<link href="/css/main.css" rel="stylesheet">';
         var defineFooter = '<link href="/css/style.css" rel="stylesheet">';

         var sampleHtmlContent = fs.readFileSync(path.resolve(__dirname + '/../../resources/views/index.ejs'), 'utf-8');
         dataLayoutHtml = dataLayoutHtml.replace('{CONTENT}', sampleHtmlContent);
         console.log(defineTitleDocument, '1111');

         // var replaceStr = response.render('old.index.ejs', {
         //     titleDocument: defineTitleDocument,
         //     defineHead: defineHead,
         //     defineTopHeader: defineTopHeader,
         //     defineFooter: defineFooter,
         //     body: 'body'
         // });
         response.writeHead(200, {"Context-type": "text/html"});
         response.end(dataLayoutHtml);*/
    }
}

module.exports = HomeController;

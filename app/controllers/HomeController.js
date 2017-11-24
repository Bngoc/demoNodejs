'use strict';

const ViewController = require('./ViewController.js');
const helper = new ViewController();

var BaseController = require('./BaseController.js');

class HomeController extends BaseController {

    getIndex(requset, response, next) {

        var showResponse = helper;

        // showResponse.cssInclude = showResponse.readFileInclude(['css/main.css'], 'c');
        showResponse.cssChat = '';//showResponse.readFileInclude(['css/chat.custom.css'], 'c');
        showResponse.scriptIncludeHead = showResponse.readFileInclude(['js/scriptHead/validate.test.js']);
        // showResponse.scriptInclude = showResponse.readFileInclude(['js/socket/client.test.js']);
        showResponse.media = 'media';
        showResponse.name = 'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH';
        showResponse.dataInclude = 'here data include';
        showResponse.gv = showResponse.readFileInclude(['js/home/test.js']);

        showResponse.content = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX content';
        showResponse.renderViews = 'home/index.ejs';

        var useRouter = helper.coreHelper.aliasRouter();
        console.log(useRouter.build('admin.user.edit', {id: 2}), '------------------------');

        // response.redirect();
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

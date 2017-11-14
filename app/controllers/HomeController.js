'use strict';

class HomeController {
    index(requset, response) {
        var defineTitleDocument = 'bbbbbbbbbbbbbbbbbbbbbbbbbbb';
        var defineHead = '<link href="/stylesheets/style.css" rel="stylesheet">';
        var defineTopHeader = '<link href="/stylesheets/style.css" rel="stylesheet">';
        var defineFooter = '<link href="/stylesheets/style.css" rel="stylesheet">';

        console.log(defineTitleDocument, '1111');

        response.render('index', {
            defineTitleDocument: defineTitleDocument,
            defineHead: defineHead,
            defineTopHeader: defineTopHeader,
            defineFooter: defineFooter,
            body: 'body'
        })
    }
}

module.exports = HomeController;
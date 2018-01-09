'use strict';

declare var require: any;
const pjson = require('./../../../package.json');
const bundles = require('./../../../bundles.angular.json');
import {isUndefined} from "util";

export abstract class libSupports {

    public intiLoadCss(isCheckWebsite = true) {
        let nameWebsite = isCheckWebsite ? 'main' : 'admin_main';
        this.loadCss(bundles.styles[nameWebsite].files);
    }

    public intiLoadScript(isCheckWebsite = true) {
        let nameWebsite = isCheckWebsite ? 'main' : 'admin_main';
        this.loadScript(bundles.scripts[nameWebsite].files.head);
        this.appendMyScript(bundles.scripts[nameWebsite].files.body);
    }

    public loadScript(urlArray) {
        if (urlArray.length) {
            urlArray.forEach(function (url, index) {
                // console.clear();
                // console.log(`preparing to load script...  ${index} of ${urlArray.length}`);
                let node = document.createElement('script');
                node.src = `assets/${url}?v=${pjson.version}`;
                node.type = 'text/javascript';
                document.getElementsByTagName('head')[0].appendChild(node);
            });
            // console.clear();
            // console.log(`Javascript is loaded successfull`);
        }
    }

    public loadCss(urlArray) {
        if (urlArray.length) {
            urlArray.forEach(function (url, index) {
                // console.clear();
                // console.log(`preparing to load css...  ${index} of ${urlArray.length}`);
                let node = document.createElement('link');
                node.href = `assets/${url}?v=${pjson.version}`;
                node.rel = 'stylesheet';
                node.type = 'text/css';
                document.getElementsByTagName('head')[0].appendChild(node);
            });
            // console.clear();
            // console.log(`Css is loaded successfull`);
        }
    }

    public appendMyScript(urlArray) {
        if (urlArray.length) {
            urlArray.forEach(function (url) {
                let script = document.createElement('script');
                script.src = `assets/${url}?v=${pjson.version}`;
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);
            });
        }
    }
}
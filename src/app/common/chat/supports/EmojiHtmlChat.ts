'use strict';

import {LibCommonChat} from "./LibCommonChat";

export class EmojiHtmlChat {
    public LibCommonChat() {
        // LibCommonChat
    }

    public format(code, name) {
        return '<img alt="' + code + '" src="' + name + '.png" />';
    };
}

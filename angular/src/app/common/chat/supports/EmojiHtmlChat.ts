'use strict';

declare var require: any;
declare var $: any;
const emojiText = require("emoji-text");
const emoji = require('node-emoji');

export class EmojiHtmlChat {

    public convertEmojiToText(str) {
        return typeof str != 'undefined' ? str.length ? emojiText.convert(str, {delimiter: ':'}) : str : '';
    }

    public convertEmoji(stringMsg) {
        return typeof stringMsg != 'undefined' ? stringMsg.length
                ? emoji.emojify(stringMsg, (name) => {
                    return name;
                })
                : stringMsg
            : '';
    }

    public convertEmojiFormat(stringMsg) {
        return typeof stringMsg != 'undefined' ? stringMsg.length
                ? emoji.emojify(stringMsg, (name) => {
                    return name;
                }, (code, nameSrc) => {
                    return '<img alt="' + code + '" src="./' + nameSrc + '.png" />';
                })
                : stringMsg
            : '';
    }
}

'use strict';

const fs = require('fs');
const encoding = "utf8";


class SyncFile {

    createFile(data, callback) {
        try {
            let content = data.fileContent;
            fs.writeFile(data.path, content, encoding, function (err) {
                if (err) {
                    callback(err);
                    // return console.log('Cannot write file ' + path + ' .....', err);
                }
                callback(null, true);
                // console.log("The file was saved!");
            });
        } catch (ex) {
            callback(ex);
            console.log("MEOTH: createFile", ex);
        }
    };

    readFile(data, callback) {
        try {

        } catch (ex) {
            callback(ex);
        }
    }
}

module.exports = SyncFile;
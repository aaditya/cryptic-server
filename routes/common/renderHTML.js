const ejs = require('ejs');

const renderFile = function (path, obj) {
    return new Promise(function (resolve, reject) {
        ejs.renderFile(path, obj, function(err, str) {
            if (err) {
                reject(err);
            } else {
                resolve(str);
            }
        });
    });
}

module.exports = renderFile;
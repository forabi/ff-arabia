var { XMLHttpRequest } = require("sdk/net/xhr");

function Feed(url) {
    this.url = url;
}

Feed.prototype.get = function() {
    var url = this.url;
    console.debug('Sending request to', url);
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        // req.responseType = 'document';
        req.onreadystatechange = function(e) {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    return resolve(req.responseText);
                }
                return reject(req.responseText);
            }
        }

        req.onerror = function() {
            return reject(req.response);
        };

        req.open('GET', url);
        req.send();
    });
}

module.exports = Feed;
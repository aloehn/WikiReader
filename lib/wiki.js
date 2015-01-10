var express = require('express');
var http = require('follow-redirects').http;

module.exports = function () {
    var router = new express.Router();

    // Works as a proxy for the Wiki API.
    // The request of the client will be sent to the Wiki API using GET parameters.
    // The client then receives the chunks that we receive.
    router.get('/:lang/wiki', function (req, res, next) {
        if (Object.keys(req.query).length === 0) {
            next();
            return;
        }

        var url = 'http://' + req.params.lang + '.wikipedia.org/w/api.php' + req._parsedUrl.search;

        http.get(url, function (request) {
            res.set('Content-Type', 'text/json');

            request.on('data', function (chunk) {
                res.status(200);
                res.write(chunk);
            });

            request.on('end', function () {
                res.end();
            });

        }).on('error', function (e) {
            res.status(500)
                .json(e)
                .end();
            console.error(e);
        });
    });

    return router;
};
var express = require('express');
//var http = require('http');
var http = require('follow-redirects').http;

var Log = require('./log');
var log = new Log('lib/wiki');

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
        log.info("Start requesting url:", url).newBlock();

        http.get(url, function (request) {
            res.set('Content-Type', 'text/json');

            request.on('data', function (chunk) {
                res.status(200);
                res.write(chunk);
                log.info('Sent chunk of ' + chunk.length + ' bytes.');
            });

            request.on('end', function () {
                res.end();
                log.endBlock();
            });

            request.on('error', function (e) {
                res.status(500)
                    .json(e)
                    .end();
                log.error(e).endBlock();
            });
        });
    });

    /**
     * Gets an article from Wikipedia and returns it to the client as plain HTML.
     * I tried to use the Wiki API, but the request took about 800 to 1000 ms,
     * which lead me to better request the full Wiki page itself and search for the mattering part.
     * The request will be parsed chunked, if this fails (in the case that the part I am looking for is splitted because of chunked endoding),
     * the collected chunks will be concaterated and parsed again.
     */
    router.get('/:lang/wiki/:articleName', function (req, res, next) {

        // Set the url to the direct Wiki page.
        var url = 'http://' + req.params.lang + '.wikipedia.org/wiki/' + req.params.articleName;
        log.info("Start requesting url:", url).newBlock();

        // Start requesting the Wiki page.
        http.get(url, function (request) {
            res.set('Content-Type', 'text/html');

            var skipData = true; // Shows if the current chunk can be sent to the client.
            var chunks = []; // Contains all chunks for the case that the chunked parsing fails.

            request.on('data', function (chunk) {

                var text = chunk.toString();
                chunks.push(text);

                // Skip chunks as long as the beginning of the part we are looking for hasn't been found yet.
                if (skipData) {
                    var startIndex = text.indexOf('<div id="content"');
                    if (startIndex >= 0) {
                        // Found the beginning of the part we are looking for.
                        text = text.substr(startIndex);
                        skipData = false;
                        log.info('Sent FIRST chunk of ' + text.length + ' bytes.');
                    }
                }

                // If the beginning of the part we are looking for has been found.
                if (!skipData) {
                    // Find the end.
                    var endIndex = text.indexOf('id="mw-navigation">');
                    if (endIndex >= 0) {
                        // The end has been found. The client receives the last chunk.
                        text = text.substr(0, endIndex)
                        res.status(200).end(text);
                        request.destroy();
                        log.info('Sent LAST chunk of ' + text.length + ' bytes.');

                    } else {
                        // The end couldn't be found yet, so keep on sending the chunk.
                        res.status(200).write(text);
                        //log.info('Sent chunk of ' + text.length + ' bytes.');
                    }
                }
            });

            // If the request ends, we have to check whether the mattering part of the Wiki page could be found.
            // In this case the collected chunks will be parsed again.
            request.on('end', function () {
                if (!res.finished) {
                    log.warn('Chunked transfer was not successful. Try to parse again the whole document ...');
                    var text = chunks.join('');
                    var startIndex = text.indexOf('<div id="content"');
                    var endIndex = text.indexOf('id="mw-navigation">');

                    if (startIndex >= 0 && endIndex >= 0) {
                        text = text.substr(startIndex, endIndex - startIndex);
                    } else {
                        // TODO: do something if the specific part of the wiki page couldn't be found!   
                    }
                    res.end(text);
                    
                }
                log.endBlock();
            });

            request.on('error', function (e) {
                res.status(500)
                    .json(e)
                    .end();
                log.error(e).endBlock();
            });
        });
    });

    return router;
};
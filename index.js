var express = require('express');
var app = express();
var microtemplates = require('microtemplates');
var fs = require('fs');

var wiki = require('./lib/wiki.js');
var Lang = require('./lib/lang.js');
var langMgr = new Lang();


// Use the wiki module.
app.use(wiki());

// Allow access to the public folder.
app.use(express.static(__dirname + '/public'));


// Redirect to the english version of the page if no language is specified.
app.get('/', function(req, res, next) {
    res.redirect('./en/');
});

// Sends the start page in the specified language to the client.
app.get('/:lang', function(req, res, next) {
    var lang = req.params.lang;
    var path = './public/index.htm';
    
    // If the language has the wrong format, keep on with the next handler.
    if (!langMgr.valid(lang)) {
        next();
        return;
    }
    
    // Reads the index.htm content, and renders it with microtemplates.
    // The language object gets passed to the microtemplates rendering.
    // This puts the multi language functionality to server side, which improves the performance.
    var langObj = langMgr.get(lang);
    var viewContent = fs.readFileSync(path);
    var viewRenderer = microtemplates(viewContent.toString());
    var renderedOutput = viewRenderer(langObj);
    
    // Send the rendered page to the client.
    res.status(200)
        .set("Content-Type", "text/html")
        .send(renderedOutput)
        .end();
});

var port = 3000;
var server = app.listen(port, function () {
    console.log('Example app listening at http://%s:%s', "localhost", port);
});
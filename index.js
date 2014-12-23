var express = require('express');
var app = express();
var microtemplates = require('microtemplates');
var fs = require('fs');

require('./wiki.js');


// Allow access to the public folder.
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
    res.redirect('./en/').end();
});

app.get('/:lang', function(req, res, next) {
    
    
    // TODO: Move the following to application start ...
    
    // Compile start page template using Microtemplates.
    var startPagePath = './public/view/index.htm';
    var startPageTemplate = fs.readFileSync(startPagePath);
    // TODO: Check if 'startPageTemplate' is empty.
    var startPageMicroTemplate = microtemplates(startPageTemplate.toString());

    // ... that's it.2
    
    var langFilePath = './' + req.params.lang + '.json';
    if (!fs.existsSync(langFilePath)) {
        next();
        return;
    }
    
    // Read the language file and pass it as object to the template.
    var langFileContent = fs.readFileSync(langFilePath);
    var langObject = JSON.parse(langFileContent);
    var outHtml = startPageMicroTemplate(langObject);
    
    // Send the rendered page to the client.
    res.status(200)
        .set("Content-Type", "text/html")
        .send(outHtml)
        .end();
});

var server = app.listen(4000, function () {
    console.log('Example app listening at http://%s:%s', "localhost", 4000);
});
var nodemw = require('nodemw');

console.log(nodemw);

var client = new nodemw({
    server: 'wikipedia.org',
    path: '/w'
});

app.get('/wiki', function (req, res, next) {

    console.log(req.params); 

})


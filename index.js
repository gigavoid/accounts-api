var express     = require('express'),
    fs          = require('fs'),
    config      = require('./configLoader.js');

var app = express();


app.get('/', function (req, res) {
    res.send('Gigavoid Acconts');
});

var server = app.listen(config.get('port'), function() {
    var addr = server.address();

    console.log('Gigavoid Accounts running on %s:%s', addr.address, addr.port);
});

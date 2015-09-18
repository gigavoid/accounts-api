var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Gigavoid Acconts');
});

var server = app.listen(3000, function() {
    var addr = server.address();

    console.log('Gigavoid Accounts running on %s:%s', addr.address, addr.port);
});

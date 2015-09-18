var express     = require('express'),
    fs          = require('fs'),
    mongoose    = require('mongoose'),
    config      = require('./src/configLoader.js'),
    api         = require('./src/api.js');

config.init(function() {

    mongoose.connect(config.get('mongo'));

    var app = express();

    app.use('/', api);

    var server = app.listen(config.get('port'), function() {
        var addr = server.address();

        console.log('Gigavoid Accounts running on %s:%s', addr.address, addr.port);
    });
});


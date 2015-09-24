var express     = require('express'),
    fs          = require('fs'),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser'),
    config      = require('./src/configLoader.js'),
    api         = require('./src/api.js');

function allowCors(req, res, next) {
    if (req.headers.origin !== 'http://localhost:8000' && req.headers.origin !== 'http://accounts.gigavoid.com' && req.headers.origin !== 'http://sway.gigavoid.com')
        return next();

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
}


config.init(function() {

    mongoose.connect(config.get('mongo'));

    var app = express();
    app.use(bodyParser.json());
    app.use(allowCors);

    app.use('/', api);

    app.get('/frame', function (req, res) {
        return res.send('<script src=\'/frame.js\'></script>');
    });

    app.get('/frame.js', function (req, res) {
        return res.sendFile(__dirname + '/frame.js');
    });

    var server = app.listen(config.get('port'), function() {
        var addr = server.address();

        console.log('Gigavoid Accounts running on %s:%s', addr.address, addr.port);
    });
});


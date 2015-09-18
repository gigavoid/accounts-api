var Promise     = require('bluebird'),
    express     = require('express'),
    Account     = require('./models/account'),
    _           = require('lodash');

var api = module.exports = new express.Router();

api.get('/register', function (req, res) {
    var username = 'hk.henrik@gmail.com';
    var password = 'sten123';
    var deviceInfo = {
        deviceType: 'Web Browser',
        deviceName: 'Chrome 42',
        ipAddress: '127.0.0.2'
    }

    var registerPromise = Account.register(username, password);

    var authPromise = registerPromise.then(function(account) {
        return account.auth(password, deviceInfo);
    });

    var savePromise = registerPromise.then(function(account) {
        return account.trySave();
    });

    Promise.join(registerPromise, authPromise, savePromise, function (account, authResult, save) {
        console.log('save', save);
        return res.send({
            key: authResult.key
        });
    }).catch(function (err) {
        if (err.name === 'ValidationError') {
            var errors = {}; 
            _.forOwn(err.errors, function(error, key) {
                errors[key] = error.properties
            });
            res.status(400).send({
                error: 'Invalid form data',
                errors: errors
            });
        } else {
            res.status(400).send({
                error: 'Unknown error'
            });
            console.error(err);
        }
    });
});


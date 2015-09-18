var Promise     = require('bluebird'),
    express     = require('express'),
    useragent   = require('useragent'),
    Account     = require('./models/account'),
    MongoError  = require('mongoose/lib/error'),
    _           = require('lodash');

var api = module.exports = new express.Router();

function getDeviceInfo(req) {
    var agent = useragent.lookup(req.headers['user-agent']);
    return {
        deviceType: 'Web Browser', // no support for anything other than web browsers for now
        deviceName: agent.family,
        ipAddress: req.ip
    }
}

function validationErrorHandler(res) {
    return function (err) {
        var errors = {}; 
        _.forOwn(err.errors, function(error, key) {
            errors[key] = error.properties
        });
        res.status(400).send({
            error: 'Invalid form data',
            errors: errors
        });
    };
}

/**
 * HTTP POST /register
 * {
 *      username: String,
 *      password: String
 * }
 *
 * Response:
 * {
 *      key: String
 * }
 */
api.post('/register', function (req, res) {
    // step1: Create a new account object
    Account.register(req.body.username, req.body.password).then(function (account) {
        // step2: Authenticate right away in order to save a roundtrip to the server
        return [account, account.auth(password, getDeviceInfo(req))];
    }).spread(function (account, auth) {
        // step3: Save the collection. Throws an exception if the data is invalid
        return [account.trySave(), auth];
    }).spread(function (account, auth) {
        // step4: If the data was correct, send response
        return res.send({
            key: auth.key
        });
    })
    .catch(MongoError.ValidationError, validationErrorHandler(res))
    .catch(function (err) {
        res.status(400).send({
            error: 'Unknown error'
        });
        console.error(err.stack);
    });
});


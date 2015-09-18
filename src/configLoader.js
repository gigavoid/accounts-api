var nconf       = require('nconf'),
    fs          = require('fs');

function init(cb) {
    nconf.argv()
        .env()
        .file({ file: 'cfg/config.json' });

    nconf.set('port', '3000');
    nconf.set('mongo', 'mongodb://localhost/gigavoid-accounts');
    nconf.set('bcrypt-rounds', 13);

    nconf.save(function (err) {
        if (err) {
            console.error(err);
        }
        cb();
    });
}

nconf.init = init;

module.exports = nconf;

var nconf       = require('nconf'),
    fs          = require('fs');

nconf.argv()
    .env()
    .file({ file: 'cfg/config.json' });

nconf.set('port', '3000');
nconf.set('mongo', 'mongodb://localhost');

nconf.save(function (err) {
    if (err) {
        return console.error(err.message);
    }
    
    console.log('Configuration saved');
});

module.exports = nconf;

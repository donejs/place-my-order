require('babel/register');

var app = require('./app');
var server = app.listen(require('./config').port);

console.log('App listening at http://%s:%s', server.address().address,
            server.address().port);

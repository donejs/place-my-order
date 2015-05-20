require('babel/register');
var ajax = require('./iso/ajax');

var app = require('./app');

var server = app.listen(require('./config').port);
app.use(ajax(server));

console.log('App listening at http://%s:%s', server.address().address,
            server.address().port);

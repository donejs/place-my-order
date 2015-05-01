require('babel/register');

var app = require('./app').app;
app.listen(require('./config').port);

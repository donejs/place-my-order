require('babel/register');

var app = require('./app').app;
app.listen(process.env.PORT || 3030);

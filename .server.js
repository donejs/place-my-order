var api = require('place-my-order-api');
var server = require('done-serve');

var port = process.env.PORT || 3030;

var app = server(port, {
  path: __dirname
});

api.setup(app);

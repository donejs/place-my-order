var api = require('place-my-order-api');
var server = require('done-serve');

var port = process.env.PORT || 3030;

var app = server(port, {
  path: __dirname,
  configure: function(layers) {
    var apiExp = /^\/api/;
    layers.push(function(req, res, next) {
      if(apiExp.test(req.url)) {
        req.url = req.url.split(apiExp)[1];
        api(req, res, next);
        return;
      }
      next();
    });
  }
});

api.setup(app);

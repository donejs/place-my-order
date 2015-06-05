var server = require('donejs-server');
var api = require('place-my-order-api');
var app = server({
  path: __dirname,
  configure: function(app) {
    app.use('/api', api);
    app.api = api;

    var oldListen = app.listen;
    app.listen = function() {
      var server = oldListen.apply(this, arguments);
      api.setup(server);
      return server;
    };
  }
});

app.listen(process.env.PORT || 3030);

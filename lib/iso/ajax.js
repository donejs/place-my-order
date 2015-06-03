var najax = require('najax');

module.exports = function(){
  let oldListen = this.listen;
  this.listen = function() {
    let server = oldListen.apply(this, arguments);
    var base = 'http://' + server.address().address + ':' + server.address().port;

    var canAjax = function(args){
      if(typeof args === "string") {
        args = { url: args };
      }

      args.url = base + args.url;
      arguments[0] = args;
      return najax.apply(this, arguments);
    };

    var _can;
    Object.defineProperty(global, "can", {
      get: function() { return _can; },
      set: function(v){
        _can = v;
        Object.defineProperty(_can, "ajax", {
          get: function() { return canAjax; }
        });
      }
    });
    return server;
  };

  return function(req, res, next){
    next();
  };
};

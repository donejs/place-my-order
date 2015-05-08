var najax = require('najax');

module.exports = function(server){

  var base = 'http://' + server.address().address + ':' + server.address().port;

  can.ajax = function(args){
    if(typeof args === "string") {
      args = { url: args };
    }

    args.url = base + args.url;
    arguments[0] = args;
    return najax.apply(this, arguments);
  };

  return function(req, res, next){
    next();
  };
};

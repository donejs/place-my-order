var najax = require('najax');

module.exports = function(server){

  var base = 'http://' + server.address().address + ':' + server.address().port;

  can.ajax = function(args){
    args.url = base + args.url;
    return najax.apply(this, arguments);
  };

  return function(req, res, next){
    next();
  };
};

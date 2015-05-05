import najax from 'najax';

export default function(){
  can.ajax = function(args){
    args.url = 'http://0.0.0.0:3030' + args.url;
    return najax.apply(this, arguments);
  };

  return function(req, res, next){
    next();
  };
};

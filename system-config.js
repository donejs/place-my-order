"format cjs";

var MySystem = require('@loader');

var isNode = typeof process === "object" &&
  {}.toString.call(process) === "[object process]" &&
  !(function(){try{var nr = MySystem._nodeRequire; return nr && nr('nw.gui') !== 'undefined';}catch(e){return false;}})();

var isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;

if(isNode || isWorker) {
  var config = exports.systemConfig = {};

  config.meta = {
    'jquery': {
      "format": "global",
      "exports": "jQuery",
      "deps": ["can/util/vdom/vdom"]
    }
  };

  if(!isWorker) {
	  config.map = {
      'socketio': '@empty'
	  };
  }
} else {
  exports.systemConfig = {
    map: {
      'can/util/vdom/vdom': '@empty'
    }
  };
}

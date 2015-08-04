"format cjs";

var MySystem = require('@loader');

var isNode = typeof process === "object" &&
  {}.toString.call(process) === "[object process]" &&
  !(function(){try{var nr = MySystem._nodeRequire; return nr && nr('nw.gui') !== 'undefined';}catch(e){return false;}})();

if(isNode) {
  var config = exports.systemConfig = {};

  if(!MySystem.buildMode) {
    config.map = {
      'socketio': '@empty'
    };
  }

  config.meta = {
    'jquery': {
      "format": "global",
      "exports": "jQuery",
      "deps": ["can/util/vdom/vdom"]
    }
  };
} else {
  exports.systemConfig = {
    map: {
      'can/util/vdom/vdom': '@empty'
    }
  };
}

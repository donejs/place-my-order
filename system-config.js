"format cjs";

var loader = require("@loader");

var envMap = loader.envMap || {};

var systemConfig = exports.systemConfig = {};

if(!envMap.server && !envMap.build) {
  systemConfig.map = {
    'can/util/vdom/vdom': '@empty'
  };
}

if(envMap.server) {
  systemConfig.map = {
    'socketio': '@empty'
  }
}

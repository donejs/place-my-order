"format cjs";

var MySystem = require('@loader');

var isNode = typeof process === "object" &&
  {}.toString.call(process) === "[object process]";

if(isNode) {
	exports.systemConfig = {
    map: {
      'socketio': '@empty'
    },
		meta: {
			'jquery': {
				"format": "global",
				"exports": "jQuery",
				"deps": ["can/util/vdom/vdom"]
			}
		}
	};
} else {
  exports.systemConfig = {
    map: {
      'can/util/vdom/vdom': '@empty'
    }
  };
}

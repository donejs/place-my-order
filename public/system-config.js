"format cjs";

var MySystem = require('@loader');

if(MySystem.env === "development" && typeof window === "undefined") {
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
}



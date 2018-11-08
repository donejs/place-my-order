const stealTools = require("steal-tools");

let buildPromise = stealTools.build({
  map: ((buildElectron || buildCordova) ? {
    "can-route-pushstate": "can-route-hash"
  } : {})
}, {
  bundleAssets: {
    infer: false,
    glob: "node_modules/place-my-order-assets/images/**/*"
  }
});

const stealTools = require("steal-tools");

let buildPromise = stealTools.build({}, {
  bundleAssets: {
    infer: false,
    glob: "node_modules/place-my-order-assets/images/**/*"
  }
});

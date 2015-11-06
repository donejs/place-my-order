var stealTools = require("steal-tools");

var buildPromise = stealTools.build({
  config: __dirname + "/package.json!npm"
}, {
  bundleAssets: {
    glob: "node_modules/place-my-order-assets/images/**/*"
  }
});
var cordovaOptions = {
  buildDir: "./build/cordova",
  id: "com.donejs.placemyorder",
  name: "place-my-order",
  platforms: ["ios"],
  plugins: ["cordova-plugin-transport-security"],
  index: __dirname + "/production.html",
  glob: [
    "node_modules/steal/steal.production.js"
  ]
};

var stealCordova = require("steal-cordova")(cordovaOptions);
// Check if the cordova option is passed.
var buildCordova = process.argv.indexOf("cordova") > 0;

if(buildCordova) {
  buildPromise.then(stealCordova.build).then(stealCordova.ios.emulate);
}
var nwOptions = {
  buildDir: "./build",
  version: "0.12.3",
  platforms: ["osx32","osx64"],
  files: [
    "package.json",
    "production.html",
    "node_modules/steal/steal.production.js"
  ]
};

var stealNw = require("steal-nw");

// Check if the cordova option is passed.
var buildNW = process.argv.indexOf("nw") > 0;

if(buildNW) {
  buildPromise = buildPromise.then(function(buildResult){
    stealNw(nwOptions, buildResult);
  });
}

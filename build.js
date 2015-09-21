var stealTools = require("steal-tools");

var cordova = process.argv.indexOf("cordova") > 0;
var nw = process.argv.indexOf("nw") > 0;

var buildPromise = stealTools.build({
  config: __dirname + "/package.json!npm"
},{
  bundleAssets: {
    infer: false,
    glob: "node_modules/place-my-order-assets/images/**/*"
  }
});

// Build Cordova if "cordova" option passed.
if(cordova) {
  buildPromise = buildPromise.then(buildCordova);
}

// Build NW.js if "nw" optino passed.
if(nw) {
  buildPromise = buildPromise.then(buildNw);
}


function buildCordova(buildResult) {
  var cordovaOptions = {
    path: './build/cordova',
    id: 'com.bitovi.placemyorder',
    name: 'PlaceMyOrder',
    platforms: ['ios','android'],
    plugins: [
      'org.apache.cordova.statusbar'
    ],
    index: __dirname + "/app.html",
    glob: [
      "node_modules/steal/steal.production.js",
      "node_modules/place-my-order-assets/**/*"
    ]
  };

  var stealCordova = require("steal-cordova")(cordovaOptions);
  return stealCordova.build(buildResult).then(stealCordova.ios.emulate);
}

function buildNw(buildResult) {
  var nwOptions = {
    buildDir: "./build",
    platforms: ["osx64"],
    glob: [
      "package.json",
      "app.html",

      "node_modules/steal/steal.production.js",
      "node_modules/place-my-order-assets/**/*",
      "dist/**/*"
    ]
  };

  var stealNw = require("steal-nw");
  return stealNw(nwOptions, buildResult);
}

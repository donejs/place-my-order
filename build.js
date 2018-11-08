var buildCordova = process.argv.indexOf("cordova") > 0;
var buildElectron = process.argv.indexOf("electron") > 0;

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
// options added by `donejs add cordova` - START
var cordovaOptions = {
  buildDir: "./build/cordova",
  id: "com.donejs.placemyorder",
  name: "place my order",
  platforms: ["ios"],
  plugins: ["cordova-plugin-transport-security"],
  index: __dirname + "/production.html",
  glob: [
    "node_modules/place-my-order-assets/images/**/*"
  ]
};

var stealCordova = require("steal-cordova")(cordovaOptions);

if(buildCordova) {
  buildPromise.then(stealCordova.build).then(stealCordova.ios.emulate);
}
// options added by `donejs add cordova` - END
// options added by `donejs add electron` - START
var electronOptions = {
  main: "electron-main.js",
  buildDir: "./build",
  platforms: ["darwin"],
  archs: ["x64"],
  glob: [
    "package.json",
    "production.html",
    "node_modules/steal/steal.production.js"
  ]
};

var stealElectron = require("steal-electron");

if(buildElectron) {
  buildPromise = buildPromise.then(function(buildResult){
    return stealElectron(electronOptions, buildResult);
  }).catch(function(err) {
    console.log(err);
  });
}
// options added by `donejs add electron` - END

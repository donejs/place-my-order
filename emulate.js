var android = !!~process.argv.indexOf("android");

var platform = android ? "android" : "ios";

var cordovaOptions = {
  path: './build/cordova',
  id: 'com.bitovi.placemyorder',
  name: 'PlaceMyOrder',
  platforms: ['ios', 'android'],
  plugins: [
    'org.apache.cordova.statusbar'
  ]
};

require("steal-tools");

var stealCordova = require("steal-cordova")(cordovaOptions);
return stealCordova[platform].emulate();

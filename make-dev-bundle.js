var path = require("path");
var bundle = require("steal-tools/lib/build/bundle");

var config = {
  config: path.join(__dirname, "package.json!npm")
};

var options = {
  minify: false,
  filter: ["node_modules/**/*", "package.json"]
};

bundle(config, options)
  .then(function() {
    console.log("DONE!");
  })
  .then(null, function(err) {
    console.log("FAILED: ", err);
  });

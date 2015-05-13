"format cjs";

// Imports
var loader = require("@loader");
var getIntermediateAndImports = require("can/view/stache/intermediate_and_imports");
var stache = require("can/view/stache/stache");
require("can/view/import/import");

// Exports
exports.translate = translate;


var isNode = typeof process === "object" &&
  {}.toString.call(process) === "[object process]";

var renderToString = function(url){
  var state = new this.viewModel;
  state.attr(can.route.deparam(url));
  var doc = new document.constructor;

  var renderPromise = can.view.renderAsync(this.render, state, {}, doc)
  .then(function(result){
    var html = doc.body.innerHTML;

    //triggerInBody("removed");
    //doc.documentElement.removeChild(doc.body);

    return html;
  });

  return renderPromise;
};

if(isNode) {
  trace();
}

function trace(){
  var bundles = {};
  var parentMap = {};

  setAsBundle(loader.main);

  loader.set("asset-register", loader.newModule({
    __useDefault: true,
    "default": assetRegister
  }));

  stache.registerHelper("asset", assetHelper);

  function setAsBundle(name){
    return loader.normalize(name).then(function(name) {
      if(!bundles[name]) bundles[name] = {};
    });
  }

  function assetRegister(entry){
    var id = entry.id;
    var bundle = findBundle(id);

    bundle[id] = {
      type: entry.type,
      value: entry.value
    };


    // TODO recurse through parents and find the bundle.
  }

  function findBundle(moduleName){
    var parent = parentMap[moduleName],
      bundleName = parent;
    while(parent) {
      parent = parentMap[parent];
      if(parent) bundleName = parent;
    }
    return bundles[bundleName];
  }

  function assetHelper(type){
    var assets = this.attr("@assets");
    assets.attr("length");

    console.log("BUNDLES", bundles['app/order/history/history']);

    var frag = document.createDocumentFragment();
    assets.each(function(moduleName){
      var bundle = findBundle(moduleName) || bundles[moduleName];

      if(bundle) {
        Object.keys(bundle).forEach(function(childName){
          var asset = bundle[childName];
          if(asset) {
            var clone = asset.value.cloneNode(true);
            frag.appendChild(clone);
          }
        });
      }
    });

    console.log("ASSETS:", assets.attr())

    return frag;
  }

  var loaderImport = loader.import;
  loader.import = function(name){
    var loader = this, args = arguments;
    return setAsBundle(name).then(function(){
      return loaderImport.apply(loader, args);
    });
  };

  var normalize = loader.normalize;
  loader.normalize = function(name, parentName){
    var promise = Promise.resolve(normalize.apply(this, arguments));

    return promise.then(function(normalizedName){
      if(parentName) {
        parentMap[normalizedName] = parentName;
      }
      return normalizedName;
    });
  };

  var canImport = can.view.callbacks._tags["can-import"];
  can.view.callbacks._tags["can-import"] = function(el, tagData){
    var root = tagData.scope.attr("@root");
    if(!root.attr("@assets")) {
      root.attr("@assets", []);
    }

    var moduleName = el.getAttribute("from");

    // Override waitFor temporarily.
    var waitFor = root.waitFor;
    root.waitFor = function(dfd){
      dfd = dfd.then(function(val){
        console.log("waiting for", moduleName)

        var newDfd = new can.Deferred();

        loader.normalize(moduleName).then(function(name){
          root.attr("@assets").push(name);
          newDfd.resolve(val);
        });

        return newDfd;
      });
      waitFor.call(this, dfd);
    };

    canImport.apply(this, arguments);

    root.waitFor = waitFor;
  };



}

function translate(load){
  var intermediateAndImports = getIntermediateAndImports(load.source);

  var ases = intermediateAndImports.ases;
  var imports = intermediateAndImports.imports;
  var args = [];
  can.each(ases, function(from, name){
    // Move the as to the front of the array.
    imports.splice(imports.indexOf(from), 1);
    imports.unshift(from);
    args.unshift(name);
  });
  imports.unshift("can/view/stache/stache");
  args.unshift("stache");

  return "define("+JSON.stringify(intermediateAndImports.imports)+",function(" +
    args.join(", ") + "){\n" +
    "var __export = {\n" +
    "\trender: stache(" + JSON.stringify(intermediateAndImports.intermediate) + "),\n" +
    "\trenderToString: " + renderToString.toString() + ",\n" +
    can.map(ases, function(from, name){
      return "\t" + name + ": " + name +"['default'] || " + name;
    }).join(",\n") +
    "\n};\n\n" +
    /*"if(typeof steal !== 'undefined' && !(typeof process === 'object' && {}.toString.call(process) === '[object process]')) steal.done().then(function() { __export.start(); });\n" +*/
    "return __export;\n" +
  "});";
}


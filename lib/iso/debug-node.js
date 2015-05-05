var Steal = require('steal');
var steal = Steal.clone();
var path = require("path");
global.System = steal.System;

steal.config({
    config: path.join(__dirname, "..", "/public/package.json!npm"),
    main: "app/main.stache!"
  });

steal.import("app/main.stache!can/view/autorender/system",
                              "app/layout.stache!").then(function(resolveds){
	var main = resolveds[0], 
		layout = resolveds[1];
	
	main.renderNode("/restaurants").then(function(frag){
      var layoutFrag = layout({}, { 
        styles: function(){
		  var head = document.documentElement.getElementsByTagName("head")[0];
		  var styles = head.getElementsByTagName("style");
		
		  var frag = document.createDocumentFragment();
		  (styles || []).map(function(style){
		    var cloned = style.cloneNode(true);
		    frag.appendChild(cloned);
		  });
		  return frag;
		},
        content: function() {return frag; }
      });

      var div = document.createElement("div");
      div.appendChild(layoutFrag);
      console.log(div.innerHTML);
    }); 	
});
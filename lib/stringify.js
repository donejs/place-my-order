export default function(frag){
  const newDocument = clone(document);
  const doc = newDocument.documentElement;
  const body = doc.getElementsByTagName("body")[0];
  body.appendChild(frag);
  body.appendChild(stealScript(newDocument));
  return newDocument.documentElement.outerHTML;
};

function clone(document){
  const Document = document.constructor;
  const doc = new Document();
  doc.documentElement.innerHTML = document.documentElement.innerHTML;
  return doc;
}

function stealScript(document){
  const script = document.createElement("script");
  script.setAttribute("src", "node_modules/steal/steal.js");
  return script;
}


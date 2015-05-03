export default function(){
  const head = document.documentElement.getElementsByTagName("head")[0];
  const styles = head.getElementsByTagName("style");

  const frag = document.createDocumentFragment();
  (styles || []).map(function(style){
    const cloned = style.cloneNode(true);
    frag.appendChild(cloned);
  });
  return frag;
};

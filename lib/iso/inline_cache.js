export default function(data){
  return function(el){
    const text = document.createTextNode("\nwindow.INLINE_CACHE = " + JSON.stringify(data) + ";\n");
    el.appendChild(text);
  };
};

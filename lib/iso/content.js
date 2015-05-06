export default function(html){
  const div = document.createElement("div");
  div.innerHTML = html;
  const frag = document.createDocumentFragment();

  let cur = div.firstChild;
  while(cur) {
    div.removeChild(cur);
    frag.appendChild(cur);
    cur = div.firstChild;
  }
  return frag;
};

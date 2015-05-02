export default function(steal){
  const loader = steal.System;
  return loader.newModule({
    __useDefault: true,
    default: {
      translate: function(){
        return "";
      }
    }
  });
};

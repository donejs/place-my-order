import Map from 'can/map/';
import 'can/map/define/define';

export default Map.extend({
  pageData(name, params, dfd) {
    let root = this.attr('@root');
    if(root && can.isFunction(root.pageData)) {
      root.pageData(name, params, dfd);
    }
    return dfd;
  }
});

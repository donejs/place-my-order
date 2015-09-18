import AppMap from "can-ssr/app-map";
import route from 'can/route/route';
import 'can/route/pushstate/pushstate';
import $ from 'jquery';
import platform from 'steal-platform';
import loader from "@loader";
import 'can/map/define/';

if(platform.isCordova || platform.isNW) {
  route.defaultBinding = "hashchange";
}

const pages = {
  "home": true,
  "restaurants": true,
  "orders": true
};

const AppState = AppMap.extend({
  define: {
    page: {
      set: function(val){
        if(!pages[val]) {
          this.pageStatus(404, "Not a valid page: " + val);
        }
        return val;
      }
    }
  }
});

route(':page', { page: 'home' });
route(':page/:slug', { slug: null });
route(':page/:slug/:action', { slug: null, action: null });

$('body').on('click', 'a[href="javascript://"]', ev => ev.preventDefault());

export default AppState;

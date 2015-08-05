import AppMap from "can-ssr/app-map";
import route from 'can/route/route';
import 'can/route/pushstate/pushstate';
import $ from 'jquery';
import platform from 'steal-platform';
import loader from "@loader";

if(platform.isCordova || platform.isNW) {
  route.defaultBinding = "hashchange";
}

const AppState = AppMap.extend({});

route(':page', { page: 'home' });
route(':page/:slug', { slug: null });
route(':page/:slug/:action', { slug: null, action: null });

$('body').on('click', 'a[href="javascript://"]', ev => ev.preventDefault());

export default AppState;

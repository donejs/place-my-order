import route from 'can/route/route';
import 'can/route/pushstate/pushstate';
import $ from 'jquery';
import platform from 'steal-platform';

if(platform.isCordova || platform.isNW) {
  route.defaultBinding = "hashchange";
}

route(':page', { page: 'home' });
route(':page/:slug', { slug: null });
route(':page/:slug/:action', { slug: null, action: null });

$('body').on('click', 'a[href="javascript://"]', ev => ev.preventDefault());

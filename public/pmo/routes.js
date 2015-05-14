import route from 'can/route/route';
import 'can/route/pushstate/pushstate';
import $ from 'jquery';

route(':page', { page: 'home' });
route(':page/:slug', { slug: null });
route(':page/:slug/:action', { slug: null, action: null });

$('body').on('click', 'a[href="javascript://"]', ev => ev.preventDefault());

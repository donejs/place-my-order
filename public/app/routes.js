import route from 'can/route/route';
import 'can/route/pushstate/pushstate';

route(':page', { page: 'home' });
route(':page/:slug', { slug: null });
route(':page/:slug/:action', { slug: null, action: null });

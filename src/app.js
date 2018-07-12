import { DefineMap, route, RoutePushstate } from "can";

const AppViewModel = DefineMap.extend({
  page: 'string',
  slug: 'string',
  action: 'string',
  title: {
    default: 'place-my-order',
    serialize: false
  }
});

route.urlData = new RoutePushstate();
route.register('{page}', { page: 'home' });
route.register('{page}/{slug}', { slug: null });
route.register('{page}/{slug}/{action}', { slug: null, action: null });
route.start();

export default AppViewModel;

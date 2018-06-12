import { DefineMap, route } from "can";
import "can-route-pushstate";

const AppViewModel = DefineMap.extend({
  page: 'string',
  slug: 'string',
  action: 'string',
  title: {
    default: 'place-my-order',
    serialize: false
  }
});

route.register('{page}', { page: 'home' });
route.register('{page}/{slug}', { slug: null });
route.register('{page}/{slug}/{action}', { slug: null, action: null });

export default AppViewModel;

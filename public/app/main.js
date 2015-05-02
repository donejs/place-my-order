import $ from 'jquery';
import route from 'can/route/route';
import 'can/route/pushstate/pushstate';
import Map from 'can/map/map';

import 'less/styles.less!';

const AppState = Map.extend({});
let state = new AppState();

$(() => {
  route(':page', { page: 'home' });
  route(':page/:slug', { slug: null });
  route(':page/:slug/:action', { slug: null, action: null });
  route.map(state);

  route.ready();
});

import $ from 'jquery';
import route from 'can/route/route';
import 'can/route/pushstate/pushstate';
import Map from 'can/map/map';

import main from './main.stache!';
import 'less/styles.less!';

const AppState = Map.extend({});

$(() => {
  let state = new AppState();

  route(':page', { page: 'home' });
  route('restaurants/:restaurantId');
  route.map(state);

  $('body').append(main(state));
  route.ready();
});

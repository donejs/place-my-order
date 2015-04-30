import Component from 'can/component/component';
import template from './list.stache!';
import Restaurant from 'app/models/restaurant';

export default Component.extend({
  tag: 'app-restaurant-list',
  template,
  viewModel: {
    restaurants: new Restaurant.List({})
  }
});

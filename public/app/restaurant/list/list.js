import Component from 'can/component/component';
import template from './list.stache!';
import Restaurant from 'app/models/restaurant';

export default Component.extend({
  tag: 'app-restaurant-list',
  template,
  scope: {
    restaurants: new Restaurant.List({})
  }
});

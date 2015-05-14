import Component from 'can/component/component';
import Map from 'can/map/';
import 'can/map/define/';

import template from './details.stache!';
import Restaurant from 'pmo/models/restaurant';

export const ViewModel = Map.extend({
  define: {
    restaurant: {
      get(old) {
        let _id = this.attr('slug');
        if(!old && _id) {
          let params = { _id };
          let restaurant = Restaurant.findOne(params);
          return this.attr('@root').pageData("restaurant", params, restaurant);
        }

        return old;
      }
    }
  }
});

export default Component.extend({
  tag: 'pmo-restaurant-details',
  viewModel: ViewModel,
  template
});

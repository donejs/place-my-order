import Component from 'can/component/component';
import template from './details.stache!';
import Restaurant from 'app/models/restaurant';
import BaseViewModel from 'app/viewmodel';

export const ViewModel = BaseViewModel.extend({
  define: {
    restaurant: {
      get(old) {
        let _id = this.attr('slug');
        if(!old && _id) {
          let params = { _id };
          let restaurant = Restaurant.findOne(params);
          return this.pageData("restaurant", params, restaurant);
        }

        return old;
      }
    }
  }
});

export default Component.extend({
  tag: 'app-restaurant-details',
  viewModel: ViewModel,
  template
});

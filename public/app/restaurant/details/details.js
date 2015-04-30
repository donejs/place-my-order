import Component from 'can/component/component';
import template from './details.stache!';
import Restaurant from 'app/models/restaurant';
import Map from 'can/map/map';
import 'can/map/define/define';

export default Component.extend({
  tag: 'app-restaurant-details',
  template,
  viewModel: Map.extend({
    define: {
      restaurant: {
        get(old) {
          let id = this.attr('restaurantId');
          if(!old && id) {
            return Restaurant.findOne({ id });
          }

          return old;
        }
      }
    }
  })
});

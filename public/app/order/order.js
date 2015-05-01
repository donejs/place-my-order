import Component from 'can/component/component';
import template from './order.stache!';
import Map from 'can/map/map';
import Restaurant from 'app/models/restaurant';
import Order from 'app/models/order';

export const ViewModel = Map.extend({
  define: {
    order: {
      Value: Order
    },
    saveStatus: {
      value: {}
    },
    restaurant: {
      get(old) {
        let _id = this.attr('slug');
        if(!old && _id) {
          return Restaurant.findOne({ _id }).then(restaurant => {
            this.attr('order.restaurant', restaurant.attr('_id'));
            return restaurant;
          });
        }

        return old;
      }
    }
  },

  select(item, add) {
    var items = this.attr('order.items');
    if(add) {
      items.push(item);
    } else {
      items.splice(items.indexOf(item), 1);
    }
  },

  placeOrder() {
    let order = this.attr('order');
    this.attr('saveStatus', order.save());
    return false;
  }
});

export default Component.extend({
  tag: 'app-order',
  viewModel: ViewModel,
  template
});

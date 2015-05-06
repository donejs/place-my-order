import Component from 'can/component/component';
import template from './order.stache!';
import BaseViewModel from 'app/viewmodel';
import Restaurant from 'app/models/restaurant';
import Order from 'app/models/order';

export const ViewModel = BaseViewModel.extend({
  define: {
    order: {
      Value: Order
    },
    saveStatus: {
      Value: Object
    },
    restaurant: {
      get(old) {
        let _id = this.attr('slug');
        if(!old && _id) {
          let dfd = Restaurant.findOne({ _id }).then(restaurant => {
            this.attr('order.restaurant', restaurant.attr('_id'));
            return restaurant;
          });

          this.pageData('restaurant', { _id }, dfd);

          return dfd;
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

import Component from 'can/component/component';
import Order from 'app/models/order';
import Map from 'can/map/';
import 'can/map/define/';

import template from './history.stache!';
import ordersTemplate from './list.stache!';

export const ViewModel = Map.extend({
  define: {
    orders: {
      get() {
        return this.attr('@root').pageData('orders', {}, Order.findAll({}));
      }
    }
  },
  markAs(order, status) {
    order.attr('status', status);
    order.save();
  },
  ordersTemplate
});

export default Component.extend({
  tag: 'app-order-history',
  viewModel: ViewModel,
  template
});

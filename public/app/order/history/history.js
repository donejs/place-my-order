import Component from 'can/component/component';
import Order from 'app/models/order';
import BaseViewModel from 'app/viewmodel';
import template from './history.stache!';
import ordersTemplate from './list.stache!';

export const ViewModel = BaseViewModel.extend({
  define: {
    orders: {
      get() {
        return this.pageData('orders', {}, Order.findAll({}));
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

import Component from 'can/component/component';
import template from './history.stache!';
import Order from 'app/models/order';

export default Component.extend({
  tag: 'app-order-history',
  viewModel: {
    orders: Order.findAll({}),
    deleteOrder(order) {
      order.destroy();
    }
  },
  template
});

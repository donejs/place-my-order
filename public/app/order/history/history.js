import Component from 'can/component/component';
import template from './history.stache!';
import Order from 'app/models/order';
import Map from 'can/map/map';
import 'can/map/define/define';

export const ViewModel = Map.extend({
  define: {
    orders: {
      get() {
        return this.attr("@root").pageData("orders", {}, Order.findAll({}));
      }
    }
  },
  deleteOrder(order) {
    order.destroy();
  }
});

export default Component.extend({
  tag: 'app-order-history',
  viewModel: ViewModel,
  template
});

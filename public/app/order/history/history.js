import Component from 'can/component/component';
import template from './history.stache!';
import Order from 'app/models/order';
import BaseViewModel from 'app/viewmodel';

export const ViewModel = BaseViewModel.extend({
  define: {
    orders: {
      get() {
        return this.pageData('orders', {}, Order.findAll({}));
      }
    }
  }
});

export default Component.extend({
  tag: 'app-order-history',
  viewModel: ViewModel,
  template
});

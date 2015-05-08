import Component from 'can/component/component';
import Order from 'app/models/order';
import Map from 'can/map/';
import 'can/map/define/';

import template from './history.stache!';
import orderItems from './order-items.stache!';

export default Component.extend({
  tag: 'app-order-history',
  viewModel: { orderItems },
  template
});

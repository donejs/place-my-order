import Component from 'can/component/component';
import Order from 'pmo/models/order';
import Map from 'can/map/';
import 'can/map/define/';

import template from './history.stache!';
import orderItems from './order-items.stache!';
import './history.less!';

export default Component.extend({
  tag: 'pmo-order-history',
  viewModel: { orderItems },
  template
});

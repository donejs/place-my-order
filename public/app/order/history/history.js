import Component from 'can/component/component';
import Order from 'app/models/order';
import Map from 'can/map/';
import 'can/map/define/';

import template from './history.stache!';
import ordersTemplate from './list.stache!';
import actionButton from './action-button.stache!';
import './history.less!';

export default Component.extend({
  tag: 'app-order-history',
  viewModel: { ordersTemplate, actionButton },
  template
});

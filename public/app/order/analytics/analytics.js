import Component from 'can/component/component';
import Order from 'app/models/order';
import 'ui/bit_graph/bit_graph';
import template from './analytics.stache!';

export default Component.extend({
  tag: 'app-order-analytics',
  template: template
});

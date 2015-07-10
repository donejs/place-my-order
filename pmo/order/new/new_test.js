import 'steal-qunit';
import 'pmo/models/fixtures/';
import AppState from '../../app';
import Order from 'pmo/models/order';
import { ViewModel } from './new';

QUnit.module('Order ViewModel');

test('Default order is initialized', () => {
  let vm = new ViewModel();
  ok(vm.attr('order') instanceof Order);
});

test('canPlaceOrder indicates whether the order has items', () => {
  let vm = new ViewModel();
  let items = vm.attr('order.items');

  let item = {
    name: 'pabellon criollo',
    price: 35.90
  };

  ok(!items.attr('length'), 'order has no items');
  ok(!vm.attr('canPlaceOrder'), 'user can not place order without items');

  items.push(item);

  equal(items.attr('length'), 1, 'order has 1 item');
  ok(vm.attr('canPlaceOrder'), 'user can place the order');
});

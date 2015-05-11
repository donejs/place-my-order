import 'steal-qunit';
import 'app/models/fixtures/';
import AppState from '../appstate';
import Order from 'app/models/order';
import { ViewModel } from './order';

QUnit.module('Order ViewModel');

test('Default order is initialized', () => {
  let vm = new ViewModel();
  ok(vm.attr('order') instanceof Order);
});


asyncTest('Setting slug gets a restaurant and it is added to order', () => {
  let vm = new ViewModel({ slug: 'spago', '@root': new AppState() });
  let deferred = vm.attr('restaurant');

  deferred.then(restaurant => {
    equal(restaurant.attr('name'), 'Spago', 'Got expected restaurant');
    equal(vm.attr('order.restaurant'), restaurant.attr('_id'),
      'Restaurant set on order');
    start();
  });
});

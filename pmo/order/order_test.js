import 'steal-qunit';
import 'pmo/models/fixtures/';
import AppState from '../appstate';
import Order from 'pmo/models/order';
import { ViewModel } from './order';

QUnit.module('Order ViewModel');

test('Default order is initialized', () => {
  let vm = new ViewModel();
  ok(vm.attr('order') instanceof Order);
});

test('Adding and removing menu items to the order', () => {
  let vm = new ViewModel({
    restaurant: {
      "menu": {
        "lunch": [{
          "name": "Spinach Fennel Watercress Ravioli",
          "price": 35.99
        }]
      }
    }
  });
  let item = vm.attr('restaurant.menu.lunch.0');

  vm.toggle(item, true);
  equal(vm.attr('order.items.0'), item, 'Item added to order');
  vm.toggle(item);
  equal(vm.attr('order.items.length'), 0, 'Item removed from order')
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

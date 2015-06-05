import 'steal-qunit';
import Order from './order';

QUnit.module('Order Model');

test('Calculates item price total', () => {
  let order = new Order({});
  order.attr('items').push({ price: 2 });
  order.attr('items').push({ price: 5 });

  equal(order.attr('total'), 7, 'Order total calculated');
});

test('Calculates and parses item price total', () => {
  let order = new Order({});
  order.attr('items').push({ price: '2' });
  order.attr('items').push({ price: '3' });

  equal(order.attr('total'), 5, 'Order total calculated');
});

test('Adding and removing menu items to the order', () => {
  let order = new Order({});
  let items = order.attr('items');

  let item = new can.Map({
    "name": "Spinach Fennel Watercress Ravioli",
    "price": 35.99
  });

  ok(!items.has(item), 'items should be empty');
  equal(items.attr('length'), 0, 'there are no items');

  items.toggle(item);
  ok(items.has(item), 'item added');

  items.toggle(item);
  ok(!items.has(item), 'items should be empty');
  equal(items.attr('length'), 0, 'the item was removed');
});

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

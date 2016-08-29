import QUnit from 'steal-qunit';
import Order from './order';

QUnit.module('models/order');

QUnit.test('getList', function(){
  stop();
  Order.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});

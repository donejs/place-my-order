import QUnit from 'steal-qunit';
import State from './state';

QUnit.module('models/state');

QUnit.test('getList', function(){
  stop();
  State.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});

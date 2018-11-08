import QUnit from 'steal-qunit';
import City from './city';

QUnit.module('models/city');

QUnit.test('getList', function(){
  stop();
  City.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});

import QUnit from 'steal-qunit';
import { ViewModel } from './new';

// ViewModel unit tests
QUnit.module('place-my-order/order/new');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the pmo-order-new component');
});

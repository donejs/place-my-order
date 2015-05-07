import QUnit from 'steal-qunit';
import userInfo from 'app/order/user-info/user-info.component!';
import Order from 'app/models/order';

const { viewModel: UserInfo } = userInfo;

QUnit.module('UserInfo ViewModel');

test('nameError is false when showErrors.name is false', function(){
  let userInfo = new UserInfo({ order: new Order() });
  userInfo.attr('showErrors.name', false);

  equal(userInfo.attr('nameError'), false, 'There are no name errors');
});

test('addressError is true if showErrors.address is true and order.address is blank', function(){
  let userInfo = new UserInfo({ order: new Order() });
  userInfo.attr('showErrors.address', true);
  userInfo.attr('order.address', '');

  equal(userInfo.attr('addressError'), true, 'There is an address error now');
});

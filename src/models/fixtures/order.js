import fixture from 'can-fixture';
import Order from '../order';

const store = fixture.store([{
  _id: 0,
  description: 'First item'
}, {
  _id: 1,
  description: 'Second item'
}], Order.connection.algebra);

fixture('/api/orders/{_id}', store);

export default store;

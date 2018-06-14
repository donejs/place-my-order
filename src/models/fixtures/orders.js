import { fixture } from 'can';
import Order from '../order';

const store = fixture.store([{
  _id: 0,
  description: 'First item'
}, {
  _id: 1,
  description: 'Second item'
}], Order.connection.queryLogic);

fixture('/api/orders/{_id}', store);

export default store;

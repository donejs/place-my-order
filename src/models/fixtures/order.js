import fixture from 'can-fixture';

const store = fixture.store([{
  _id: 0,
  description: 'First item'
}, {
  _id: 1,
  description: 'Second item'
}]);

fixture({
  'GET /api/orders': store.findAll,
  'GET /api/orders/{_id}': store.findOne,
  'POST /api/orders': store.create,
  'PUT /api/orders/{_id}': store.update,
  'DELETE /api/orders/{_id}': store.destroy
});

export default store;

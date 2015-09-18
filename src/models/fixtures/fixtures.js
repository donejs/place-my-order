import fixture from 'can/util/fixture/';

fixture('GET /api/restaurants', '/src/models/fixtures/restaurants.json');
fixture('GET /api/restaurants/{_id}', '/src/models/fixtures/spago.json');

export default fixture;

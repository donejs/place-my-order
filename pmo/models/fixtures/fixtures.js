import fixture from 'can/util/fixture/';

fixture('GET /api/restaurants', '/pmo/models/fixtures/restaurants.json');
fixture('GET /api/restaurants/{_id}', '/pmo/models/fixtures/spago.json');

export default fixture;

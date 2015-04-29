import path from 'path';
import feathers from 'feathers';
import mongodb from 'feathers-mongodb';

const connectionString = 'mongodb://localhost:27017/place-my-order';

export const app = feathers()
  .configure(feathers.rest())
  .use('api/restaurants', mongodb({
    collection: 'restaurants',
    connectionString
  }))
  .use('api/menus', mongodb({
    collection: 'menus',
    connectionString
  }))
  .use('api/orders', mongodb({
    collection: 'orders',
    connectionString
  }))
  .use('/', feathers.static(path.join(__dirname, '..', 'public')));

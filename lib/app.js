import path from 'path';
import feathers from 'feathers';
import mongodb from 'feathers-mongodb';

const db = 'mongodb://localhost:27017/place-my-order';

export const app = feathers()
  .use('/restaurants', mongodb({
    collection: 'restaurants',
    db
  }))
  .use('/menus', mongodb({
    collection: 'menus',
    db
  }))
  .use('/orders', mongodb({
    collection: 'orders',
    db
  }))
  .use('/', feathers.static(path.join(__dirname, '..', 'public')));

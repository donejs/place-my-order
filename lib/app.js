import path from 'path';
import feathers from 'feathers';
import bodyParser from 'body-parser';
import mongodb from 'feathers-mongodb';

const connectionString = 'mongodb://localhost:27017/place-my-order';
const restaurants = mongodb({
  collection: 'restaurants',
  connectionString
}).extend({
  get(id, params, callback) {
    let _super = this._super.bind(this);
    // Slug can be equivalent to ID when finding a restaurant
    this.find({ query: { slug: id } }, (error, data) => {
      if(data && data.length === 1) {
        return callback(null, data[0]);
      }

      return _super(id, params, callback);
    });
  }
});

export const app = feathers()
  .configure(feathers.rest())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use('api/restaurants', restaurants)
  .use('api/orders', mongodb({
    collection: 'orders',
    connectionString
  }))
  .use('/', feathers.static(path.join(__dirname, '..', 'public')))
  .use(function(req, res, next) {
    res.status(404);
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });

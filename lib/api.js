import path from 'path';
import feathers from 'feathers';
import hooks from 'feathers-hooks';
import bodyParser from 'body-parser';
import mongodb from 'feathers-mongodb';
import config from './config';
import url from 'url';

// Hook that looks up an item by an alternate id (slug for us)
function alternateId(field) {
  return function(hook, next) {
    this.find({ query: { [field]: hook.id } }, (error, restaurants) => {
      if(restaurants && restaurants.data.length === 1) {
        hook.id = '' + restaurants.data[0]._id;
      }

      next();
    });
  }
}

// Hook that allows properties to be requested by an array, e.g.
// orders?status[]=new&status[]=preparing
function allowArray() {
  let args = Array.prototype.slice.call(arguments);
  return function(hook, next) {
    let query = hook.params.query;
    args.forEach(function(prop) {
      if(Array.isArray(query[prop])) {
        query[prop] = { $in: query[prop] };
      }
    });
    next();
  }
}

function convertOrderItems(hook, next) {
  if(hook.data && Array.isArray(hook.data.items)) {
    hook.data.items.forEach(function(item) {
      item.price = parseFloat(item.price);
    });
  }
  next();
}

function wrapData(hook, next) {
  hook.result = {
    data: hook.result
  };

  next();
}

export default function() {
  let api = feathers()
    .configure(feathers.rest())
    .configure(feathers.socketio())
    .configure(hooks())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .get('/cities', function(req, res, next) {
      api.service('restaurants').find({}, (error, restaurants) => {
        if(error) {
          return next(error);
        }

        let cityMap = {};
        restaurants.data.forEach(restaurant => {
          let address = restaurant.address;
          if(!cityMap[address.state]) {
            cityMap[address.state] = [];
          }
          if(cityMap[address.state].indexOf(address.city) === -1) {
            cityMap[address.state].push(address.city);
          }
        });

        res.json(cityMap);
      });
    })
    .use('/restaurants', mongodb({
      collection: 'restaurants',
      connectionString: config.mongodb
    }))
    .use('/orders', mongodb({
      collection: 'orders',
      connectionString: config.mongodb
    }));

  // Override listen because we need the server to set up the API
  let oldListen = this.listen;
  this.listen = function() {
    let server = oldListen.apply(this, arguments);
    api.setup(server);
    return server;
  };

  this.api = api;
  this.use('/api', api);

  api.service('orders')
    .before(convertOrderItems)
    .before({
      find: allowArray('status')
    }).after({
      find: wrapData
    });

  api.service('restaurants').before({
    get: alternateId('slug')
  }).after({
    find: wrapData
  });
}

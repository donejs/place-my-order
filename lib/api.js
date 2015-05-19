import path from 'path';
import feathers from 'feathers';
import hooks from 'feathers-hooks';
import bodyParser from 'body-parser';
import mongodb from 'feathers-mongodb';
import url from 'url';
import madison from 'madison';
import config from './config';
import importer from './importer';

// Hook that looks up an item by an alternate id (slug for us)
function alternateId(field) {
  return function(hook, next) {
    this.find({ query: { [field]: hook.id } }, (error, results) => {
      if(results && results.data.length === 1) {
        hook.id = '' + results.data[0]._id;
      } else if(results.data.length > 1) {
        return next(new Error(`${field} has to be unique but
          found ${results.data.length} entries.`));
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

function fromRestaurants(mapper) {
  return function(req, res, next) {
    let query = {};
    Object.keys(req.query).forEach(key => query[`address.${key}`] = req.query[key]);
    req.app.service('restaurants').find({ query },
      (error, restaurants) => {
        if(error) {
          return next(error);
        }
        res.json({ data: mapper(restaurants) });
      });
  };
}

function addDelay(hook, next) {
  setTimeout(next, config.delay);
}

export default function() {
  let api = feathers()
    .configure(feathers.rest())
    .configure(feathers.socketio())
    .configure(hooks())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .get('/states', fromRestaurants(restaurants => {
      let result = {};
      restaurants.data.forEach(restaurant => {
        let short = restaurant.address.state;
        if(!result[short]) {
          result[short] = { short, name: madison.getStateNameSync(short) };
        }
      });

      return Object.keys(result).map(key => result[key]);
    }))
    .get('/cities', fromRestaurants(restaurants => {
      let result = {};
      restaurants.data.forEach(restaurant => {
        let name = restaurant.address.city;
        if(!result[name]) {
          result[name] = { name, state: restaurant.address.state };
        }
      });

      return Object.keys(result).map(key => result[key]);
    }))
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
    .before(addDelay)
    .before(convertOrderItems)
    .before({
      find: allowArray('status')
    }).after({
      find: wrapData
    });

  api.service('restaurants')
    .before(addDelay)
    .before({
      get: alternateId('slug')
    }).after({
      find: wrapData
    });

  api.service('restaurants').find({}, function(error, restaurants) {
    if(!restaurants.data.length) {
      importer(api);
    }
  });
}

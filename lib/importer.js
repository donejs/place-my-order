import maker from '../public/app/models/fixtures/restaurant-maker';

module.exports = function(api) {
  let restaurantService = api.service('restaurants');
  let orderService = api.service('orders');
  let restaurants = maker().restaurants;
  let orders = maker().orders;
  let itemsToInsert = restaurants.length + orders.length;
  let count = 0;
  let restaurantCount = 0;
  let check = () => {
    count++;
    if(count === itemsToInsert) {
      restaurantService.emit('imported', restaurants);
    }
  };

  restaurantService.store.dropDatabase(function() {
    console.log('Dropped database');
    restaurants.forEach(function(restaurant) {
      restaurantService.create(restaurant, {}, function(error, restaurant) {
        console.log('Created restaurant ' +
        restaurant.name + '(' + restaurant._id + ')');

        orders.forEach(function(order) {
          if(order.restaurantIndex === count) {

            delete order.restaurantIndex;
            order['slug'] = restaurant.slug;
            orderService.create(order, {}, function(error, order) {
              console.log('Created order', order._id, 'from', restaurant.name);
              check();
            });
          }
        });

        restaurantCount++;
        check();
      });
    });
  });
};

import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';
import baseUrl from '../service-base-url';

const Restaurant = DefineMap.extend({
  seal: false
}, {

});

const algebra = new set.Algebra(
  set.props.id('_id'),
  {
    "address.city": function(restaurantValue, paramValue, restaurant){
      return restaurant['address.city'] === restaurantValue;
    },
    "address.state": function(restaurantValue, paramValue, restaurant){
      return restaurant['address.state'] === restaurantValue;
    }
  }
);

Restaurant.List = DefineList.extend({
  '*': Restaurant
});

Restaurant.connection = superMap({
  url: baseUrl + '/api/restaurants',
  Map: Restaurant,
  List: Restaurant.List,
  name: 'restaurant',
  algebra
});

export default Restaurant;

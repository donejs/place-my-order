import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import baseUrl from '../service-base-url';

export const Restaurant = DefineMap.extend({
  seal: false
}, {

});

Restaurant.List = DefineList.extend({
  '*': Restaurant
});

export const restaurantConnection = superMap({
  url: baseUrl + '/api/restaurants',
  idProp: '_id',
  Map: Restaurant,
  List: Restaurant.List,
  name: 'restaurant'
});

tag('restaurant-model', restaurantConnection);

export default Restaurant;

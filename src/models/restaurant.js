import can from 'can';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import 'can/map/define/define';
import baseUrl from '../service-base-url';

export const Restaurant = can.Map.extend({
  define: {}
});

Restaurant.List = can.List.extend({
  Map: Restaurant
}, {});

export const restaurantConnection = superMap({
  url: baseUrl + '/api/restaurants',
  idProp: '_id',
  Map: Restaurant,
  List: Restaurant.List,
  name: 'restaurant'
});

tag('restaurant-model', restaurantConnection);

export default Restaurant;

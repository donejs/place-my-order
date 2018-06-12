import { DefineList, DefineMap, realtimeRestModel } from 'can';
import loader from '@loader';

const Restaurant = DefineMap.extend({
  seal: false
}, {
  '_id': {
    identity: true,
    type: 'any'
  }
});

Restaurant.List = DefineList.extend({
  '#': Restaurant
});

Restaurant.connection = realtimeRestModel({
  url: loader.serviceBaseURL + '/api/restaurants',
  Map: Restaurant,
  List: Restaurant.List,
  name: 'restaurant'
});

export default Restaurant;

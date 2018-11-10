import { DefineMap, DefineList, superModel } from 'can';
import loader from '@loader';

const Restaurant = DefineMap.extend({
  seal: false
}, {
  '_id': {
    type: 'any',
    identity: true
  }
});

Restaurant.List = DefineList.extend({
  '#': Restaurant
});

Restaurant.connection = superModel({
  url: loader.serviceBaseURL + '/api/restaurants',
  Map: Restaurant,
  List: Restaurant.List,
  name: 'restaurant'
});

export default Restaurant;

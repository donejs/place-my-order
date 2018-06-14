import { DefineMap, DefineList, realtimeRestModel } from 'can';
import loader from '@loader';

const City = DefineMap.extend('City', {
  seal: false
}, {
  'name': {
    identity: true,
    type: 'any'
  }
});

City.List = DefineList.extend({
  '#': City
});

City.connection = realtimeRestModel({
  url: loader.serviceBaseURL + '/api/cities',
  Map: City,
  List: City.List,
  name: 'city'
});

export default City;

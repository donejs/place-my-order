import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import baseUrl from '../service-base-url';

export const City = DefineMap.extend({
  seal: false
}, {

});

City.List = DefineList.extend({
  '*': City
});

export const cityConnection = superMap({
  url: baseUrl + '/api/cities',
  idProp: 'name',
  Map: City,
  List: City.List,
  name: 'city'
});

tag('city-model', cityConnection);

export default City;

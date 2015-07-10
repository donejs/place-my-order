import Map from 'can/map/';
import List from 'can/list/';
import superMap from 'can-connect/can/super-map/';
import baseUrl from './base-url';

const City = Map.extend({});

City.List = List.extend({});

superMap({
  url: baseUrl + '/api/cities',
  idProp: 'name',
  Map: City,
  List: City.List,
  name: 'cities'
});

export default City;

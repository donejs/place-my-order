import Map from 'can/map/';
import List from 'can/list/';
import superMap from 'can-connect/can/super-map/';

const City = Map.extend({});

City.List = List.extend({});

superMap({
  url: '/api/cities',
  idProp: 'name',
  Map: City,
  List: City.List,
  name: 'cities'
});

export default City;

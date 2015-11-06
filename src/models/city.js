import can from 'can';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import 'can/map/define/define';

export const City = can.Map.extend({
  define: {}
});

City.List = can.List.extend({
  Map: City
}, {});

export const cityConnection = superMap({
  url: '/api/cities',
  idProp: 'name',
  Map: City,
  List: City.List,
  name: 'city'
});

tag('city-model', cityConnection);

export default City;

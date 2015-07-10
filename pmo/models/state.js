import Map from 'can/map/';
import List from 'can/list/';
<<<<<<< HEAD
import superMap from 'can-connect/super-map';
import baseUrl from './base-url';
=======
import superMap from 'can-connect/can/super-map/';
>>>>>>> master

const State = Map.extend({});

State.List = List.extend({
  Map: State
});

<<<<<<< HEAD
superMap({
  resource: baseUrl + '/api/states',
=======
const connection = superMap({
  url: '/api/states',
>>>>>>> master
  idProp: 'short',
  Map: State,
  List: State.List,
  name: 'states'
});

export default connection.Map;

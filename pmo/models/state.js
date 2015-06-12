import Map from 'can/map/';
import List from 'can/list/';
import superMap from 'can-connect/super-map';
import baseUrl from './base-url';

const State = Map.extend({});

State.List = List.extend({});

superMap({
  resource: baseUrl + '/api/states',
  idProp: 'short',
  Map: State,
  List: State.List,
  name: 'states'
});

export default State;

import can from 'can';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import 'can/map/define/define';

export const State = can.Map.extend({
  define: {}
});

State.List = can.List.extend({
  Map: State
}, {});

export const stateConnection = superMap({
  url: '/api/states',
  idProp: 'short',
  Map: State,
  List: State.List,
  name: 'state'
});

tag('state-model', stateConnection);

export default State;

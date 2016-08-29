import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import baseUrl from '../service-base-url';

export const State = DefineMap.extend({
  seal: false
}, {

});

State.List = DefineList.extend({
  '*': State
});

export const stateConnection = superMap({
  url: baseUrl + '/api/states',
  idProp: 'short',
  Map: State,
  List: State.List,
  name: 'state'
});

tag('state-model', stateConnection);

export default State;

import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import baseUrl from '../service-base-url';

const algebra = new set.Algebra(
  set.props.id('short')
);

const State = DefineMap.extend({
  seal: false
}, {

});

State.List = DefineList.extend({
  '*': State
});

State.connection = superMap({
  url: baseUrl + '/api/states',
  idProp: 'short',
  Map: State,
  List: State.List,
  name: 'state',
  algebra
});

State.connection.algebra = algebra;

tag('state-model', State.connection);

export default State;

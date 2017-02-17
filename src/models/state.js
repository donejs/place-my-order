import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';
import loader from '@loader';

const State = DefineMap.extend({
  seal: false
}, {
  'short': '*'
});

const algebra = new set.Algebra(
  set.props.id('short')
);

State.List = DefineList.extend({
  '*': State
});

State.connection = superMap({
  url: loader.serviceBaseURL + '/api/states',
  Map: State,
  List: State.List,
  name: 'state',
  algebra
});

export default State;

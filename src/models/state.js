import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';
import baseUrl from '../service-base-url';

const State = DefineMap.extend({
  seal: false
}, {

});

const algebra = new set.Algebra(
  set.props.id('short')
);

State.List = DefineList.extend({
  '*': State
});

State.connection = superMap({
  url: baseUrl + '/api/states',
  Map: State,
  List: State.List,
  name: 'state',
  algebra
});

export default State;

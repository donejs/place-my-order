import { DefineMap, DefineList, superModel } from 'can';
import loader from '@loader';

const State = DefineMap.extend({
  seal: false
}, {
  'short': {
    type: 'any',
    identity: true
  }
});

State.List = DefineList.extend({
  '#': State
});

State.connection = superModel({
  url: loader.serviceBaseURL + '/api/states',
  Map: State,
  List: State.List,
  name: 'state'
});

export default State;

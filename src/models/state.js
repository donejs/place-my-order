import { DefineMap, DefineList, realtimeRestModel } from 'can';
import loader from '@loader';

const State = DefineMap.extend({
  seal: false
}, {
  'short': {
    identity: true,
    type: 'any'
  }
});

State.List = DefineList.extend({
  '#': State
});

State.connection = realtimeRestModel({
  url: loader.serviceBaseURL + '/api/states',
  Map: State,
  List: State.List,
  name: 'state'
});

export default State;

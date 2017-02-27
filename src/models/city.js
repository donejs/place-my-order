import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';
import loader from '@loader';

const City = DefineMap.extend({
  seal: false
}, {
  'name': '*'
});

const algebra = new set.Algebra(
  set.props.id('name')
);

City.List = DefineList.extend({
  '*': City
});

City.connection = superMap({
  url: loader.serviceBaseURL + '/api/cities',
  Map: City,
  List: City.List,
  name: 'city',
  algebra
});

export default City;

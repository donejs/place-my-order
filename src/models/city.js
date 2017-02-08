import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import baseUrl from '../service-base-url';

const algebra = new set.Algebra(
  set.props.id('name')
);

const City = DefineMap.extend({
  seal: false
}, {

});

City.List = DefineList.extend({
  '*': City
});

City.connection = superMap({
  url: baseUrl + '/api/cities',
  idProp: 'name',
  Map: City,
  List: City.List,
  name: 'city',
  algebra
});

City.connection.algebra = algebra;

tag('city-model', City.connection);

export default City;

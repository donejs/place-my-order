import can from 'can';
import superMap from 'can-connect/super-map';
import tag from 'can-connect/tag';
import baseUrl from './base-url';

let Restaurant = can.Map.extend({});
Restaurant.List = can.List.extend({Map: Restaurant},{});

let restaurantConnection = superMap({
	resource: baseUrl + "/api/restaurants",
	idProp: '_id',
	Map: Restaurant,
	List: Restaurant.List,
	name: "restaurant"
});

tag('restaurant-model', restaurantConnection);

export default Restaurant;

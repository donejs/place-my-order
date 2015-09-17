import can from 'can';
import tag from 'can-connect/can/tag/';
import superMap from 'can-connect/can/super-map/';
import baseUrl from '../service-base-url';

let Restaurant = can.Map.extend({});
Restaurant.List = can.List.extend({Map: Restaurant},{});

let restaurantConnection = superMap({
	url: baseUrl + "/api/restaurants",
	idProp: '_id',
	Map: Restaurant,
	List: Restaurant.List,
	name: "restaurant"
});

tag('restaurant-model', restaurantConnection);

export default Restaurant;

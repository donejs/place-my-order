import can from 'can';
import tag from 'can-connect/can/tag/';
import superMap from 'can-connect/can/super-map/';

let Restaurant = can.Map.extend({});
Restaurant.List = can.List.extend({Map: Restaurant},{});

let restaurantConnection = superMap({
	url: "/api/restaurants",
	idProp: '_id',
	Map: Restaurant,
	List: Restaurant.List,
	name: "restaurant"
});

tag('restaurant-model', restaurantConnection);

export default Restaurant;

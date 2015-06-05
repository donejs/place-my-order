import can from 'can';
import superMap from 'can-connect/super-map';
import tag from 'can-connect/tag';

let Restaurant = can.Map.extend({});
Restaurant.List = can.List.extend({Map: Restaurant},{});

let restaurantConnection = superMap({
	resource: "/api/restaurants",
	idProp: '_id',
	Map: Restaurant,
	List: Restaurant.List,
	name: "restaurant"
});

tag('restaurant-model', restaurantConnection);

export default Restaurant;

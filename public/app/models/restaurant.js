import can from 'can';
import superMap from 'can-connect/super-map';
import connect  from 'can-connect/can-connect';

let Restaurant = can.Map.extend({});
Restaurant.List = can.List.extend({Map: Restaurant},{});

superMap({
	resource: "/api/restaurants",
	idProp: '_id',
	Map: Restaurant,
	List: Restaurant.List,
	name: "restaurant"
});

export default Restaurant;

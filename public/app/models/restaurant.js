import can from 'can';
import superMap from 'can-connect/super-map';
import connect  from 'can-connect/can-connect';

var Restaurant = can.Map.extend({});
Restaurant.List = can.List.extend({Map: Restaurant},{});



var orderConnection = superMap({
	resource: "/api/restaurants",
	idProp: '_id',
	Map: Restaurant,
	List: Restaurant.List,
	name: "restaurant"
});

if(orderConnection.cacheConnection) {
	orderConnection.cacheConnection.reset();
}


export default Restaurant;
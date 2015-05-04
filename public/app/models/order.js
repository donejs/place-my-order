import 'can/map/define/define';
import can from 'can';
import superMap from 'can-connect/super-map';
import connect  from 'can-connect/can-connect';

var Order = can.Map.extend({
  define: {
    items: {
      Value: can.List
    },
    total: {
      get() {
        let total = 0.0;
        this.attr('items').forEach(item => total += parseFloat(item.attr('price')));
        return total.toFixed(2);
      }
    }
  }
});
var OrderList = can.List.extend({
	Map: Order
},{});

var orderConnection = superMap({
	resource: "/api/orders",
	idProp: '_id',
	Map: Order,
	List: OrderList,
	name: "orders"
});

if(orderConnection.cacheConnection) {
	orderConnection.cacheConnection.reset();
}



export default Order;
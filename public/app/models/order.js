import 'can/map/define/define';
import can from 'can';
import superMap from 'can-connect/super-map';
import connect  from 'can-connect/can-connect';
import socket from './socket';

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
	//orderConnection.cacheConnection.reset();
}

if(socket) {
  socket.on('api/orders created', order => orderConnection.createInstance(order));
  socket.on('api/orders updated', order => orderConnection.updateInstance(order));
  socket.on('api/orders removed', order => orderConnection.destroyInstance(order));
}

export default Order;
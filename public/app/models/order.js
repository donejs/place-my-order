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

Order.List = can.List.extend({
	Map: Order
}, {});

let orderConnection = superMap({
	resource: "/api/orders",
	idProp: '_id',
	Map: Order,
	List: Order.List,
	name: "orders"
});

if(socket) {
  socket.on('orders created', order => orderConnection.createInstance(order));
  socket.on('orders updated', order => orderConnection.updateInstance(order));
  socket.on('orders removed', order => orderConnection.destroyInstance(order));
}

export default Order;

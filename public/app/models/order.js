import 'can/map/define/define';
import can from 'can';
import superMap from 'can-connect/super-map';
import tag from 'can-connect/tag';
import set from 'can-set';
import socket from './socket';

var Order = can.Map.extend({
  define: {
    status: {
      value: 'new'
    },
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
}, {
	totals: function(){
		return this.map(function(order){
			return order.attr("total");
		});
	}
});

let orderConnection = superMap({
	resource: "/api/orders",
	idProp: '_id',
	Map: Order,
	List: Order.List,
	name: "orders"
	, compare: set.comparators.enum("status", ["new","preparing","delivery","delivered"])
});

if(socket) {
  socket.on('orders created', order => orderConnection.createInstance(order));
  socket.on('orders updated', order => orderConnection.updateInstance(order));
  socket.on('orders removed', order => orderConnection.destroyInstance(order));
}

tag('order-model', orderConnection);

export default Order;

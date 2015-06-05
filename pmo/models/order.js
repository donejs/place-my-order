import 'can/map/define/define';
import can from 'can';
import superMap from 'can-connect/super-map';
import tag from 'can-connect/tag';
import set from 'can-set';
import socket from './socket';

let ItemsList = can.List.extend({}, {
  has: function(item) {
    return this.indexOf(item) !== -1;
  },

  toggle: function(item) {
    var index = this.indexOf(item);

    if (index !== -1) {
      this.splice(index, 1);
    } else {
      this.push(item);
    }
  }
});

let Order = can.Map.extend({
  define: {
    status: {
      value: 'new'
    },
    items: {
      Value: ItemsList
    },
    total: {
      get() {
        let total = 0.0;
        this.attr('items').forEach(item => total += parseFloat(item.attr('price')));
        return total.toFixed(2);
      }
    }
  },

  markAs(status) {
    this.attr('status', status);
    this.save();
  }
});

Order.List = can.List.extend({
  Map: Order
}, {
  totals(){
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
  name: "orders",
  compare: set.comparators.enum("status", ["new","preparing","delivery","delivered"])
});

if(socket) {
  socket.on('orders created', order => orderConnection.createInstance(order));
  socket.on('orders updated', order => orderConnection.updateInstance(order));
  socket.on('orders removed', order => orderConnection.destroyInstance(order));
}

tag('order-model', orderConnection);

export default Order;

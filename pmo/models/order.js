import 'can/map/define/define';
import can from 'can';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import canSet from 'can-set';
import socket from './socket';
import baseUrl from './base-url';

export const ItemsList = can.List.extend({}, {
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
}, {});

export const orderConnection = superMap({
  url: baseUrl + "/api/orders",
  idProp: '_id',
  Map: Order,
  List: Order.List,
  name: "orders",
  compare: canSet.comparators.enum("status", ["new","preparing","delivery","delivered"])
});

tag('order-model', orderConnection);

if(socket) {
  socket.on('orders created', order => orderConnection.createInstance(order));
  socket.on('orders updated', order => orderConnection.updateInstance(order));
  socket.on('orders removed', order => orderConnection.destroyInstance(order));
}

export default Order;

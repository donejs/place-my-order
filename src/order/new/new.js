import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './new.stache';
import Restaurant from 'place-my-order/models/restaurant';
import Order from 'place-my-order/models/order';

export const ViewModel = DefineMap.extend({
  slug: 'string',
  restaurant: Restaurant,
  order: {
    Value: Order
  },
  saveStatus: '*',
  canPlaceOrder: {
    get() {
      return !!this.order.items.length;
    }
  },

  placeOrder(event) {
    let order = this.order;
    order.restaurant = this.restaurant._id;
    this.saveStatus = order.save();

    event.preventDefault();
  },

  startNewOrder() {
    this.order = new Order();
    this.saveStatus = null;
    return false;
  }
});

export default Component.extend({
  tag: 'pmo-order-new',
  ViewModel,
  view
});

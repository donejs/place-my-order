/**
 * @module {Module} new <pmo-order-new>
 * @parent pmo
 */
import Component from 'can/component/component';
import Map from 'can/map/';
import 'can/map/define/';
import template from './new.stache!';
import Restaurant from 'place-my-order/models/restaurant';
import Order from 'place-my-order/models/order';

/**
 * @property {can.Map} new.ViewModel
 * @parent new
 */
export const ViewModel = Map.extend({
  define: {
    /**
     * @property {String} new.ViewModel.slug
     * @parent new.ViewModel
     * The restaurants slug (short name). Will
     * be used to request the actual restaurant.
     */
    slug: {
      type: 'string'
    },
    /**
     * @property {pmo/models/order} new.ViewModel.order
     * @parent new.ViewModel
     *
     * The order that is being processed. Will
     * be an empty new order initially.
     */
    order: {
      Value: Order
    },
    /**
     * @property {can.Deferred} new.ViewModel.saveStatus
     * @parent new.ViewModel
     *
     * A deferred that contains the status of the order when
     * it is being saved.
     */
    saveStatus: {
      Value: Object
    },
    /**
     * @property {Boolean} new.ViewModel.canPlaceOrder
     * @parent new.ViewModel
     *
     * A flag to enable / disable the "Place my order" button.
     */
    canPlaceOrder: {
      get() {
        return !!this.attr('order.items.length');
      }
    }
  },

  /**
   * @function {Function} new.ViewModel.placeOrder
   * @parent new.ViewModel
   * Save the current order and update the status Deferred.
   * @return {boolean} false to prevent the form submission
   */
  placeOrder() {
    let order = this.attr('order');
    order.attr('restaurant', this.attr('restaurant._id'));
    this.attr('saveStatus', order.save());
    return false;
  },

  /**
   * @function {Function} new.ViewModel.startNewOrder
   * @parent new.ViewModel
   * Resets the order form, so a new order can be placed.
   * @return {boolean} false to prevent the form submission
   */
  startNewOrder: function() {
    this.attr('order', new Order());
    this.attr('saveStatus', null);
    return false;
  }
});

export default Component.extend({
  tag: 'pmo-order-new',
  viewModel: ViewModel,
  template
});

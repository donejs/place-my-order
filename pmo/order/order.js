import Component from 'can/component/component';
import Map from 'can/map/';
import 'can/map/define/';
import template from './order.stache!';
import Restaurant from 'pmo/models/restaurant';
import Order from 'pmo/models/order';

export const ViewModel = Map.extend({
  define: {
    /**
     * @property {String} slug
     *
     * The restaurants slug (short name). Will
     * be used to request the actual restaurant.
     */
    slug: {
      type: 'string'
    },
    /**
     * @property {pmo/models/order} order
     *
     * The order that is being processed. Will
     * be an empty new order inititally.
     */
    order: {
      Value: Order
    },
    /**
     * @property {can.Deferred} saveStatus
     *
     * A deferred that contains the status of the order when
     * it is being saved.
     */
    saveStatus: {
      Value: Object
    },
    /**
     * @property {Boolean} canPlaceOrder
     *
     * A flag to enable / disable the "Place my order" button.
     */
    canPlaceOrder: {
      type: 'boolean',
      get() {
        let items = this.attr('order.items');
        return items.attr('length');
      }
    },
    /**
     * @property {can.Deferred} restaurant
     *
     * The restaurant instance as a Deferred.
     */
    restaurant: {
      /**
       * Returns a Deferred that gets a restaurant based on the `slug`
       * set in this component and sets the orders restaurant id.
       *
       * @param {can.Deferred} old The previous value
       * @returns {can.Deferred}
       */
      get(old) {
        let _id = this.attr('slug');
        if(!old && _id) {
          let dfd = Restaurant.findOne({ _id }).then(restaurant => {
            this.attr('order.slug', restaurant.attr('slug'));
            return restaurant;
          });

          this.attr('@root').pageData('restaurant', { _id }, dfd);

          return dfd;
        }

        return old;
      }
    }
  },

  /**
   * Save the current order and update the status Deferred.
   *
   * @returns {boolean} false to prevent the form submission
   */
  placeOrder() {
    let order = this.attr('order');
    this.attr('saveStatus', order.save());
    return false;
  },

  /**
   * Resets the order form, so a new order can be placed.
   *
   * @returns {boolean} false to prevent the form submission
   */
  startNewOrder: function() {
    this.attr('order', new Order());
    this.attr('saveStatus', null);
    return false;
  }
});

export default Component.extend({
  tag: 'pmo-order',
  viewModel: ViewModel,
  template
});

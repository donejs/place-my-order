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
   * Adds or removed an item from the order.
   *
   * @param {Object} item The menu item to use
   * @param {Boolean} add Whether to add or remove the item
   */
  toggle(item, add) {
    let items = this.attr('order.items');
    let index = items.indexOf(item);
    if(add && index === -1) {
      items.push(item);
    } else {
      items.splice(index, 1);
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
  }
});

export default Component.extend({
  tag: 'pmo-order',
  viewModel: ViewModel,
  template
});

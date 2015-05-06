import Component from 'can/component/component';
import template from './order.stache!';
import BaseViewModel from 'app/viewmodel';
import Restaurant from 'app/models/restaurant';
import Order from 'app/models/order';

export const ViewModel = BaseViewModel.extend({
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
     * @property {app/models/order} order
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
            this.attr('order.restaurant', restaurant.attr('_id'));
            return restaurant;
          });

          this.pageData('restaurant', { _id }, dfd);

          return dfd;
        }

        return old;
      }
    }
  },

  /**
   * Adds or removed an item from the order.
   *
   * @param {Object} item
   */
  toggle(item) {
    let items = this.attr('order.items');
    let index = items.indexOf(item);
    if(index === -1) {
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
  tag: 'app-order',
  viewModel: ViewModel,
  template
});

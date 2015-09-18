import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';

import City from 'place-my-order/models/city';
import State from 'place-my-order/models/state';
import Restaurant from 'place-my-order/models/restaurant';
import template from './list.stache!';

export const ViewModel = Map.extend({
  define: {
    states: {
      get() {
        return State.getList({}).then(states => { return states; }, err => console.error(err.stack));
      }
    },
    state: {
      value: null,
      set() {
        // Remove the city when the state changes
        this.attr('city', null);
      }
    },
    cities: {
      get() {
        var state = this.attr('state');
        return state ? City.getList({ state }) : null;
      }
    },
    city: {
      value: null
    },
    restaurants: {
      get(){
        let state = this.attr('state');
        let city = this.attr('city');

        return state && city ?
          Restaurant.getList({
            'address.state': state,
            'address.city': city
          }) : null;
      }
    }
  }
});

export default Component.extend({
  tag: 'pmo-restaurant-list',
  viewModel: ViewModel,
  template
});

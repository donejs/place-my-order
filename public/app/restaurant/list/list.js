import Component from 'can/component/component';
import Map from 'can/map/';
import 'can/map/define/';

import City from 'app/models/city';
import State from 'app/models/state';
import Restaurant from 'app/models/restaurant';
import template from './list.stache!';

export const ViewModel = Map.extend({
  define: {
    states: {
      get() {
        return State.findAll()
      }
    },
    state: {
      value: null,
      set(value) {
        // Remove the city when the state changes
        this.attr('city', null);
        return value;
      }
    },
    cities: {
      get() {
        let state = this.attr('state');
        if(state) {
          return City.findAll({ state });
        }
        return null;
      }
    },
    city: {
      value: null
    },
    restaurants: {
      Value: Restaurant.List,
      get: function(){
        let params = {};
        let state = this.attr('state');
        let city = this.attr('city');

        if(state && city) {
          params = {
            'address.state': state,
            'address.city': city
          };

          let dfd =  Restaurant.findAll(params);

          return this.attr('@root').pageData("restaurants", params, dfd);
        }

        return null;
      }
    }
  }
});

export default Component.extend({
  tag: 'app-restaurant-list',
  viewModel: ViewModel,
  template
});

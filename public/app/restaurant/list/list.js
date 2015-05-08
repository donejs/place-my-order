import Component from 'can/component/component';
import Map from 'can/map/';
import 'can/map/define/';

import template from './list.stache!';
import Restaurant from 'app/models/restaurant';

export const ViewModel = Map.extend({
  define: {
    cityMap: {
      value: can.ajax('/api/cities')
    },
    state: {
      value: null,
      set(value) {
        // Remove the city when the state changes
        this.attr('city', null);
        return value;
      }
    },
    city: {
      value: null
    },
    cities: {
      get(old, async) {
        let state = this.attr('state');
        if(state) {
          this.attr('cityMap').then(map => async(map[state]));
        } else {
          async([]);
        }
      }
    },
    restaurants: {
      Value: Restaurant.List,
      get: function(){
        let params = {};
        let state = this.attr('state');
        let city = this.attr('city');

        if(state && city) {
          let dfd =  Restaurant.findAll(params);

          params = {
            'address.state': state,
            'address.city': city
          };

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

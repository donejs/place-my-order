import Component from 'can/component/component';
import template from './list.stache!';
import Restaurant from 'app/models/restaurant';
import BaseViewModel from 'app/viewmodel';

export const ViewModel = BaseViewModel.extend({
  define: {
    restaurants: {
      Value: Restaurant.List,
      get: function(list){
        let restaurants = Restaurant.findAll({});

        this.pageData("restaurant", {}, restaurants);

        list.replace(restaurants);

        return list;
      }
    }
  }
});

export default Component.extend({
  tag: 'app-restaurant-list',
  viewModel: ViewModel,
  template
});

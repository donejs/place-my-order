import Component from 'can/component/component';
import template from './list.stache!';
import Restaurant from 'app/models/restaurant';
import 'can/map/define/';

export default Component.extend({
  tag: 'app-restaurant-list',
  template,
  viewModel: {
  	define: {
  		restaurants: {
        Value: Restaurant.List,
        get: function(list){
          let restaurants = Restaurant.findAll({});
          this.attr("@root").pageData("restaurant", {}, restaurants);

          list.replace(restaurants);

          return list;
	  		}
  		}
  	}
  }
});

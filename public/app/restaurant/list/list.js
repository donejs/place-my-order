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
  			value: function(){
	  			return new Restaurant.List({})
	  		}
  		}
  	}
  }
});

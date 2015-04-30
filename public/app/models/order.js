import 'can/map/define/define';
import Model from 'can/model/model';
import List from 'can/list/list';

export default Model.extend({
  id: '_id',
  resource: '/api/orders'
}, {
  define: {
    items: {
      Value: List
    },
    total: {
      get() {
        let total = 0.0;
        this.attr('items').forEach(item => total += parseFloat(item.attr('price')));
        return total.toFixed(2);
      }
    }
  }
});

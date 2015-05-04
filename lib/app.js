import path from 'path';
import feathers from 'feathers';
import bodyParser from 'body-parser';
import mongodb from 'feathers-mongodb';
import config from './config';
import Steal from 'steal';
import styles from './styles';
import url from 'url';

const steal = Steal.clone();
global.System = steal.System;

steal.config(config.system);

const restaurants = mongodb({
  collection: 'restaurants',
  connectionString: config.mongodb
}).extend({
  get(id, params, callback) {
    let _super = this._super.bind(this);
    // Slug can be equivalent to ID when finding a restaurant
    this.find({ query: { slug: id } }, (error, data) => {
      if(data && data.length === 1) {
        return callback(null, data[0]);
      }

      return _super(id, params, callback);
    });
  }
});

const appPromise = steal.import(
  "app/main.stache!can/view/autorender/system",
  "app/layout.stache!")
  .then(function([main, layout]){

  return feathers()
    .configure(feathers.rest())
    .configure(feathers.socketio())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use('api/restaurants', restaurants)
    .use('api/orders', mongodb({
      collection: 'orders',
      connectionString: config.mongodb
    }))
    .use(feathers.static(path.join(__dirname, '..', 'public')))
    .use("/", function(req, res){
      const pathname = url.parse(req.url).pathname;
      main.renderNode(pathname).then(function(frag){
        const layoutFrag = layout({}, {
          styles: styles,
          content: () => frag
        });

        var div = document.createElement("div");
        div.appendChild(layoutFrag);
        res.send(div.innerHTML);
      });
    })
    .use(function(req, res, next) {
      res.status(404);
      res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    });
});

export default appPromise;

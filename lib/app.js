import path from 'path';
import feathers from 'feathers';
import bodyParser from 'body-parser';
import mongodb from 'feathers-mongodb';
import config from './config';
import Steal from 'steal';
import nothing from './nothing';
import layout from './layout';

const steal = Steal.clone();
global.System = steal.System;

steal.System.set("@nothing", nothing(steal));

steal.config({
  config: path.join(__dirname, "..", "/public/package.json!npm"),
  main: "app/main.stache!",
  map: {
    "$less": "@nothing"
  }
});

function importBundles(val){
  return Promise.all(steal.System.bundle.map(function(name){
    console.log('importing', name);
    return steal.System.import(name);
  })).then(function(){
    return val;
  });
}

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

export const app = feathers()
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
    steal.import(steal.System.main).then(importBundles).then(function(renderer){
      var frag = renderer({page: "home"});
      var div = document.createElement("div");
      div.appendChild(frag);
      res.send(layout(div.innerHTML));
    });
  })
  .use(function(req, res, next) {
    res.status(404);
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });

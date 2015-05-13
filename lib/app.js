import path from 'path';
import feathers from 'feathers';
import Steal from 'steal';
import url from 'url';

import config from './config';
import api from './api';
import styles from './iso/styles';
import inlineCache from './iso/inline_cache';
import content from './iso/content';

const steal = Steal.clone();
global.System = steal.System;

steal.config(config.system);

const appPromise = steal.import("app/layout.stache!html", "can/route/")
  .then(function([layout, route]){

  can.dev.logLevel = 3;

  return feathers()
    .configure(api)
    .use(feathers.static(path.join(__dirname, '..', 'public')))
    .use("/", function(req, res){
      const pathname = url.parse(req.url).pathname;

      layout.renderToString(pathname).then(function(html){
        console.log("Hey I got html");
        res.send(html);
      });

      /*const pathname = url.parse(req.url).pathname;

      // Hack for 404ing when none of our routes match
      if(pathname !== '/' && !route.deparam(pathname).route) {
        res.status(404);
        res.end('Not found');
        return;
      }

      main.renderNode(pathname).then(function({ html, data }){
        const layoutFrag = layout({
          isProd: process.env.NODE_ENV === 'production'
        }, {
          styles: styles,
          content: () => content(html),
          inlineCache: () => inlineCache(data)
        });

        var div = document.createElement("div");
        div.appendChild(layoutFrag);
        res.send(div.innerHTML);
      });*/
    });
});

export default appPromise;

import path from 'path';
import feathers from 'feathers';
import config from './config';
import Steal from 'steal';
import styles from './styles';
import inlineCache from './inline_cache';
import url from 'url';
import api from './api';
import ajax from './ajax';

const steal = Steal.clone();
global.System = steal.System;

steal.config(config.system);

const appPromise = steal.import("app/main.stache!can/view/autorender/system", "app/layout.stache!")
  .then(function([main, layout]){

  return feathers()
    .use('/api', api)
    .use(ajax())
    .use(feathers.static(path.join(__dirname, '..', 'public')))
    .use("/", function(req, res){
      const pathname = url.parse(req.url).pathname;
      main.renderNode(pathname).then(function({ fragment, data }){
        const layoutFrag = layout({}, {
          styles: styles,
          content: () => fragment,
          inlineCache: () => inlineCache(data)
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

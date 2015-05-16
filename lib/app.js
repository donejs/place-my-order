import path from 'path';
import feathers from 'feathers';
import url from 'url';
import compression from 'compression';

import config from './config';
import api from './api';
import ssr from "done-server-side-render";

const render = ssr(config.system);

export default feathers()
  .use(compression())
  .configure(api)
  .use(feathers.static(path.join(__dirname, '..', 'public')))
  .use("/", function(req, res){
    const pathname = url.parse(req.url).pathname;

    render(pathname).then(html => res.send(html))
  });


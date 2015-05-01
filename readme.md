# placemyorder.com

A restaurant menu ordering application. Built in ES6 with CanJS + StealJS.

## Installation

Install and start [MongoDB](https://www.mongodb.org/) with the default settings. [MongoHub](http://mongohub.todayclose.com/) is a helpful client to view and query databases.

Clone [the repository](https://github.com/bitovi/place-my-order) and in the folder run

> npm install

The initial restaurant list (with the data located in `public/fixtures/restaurants.json`) can be loaded by running

> bin/import

To start the application run:

> npm start

For development to start the server and have it reload automatically when its files change:

> npm run supervisor

For Steals live reload:

> cd public/ && npm run live-reload

import { ViewModel as RestaurantListVM } from "./list";
import QUnit from 'steal-qunit';
import fixture from 'pmo/models/fixtures/';

QUnit.module("place-my-order/restaurant/list", {
  setup: function () {
    localStorage.clear();
  },
  teardown: function () {
    localStorage.clear();
  }
});

QUnit.asyncTest("ViewModel", function () {

  // Fake data
  var states = [{name: "Calisota", short: "CA"},
    {name: "New Troy", short: "NT"}];
  var caCities = [{state: "CA", name: "Casadina"}];
  var ntCities = [{state: "NT", name: "Alberny"}];

  // use fixtures
  fixture({
    "/api/states": ()=> ({data: states}),
    "/api/cities": function (request) {
      return request.data.state === "CA" ? caCities : ntCities;
    }
  });

  var rlVM = new RestaurantListVM();

  rlVM.attr("states").then(function (vmStates) {
    QUnit.deepEqual(vmStates.attr(), states, "Got states");
    rlVM.attr("state", "CA");
  });

  rlVM.one("cities", function (ev, citiesPromise) {
    citiesPromise.then(function (vmCities) {
      deepEqual(vmCities.attr(), caCities, "Got ca cities");
      rlVM.attr("city", "Casadina");
    });
  });

  rlVM.one("restaurants", function (ev, restaurantsPromise) {
    restaurantsPromise.then(function (vmRestaurants) {
      // deepEqual(vmRestaurants.attr(), casadinaRestaurants);

      rlVM.attr("state", "NT");
      ok(!rlVM.attr("city"), "city selection removed");
      ok(!rlVM.attr("restaurants"), "no restaurants");
      rlVM.attr("cities").then(function (vmCities) {
        deepEqual(vmCities.attr(), ntCities);
        start();
      });
    });
  });

});



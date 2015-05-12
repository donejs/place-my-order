import 'steal-qunit';
import { BitSeriesVM } from './bit_graph';
import { BitGraphVM } from './bit_graph';

QUnit.module('Bit-Series ViewModel');

test('String data converted to floats', () => {
  var vm = new BitSeriesVM({
    data: ["23.00", 123.45, "84.98"]
  });

  deepEqual(vm.attr('data').attr(), [23.00, 123.45, 84.98]);
});

test('NaN data dropped from series', () => {
  var vm = new BitSeriesVM({
    data: ["23.00", NaN, "bit-graph", "84.98"]
  });

  deepEqual(vm.attr('data').attr(), [23.00, 84.98]);
});

test('Adding new values changes appropriate meta values', 13, () => {
  var vm = new BitSeriesVM({
    data: [1, 2, 3, 4, 5]
  });

  vm.bind('seriesLength', function() {
    ok('seriesLength changed');
  });
  vm.bind('lowestValue', function() {
    ok('lowestValue changed');
  });
  vm.bind('highestValue', function() {
    ok('highestValue changed');
  });

  equal(vm.attr('seriesLength'), 5, 'series length is 5');
  equal(vm.attr('lowestValue'), 1, 'lowest value is 1');
  equal(vm.attr('highestValue'), 5, 'highest value is 5');

  can.batch.start();
  vm.attr('data').push(0);
  can.batch.stop();

  equal(vm.attr('seriesLength'), 6, 'series length changed to 6');
  equal(vm.attr('lowestValue'), 0, 'lowest value changed to 0');
  equal(vm.attr('highestValue'), 5, 'highest value remains 5');

  can.batch.start();
  vm.attr('data').push(6);
  can.batch.stop();

  equal(vm.attr('seriesLength'), 7, 'series length changed to 7');
  equal(vm.attr('lowestValue'), 0, 'lowest value remains 0');
  equal(vm.attr('highestValue'), 6, 'highest value changed to 6');
});

test('Normalized data produces correct line', 5, () => {

  var graphFixture = can.Map.extend({
    width: 100,
    height: 100,
    normalize: true
  });

  var vm = new BitSeriesVM({
      data: [0, 1, 2, 3, 4],
      graph: new graphFixture()
  });

  vm.bind('line', function(ev, n, o) {
    ok('line changed');
  });

  equal(vm.attr('line'), 'M0,100L25,75L50,50L75,25L100,0');

  can.batch.start();
  vm.attr('data').push(5);
  can.batch.stop();

  equal(vm.attr('line'), 'M0,100L20,80L40,60L60,40L80,20L100,0');

  can.batch.start();
  vm.attr('data').pop();
  can.batch.stop();

  equal(vm.attr('line'), 'M0,100L25,75L50,50L75,25L100,0');
});

test('Normalized data and changing scales produces correct line', 3, () => {

  var graphFixture = can.Map.extend({
    width: 100,
    height: 100,
    normalize: true,
    xScale: null,
    yScale: null
  });

  var vm = new BitSeriesVM({
    data: [0, 1, 2, 3, 4],
    graph: new graphFixture({})
  });

  vm.bind('line', function(ev, n, o) {
    ok('line changed');
  });

  equal(vm.attr('line'), 'M0,100L25,75L50,50L75,25L100,0');

  can.batch.start();
  vm.graph.attr('xScale', d3.scale.linear().domain([0, 8]).range([0, 100]));
  can.batch.stop();

  equal(vm.attr('line'), 'M0,100L25,75L50,50L75,25L100,0');

  can.batch.start();
  vm.graph.attr('yScale', d3.scale.linear().domain([0, 8]).range([100, 0]));
  can.batch.stop();

  equal(vm.attr('line'), 'M0,100L25,75L50,50L75,25L100,0');
});

test('Un-normalized data and changing scales produces correct line', 5, () => {

  var graphFixture = can.Map.extend({
    width: 100,
    height: 100,
    normalize: false,
    xScale: null,
    yScale: null
  });

  var vm = new BitSeriesVM({
    data: [0, 1, 2, 3, 4],
    graph: new graphFixture({
      xScale: d3.scale.linear().domain([0, 4]).range([0, 100]),
      yScale: d3.scale.linear().domain([0, 4]).range([100, 0])
    })
  });

  vm.bind('line', function(ev, n, o) {
    ok('line changed');
  });

  // 5 x values out of 5 positions, should go from 0-100 @ positions 0, 25, 50, 75, 100
  // 5 y from 0-4, min 0, max 4, should go from 100-0 @ positions 100, 75, 50, 25, 0
  equal(vm.attr('line'), 'M0,100L25,75L50,50L75,25L100,0');

  can.batch.start();
  vm.graph.attr('xScale', d3.scale.linear().domain([0, 8]).range([0, 100]));
  can.batch.stop();

  // 5 x values out of 9 positions, should go from 0-100 @ positions 0, 12.5, 25, 37.5, 50
  // y from 0-4, min 0, max 4, should go from 100-0 @ positions 100, 75, 50, 25, 0
  equal(vm.attr('line'), 'M0,100L12.5,75L25,50L37.5,25L50,0', 'line changes when xScale changes');

  can.batch.start();
  vm.graph.attr('yScale', d3.scale.linear().domain([0, 8]).range([100, 0]));
  can.batch.stop();

  // 5 x values out of 9 positions, should go from 0-100 @ positions 0, 12.5, 25, 37.5, 50
  // y from 0-4, min 0, max 8, should go from 100-0 @ positions 100, 87.5, 75, 62.5, 50
  equal(vm.attr('line'), 'M0,100L12.5,87.5L25,75L37.5,62.5L50,50', 'line changes when yScale changes');  
});

QUnit.module('Bit-Graph ViewModel');

test('changing margins updates width and height', () => {
  var vm = new BitGraphVM({
    normalize: false,
    margins: [20, 0, 20, 80],
    width: 1000,  // computed width is this value - left and right margins
    height: 400   // computed height is this value - top and bottom margins
  });

  equal(vm.attr('width'), 920);  // 1000 - 80 - 0
  equal(vm.attr('height'), 360); // 400 - 20 - 20

  // this should also trigger a change to x and y scales
  can.batch.start();
  vm.attr('margins', [100, 100, 100, 100]);
  can.batch.stop();

  equal(vm.attr('width'), 800);  // 1000 - 100 - 100
  equal(vm.attr('height'), 200); // 400 - 100 - 100
});

test('changing width updates x scale', 1, () => {
  var vm = new BitGraphVM({
    normalize: false,
    width: 1000,
  });

  vm.bind('xScale', function(ev, n, o) {
    ok('xScale changed');
  });

  // this should also trigger a change to the x scale
  can.batch.start();
  vm.attr('width', 800);
  can.batch.stop();
});

test('changing height updates y scale', 1, () => {
  var vm = new BitGraphVM({
    normalize: false,
    height: 400
  });

  vm.bind('yScale', function(ev, n, o) {
    ok('yScale changed');
  });

  // this should trigger a change to the y scale
  can.batch.start();
  vm.attr('height', 300);
  can.batch.stop();
});

test('Adding new values changes appropriate meta values', 27, () => {
  var vm = new BitGraphVM({});

  var bs1 = new BitSeriesVM({
    data: [1, 2, 3, 4],
    graph: vm
  });

  var bs2 = new BitSeriesVM({
    data: [100, 200, 300, 400],
    graph: vm
  });

  vm.bind('longestSeriesLength', function() {
    ok('longestSeriesLength changed');
  });
  vm.bind('lowestSeriesValue', function() {
    ok('lowestSeriesValue changed');
  });
  vm.bind('highestSeriesValue', function() {
    ok('highestSeriesValue changed');
  });
  vm.bind('xScale', function() {
    ok('xScale changed');
  });
  vm.bind('yScale', function() {
    ok('yScale changed');
  });

  // should change longest series length, lowest and highest values, x and y scales
  vm.addSeries(bs1);

  // should change highest values, y scale
  vm.addSeries(bs2);

  equal(vm.attr('longestSeriesLength'), 4, 'longest series length is 4');
  equal(vm.attr('lowestSeriesValue'), 1, 'lowest series value is 1');
  equal(vm.attr('highestSeriesValue'), 400, 'highest series value is 400');

  // should change longest series length, lowest value, x and y scales
  can.batch.start();
  bs1.attr('data').push(0);
  can.batch.stop();

  equal(vm.attr('longestSeriesLength'), 5, 'longest series length changes to 5');
  equal(vm.attr('lowestSeriesValue'), 0, 'lowest series value changes to 0');
  equal(vm.attr('highestSeriesValue'), 400, 'highest series value is 400');  

  // should change nothing
  can.batch.start();
  bs2.attr('data').push(0);
  can.batch.stop();

  equal(vm.attr('longestSeriesLength'), 5, 'longest series length is 5');
  equal(vm.attr('lowestSeriesValue'), 0, 'lowest series value is 0');
  equal(vm.attr('highestSeriesValue'), 400, 'highest series value is 400');

  // should change longest series length, highest value, x and y scales
  can.batch.start();
  bs2.attr('data').push(500);
  can.batch.stop();

  equal(vm.attr('longestSeriesLength'), 6, 'longest series length changes to 6');
  equal(vm.attr('lowestSeriesValue'), 0, 'lowest series value is 0');
  equal(vm.attr('highestSeriesValue'), 500, 'highest series value changes to 500');
});
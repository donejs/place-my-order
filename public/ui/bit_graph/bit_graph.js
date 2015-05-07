import can from "can";
import 'can/map/define/';
import template from "./bit_graph.stache!";
import './bit_graph.less!';
import d3 from "d3";

export var BitSeriesVM = can.Map.extend({
    define: {
        seriesLength: {
            get: function() {
                return this.attr('data').attr('length');
            }
        },
        serializedData: {
            get: function() {
                return this.attr('data').serialize();
            },
        },
        lowestValue: {
            get: function() {
                return d3.min(this.attr('serializedData'));
            }
        },
        highestValue: {
            get: function() {
                return d3.max(this.attr('serializedData'));
            }
        },
        line: {
            get: function() {
                // X scale will fit all values from data[] within pixels 0-w
                var x = d3.scale.linear().domain([0, this.attr('seriesLength')]).range([0, this.attr('graphWidth')]);
                // Y scale will fit all values from data[] within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
                var y = d3.scale.linear().domain([this.attr('lowestValue'), this.attr('highestValue')]).range([this.attr('graphHeight'), 0]);

                // create a line function that can convert this.attr('data')[] into x and y points
                var line = d3.svg.line()
                    // assign the X function to plot our line as we wish
                    .x(function(d,i) { 
                        // verbose logging to show what's actually being done
                        // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
                        // return the X coordinate where we want to plot this datapoint
                        return x(i); 
                    })
                    .y(function(d) { 
                        // verbose logging to show what's actually being done
                        // console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
                        // return the Y coordinate where we want to plot this datapoint
                        return y(d); 
                    });

                // TODO return the attribute instead?
                return line(this.attr('data'));
            }
        }
    },
    data: null,
    graphHeight: null,
    graphWidth: null
});

// console.log('initial');
// var vm = new BitSeriesVM({
//     data: [1,2,3]
// });

// vm.bind('data', function(e, n, o) {
//     console.log('data changed from ', o, ' to ', n);
// });
// vm.bind('serializedData', function(ev, n, o) {
//     console.log('serializedData changed from ', o, ' to ', n);
// });
// vm.bind('seriesLength', function(ev, n, o) {
//     console.log('seriesLength changed from ', o, ' to ', n);
// });
// vm.bind('lowestValue', function(ev, n, o) {
//     console.log('lowestValue changed from ', o, ' to ', n);
// });
// vm.bind('highestValue', function(ev, n, o) {
//     console.log('highestValue changed from ', o, ' to ', n);
// });
// vm.bind('line', function(ev, n, o) {
//     console.log('line changed from ', o, ' to ', n);
// });

// can.batch.start();
// console.log('pushing 0');
// vm.attr('data').push(0);
// can.batch.stop();

// can.batch.start();
// console.log('pushing 5');
// vm.attr('data').push(5);
// can.batch.stop();

can.Component.extend({
    tag: "bit-series",
    viewModel: BitSeriesVM,
    events: {
        inserted: function() {
            this.scope.attr({
                graphWidth: this.element.parent().scope().attr('width'),
                graphHeight: this.element.parent().scope().attr('height')
            });
            this.element.parent().scope().addSeries(this.scope);
        },
        removed: function() {
            this.element.parent().scope().removeSeries(this.scope);
        }
    }
});

export var BitGraphVM = can.Map.extend({
    define: {
        margins: {
            value: [80, 80, 80, 80],
            type: "*"
        },
        width: {
            value: 600,
            get: function(val) {
                var margins = this.attr('margins');
                return val - margins[1] - margins[3];
            }
        },
        height: {
            value: 400,
            get: function(val) {
                var margins = this.attr('margins');
                return val - margins[0] - margins[2];
            }
        },
        transform: {
            get: function() {
                var margins = this.attr('margins');
                return "translate(" + margins[3] + "," + margins[0] + ")"
            }
        },
        graphContainerElement: {
            type: "*",
        },
        seriesSerialized: {
            get: function() {
                return this.attr('series').serialize();
            }
        },
        refreshGraph: {
            get: function() {
                // TODO this method should just capture changes to any element on the graph
                // TODO append all elements to a document fragment instead and update in the change event

                // bind to the serialized chagnes 
                this.attr('seriesSerialized');

                var graphContainerElement = this.attr('graphContainerElement');
                
                this.clearGraph(() => {
                    // TODO fix these axis!
                    // TODO group axis in their own container so they don't have to be cleared
                    // // X scale will fit all values from data[] within pixels 0-w
                    // var x = d3.scale.linear().domain([0, this.attr('longestSeriesLength')]).range([0, this.attr('width')]);
                    // // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
                    // var y = d3.scale.linear().domain([0, this.attr('highestSeriesValue')]).range([this.attr('height'), 0]);

                    // // create yAxis
                    // var xAxis = d3.svg.axis().scale(x).tickSize(-this.attr('height')).tickSubdivide(true);
                    // // Add the x-axis.
                    // graph.append("svg:g")
                    //       .attr("class", "x axis")
                    //       .attr("transform", "translate(0," + this.attr('height') + ")")
                    //       .call(xAxis);

                    // // create left yAxis
                    // var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
                    // // Add the y-axis to the left
                    // graph.append("svg:g")
                    //       .attr("class", "y axis")
                    //       .attr("transform", "translate(-25,0)")
                    //       .call(yAxisLeft);

                    // Add the line by appending an svg:path element with the data line we created above
                    // do this AFTER the axes above so that the line is above the tick-lines
                    can.each(this.attr('series'), function(series) {
                        graphContainerElement.append("svg:path").attr("d", series.attr('line'));    
                    });
                });
            }
        }
    },
    series: [],
    title: "",
    clearGraph: function(cb) {
        // no clean way to remove all elements and receive a callback, so we have to make our own
        // http://stackoverflow.com/questions/23118779/d3-callback-function-after-remove
        var counter = 0,
            graphContainerElement = this.attr('graphContainerElement');
        if(graphContainerElement) {
            graphContainerElement.selectAll('*').call(function(selection) {
                counter = selection.size();
                // if counter is zero, the each won't ever execute, so fire the callback here also
                if(counter === 0) {
                    cb();
                }
            }).transition().duration(0).each("end", function() {
                counter--;
                if(counter === 0) {
                    cb();
                }
            }).remove();
        }
    },
    renderBaseGraph: function(graphBaseElement) {
        var margins = this.attr('margins'),
            graphContainerElement = graphBaseElement.append("svg:svg")
              .attr("width", this.attr('width') + margins[1] + margins[3])
              .attr("height", this.attr('height') + margins[0] + margins[2])
            .append("svg:g")
              .attr("transform", this.attr('transform'));
        this.attr('graphContainerElement', graphContainerElement);
    },
    addSeries: function(series) {
        can.batch.start();
        this.attr('series').push(series);
        can.batch.stop();
    },
    removeSeries: function(series) {
        var seriesList = this.attr('series');
        can.batch.start();
        seriesList.splice(seriesList.indexOf(series), 1);
        can.batch.stop();
    }
});

// var bs1 = new BitSeriesVM({
//     data: [1,2,3]
// });
// var bs2 = new BitSeriesVM({
//     data: [100,200,300]
// });

// console.log('initial');
// var vm = new BitGraphVM({});

// vm.bind('series', function(ev, n, o) {
//     console.log('series changed from ', o, ' to ', n);
// });
// vm.bind('graphLines', function(ev, n, o) {
//     console.log('graphLines changed from ', o, ' to ', n);
// });
// vm.bind('allTheGraphThings', function(ev, n, o) {
//     console.log('allTheGraphThings changed from ', o, ' to ', n);
// });

// vm.addSeries(bs1);
// vm.addSeries(bs2);

// can.batch.start();
// console.log('pushing 0');
// bs1.attr('data').push(0);
// can.batch.stop();

// can.batch.start();
// console.log('pushing 5');
// bs1.attr('data').push(5);
// can.batch.stop();

can.Component.extend({
    tag: "bit-graph",
    template: template,
    viewModel: BitGraphVM,
    events: {
        inserted: function(scope, el) {
            // TODO select this based on a child of el
            var graphBaseElement = d3.select(document.getElementById('graph'))
            this.scope.renderBaseGraph(graphBaseElement);
        },
        "{refreshGraph} change": function(a, b, c) {
            // check into grouped elements
            console.log('TODO rebuild the graph here w ', c);
        }
    }
});
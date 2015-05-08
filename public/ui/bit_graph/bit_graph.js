import can from "can";
import 'can/map/define/';
import template from "./bit_graph.stache!";
import './bit_graph.less!';
import d3 from "d3";

export var BitSeriesVM = can.Map.extend({
    define: {
        serializedData: {
            get: function() {
                return this.attr('data') && this.attr('data').serialize() || null;
            },
        },
        seriesLength: {
            get: function() {
                return this.attr('data') && this.attr('data').attr('length') || 0;
            }
        },
        lowestValue: {
            get: function() {
                var lowestValue = this.attr('serializedData') && d3.min(this.attr('serializedData'));
                return (lowestValue || lowestValue === 0) ? lowestValue : null;
            }
        },
        highestValue: {
            get: function() {
                var highestNumber = this.attr('serializedData') && d3.max(this.attr('serializedData'));
                return (highestNumber || highestNumber === 0) ? highestNumber : null;
            }
        },
        line: {
            get: function() {
                if(this.attr('seriesLength') && this.attr('lowestValue') !== null && this.attr('highestValue') !== null) {
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
                } else {
                    return null;
                }
            }
        },
        data: {
            get: function(value) {
                return this.convertListItemsToNumbers(value);
            }
        }
    },
    color: "steelblue",
    data: null,
    graphHeight: null,
    graphWidth: null,
    convertListItemsToNumbers: function(listItems) {
        if(listItems) {
                listItems.each(function(data, index) {
                listItems[index] = Number.parseFloat(data);
            });
        }
        return listItems;
    }
});

// console.log('initial');
// var vm = new BitSeriesVM({
//     data: ["23.00", "84.98", "48.99", "138.46"]
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
// console.log('pushing 150');
// vm.attr('data').push(150);
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
            value: [0, 0, 0, 80],
            type: "*"
        },
        width: {
            value: 1000,
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
            type: "*"
        },
        lineContainerElement: {
            type: "*"
        },
        axisContainerElement: {
            type: "*"
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

                // bind to the serialized changes
                this.attr('seriesSerialized');

                this.clearGraphLines(() => {
                    // Add the line by appending an svg:path element with the data line
                    var lineContainerElement = this.attr('lineContainerElement');
                    can.each(this.attr('series'), function(series) {
                        if(series.attr('line')) {
                            lineContainerElement.append("svg:path").attr("d", series.attr('line')).style("stroke", series.attr("color"));
                        }
                    });
                });
            }
        }
    },
    series: [],
    clearGraphLines: function(cb) {
        // no clean way to remove all elements and receive a callback, so we have to make our own
        // http://stackoverflow.com/questions/23118779/d3-callback-function-after-remove
        var counter = 0,
            lineContainerElement = this.attr('lineContainerElement');
        if(lineContainerElement) {
            lineContainerElement.selectAll('*').call(function(selection) {
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
    refreshAxes: function() {
        var axisContainerElement = this.attr('axisContainerElement');
        if(axisContainerElement) {
            // X scale will fit all values from data[] within pixels 0-w
            var x = d3.scale.linear().domain([0, 5]).range([0, this.attr('width')]);
            // Y scale will fit all values from data[] within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
            var y = d3.scale.linear().domain([0, 5]).range([this.attr('height'), 0]);

            // create xAxis
            var xAxis = d3.svg.axis().scale(x).tickSize(-this.attr('height')).tickSubdivide(true).tickFormat("");
            // Add the x-axis.
            axisContainerElement.append("svg:g")
                  .attr("class", "x axis")
                  .attr("width", this.attr('width'))
                  .attr("transform", "translate(0," + this.attr('height') + ")")
                  .call(xAxis);

            // create left yAxis
            var yAxisLeft = d3.svg.axis().scale(y).ticks(4).tickFormat("").orient("left");
            // Add the y-axis to the left
            axisContainerElement.append("svg:g")
                  .attr("class", "y axis")
                  .attr("height", this.attr('height'))
                  .attr("transform", "translate(-25,0)")
                  .call(yAxisLeft);
        }
    },
    renderBaseGraph: function(graphBaseElement) {
        var margins = this.attr('margins');
        
        // create the container elements
        var graphContainerElement = graphBaseElement.append("svg:svg")
              .attr("width", this.attr('width') + margins[1] + margins[3])
              .attr("height", this.attr('height') + margins[0] + margins[2])
            .append("svg:g")
              .attr("transform", this.attr('transform'));
        this.attr('graphContainerElement', graphContainerElement);
        this.attr('axisContainerElement', graphContainerElement.append("svg:g").attr("class", "axis"));
        this.attr('lineContainerElement', graphContainerElement.append("svg:g").attr("class", "lines"));

        // TODO remove this eventually and make axes dependent on line data?
        this.refreshAxes();
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
//     data: [100,200,300,400]
// });

// console.log('initial');
// var vm = new BitGraphVM({});

// vm.addSeries(bs1);
// vm.addSeries(bs2);

// can.batch.start();
// console.log('pushing 0');
// bs1.attr('data').push(0);
// can.batch.stop();

// can.batch.start();
// console.log('pushing 500');
// bs2.attr('data').push(500);
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
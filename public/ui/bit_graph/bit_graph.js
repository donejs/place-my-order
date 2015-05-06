import can from "can";
import 'can/map/define/';
import template from "./bit_graph.stache!";
import d3 from "d3";

export var BitSeriesVM = can.Map.extend({
    data: null
});

can.Component.extend({
    tag: "bit-series",
    viewModel: BitSeriesVM,
    events: {
        inserted: function() {
            this.element.parent().scope().addSeries(this.scope);
        },
        removed: function(){
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
        graph: {
            type: "*",
        },
        longestSeriesLength: {
            get: function() {
                var longestLength = 0;
                this.attr('series').each(function(series) {
                    var thisSeriesLength = series.attr('length');
                    if(thisSeriesLength > longestLength) {
                        longestLength = thisSeriesLength;
                    }
                });
                return longestLength;
            }
        },
        highestSeriesValue: {
            get: function() {
                var highestValue = 0;
                this.attr('series').each(function(series) {
                    var thisSeriesHighestValue = d3.max(series);
                    if(thisSeriesHighestValue > highestValue) {
                        highestValue = thisSeriesHighestValue;
                    }
                });
                return highestValue;
            }
        }
    },
    series: [],
    title: "",
    clearGraph: function(cb) {
        // no clean way to remove all elements and receive a callback, so we have to make our own
        // http://stackoverflow.com/questions/23118779/d3-callback-function-after-remove
        var counter = 0;
        this.attr('graph').selectAll('*').call(function(selection) {
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
    },
    renderGraph: function() {
        // clear graph first, then re-render it
        this.clearGraph(() => {
            // instance of our graph
            var graph = this.attr('graph');
            
            // X scale will fit all values from data[] within pixels 0-w
            var x = d3.scale.linear().domain([0, this.attr('longestSeriesLength')]).range([0, this.attr('width')]);
            // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
            var y = d3.scale.linear().domain([0, this.attr('highestSeriesValue')]).range([this.attr('height'), 0]);

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

            // create yAxis
            var xAxis = d3.svg.axis().scale(x).tickSize(-this.attr('height')).tickSubdivide(true);
            // Add the x-axis.
            graph.append("svg:g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + this.attr('height') + ")")
                  .call(xAxis);

            // create left yAxis
            var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
            // Add the y-axis to the left
            graph.append("svg:g")
                  .attr("class", "y axis")
                  .attr("transform", "translate(-25,0)")
                  .call(yAxisLeft);
            
            // Add the line by appending an svg:path element with the data line we created above
            // do this AFTER the axes above so that the line is above the tick-lines
            can.each(this.attr('series'), function(series) {
                graph.append("svg:path").attr("d", line(series));    
            });
        });
    },
    addSeries: function(series) {
        this.attr('series').push(series.data);
        this.renderGraph();
    },
    removeSeries: function(series) {
        var seriesList = this.attr('series');
        seriesList.splice(panels.indexOf(series),1);
        this.renderGraph();
    }
});

can.Component.extend({
    tag: "bit-graph",
    template: template,
    viewModel: BitGraphVM,
    events: {
        inserted: function(scope, el) {
            var graphElement = d3.select(document.getElementById('graph')),
                margins = this.scope.attr('margins');
            var graph = graphElement.append("svg:svg")
                  .attr("width", this.scope.attr('width') + margins[1] + margins[3])
                  .attr("height", this.scope.attr('height') + margins[0] + margins[2])
                .append("svg:g")
                  .attr("transform", this.scope.attr('transform'));
            this.scope.attr('graph', graph);
        }
    }
});
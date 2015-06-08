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
                var highestValue = this.attr('serializedData') && d3.max(this.attr('serializedData'));
                return (highestValue || highestValue === 0) ? highestValue : null;
            }
        },
        line: {
            get: function() {
                if(this.attr('graph') && this.attr('seriesLength') && this.attr('lowestValue') !== null && this.attr('highestValue') !== null) {
                    if(this.attr('graph').attr('normalize')) {
                        // X scale will fit all values from data[] within pixels 0-w
                        var x = d3.scale.linear().domain([0, this.attr('seriesLength')-1]).range([0, this.attr('graph').attr('width')]);
                        // Y scale will fit all values from data[] within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
                        var y = d3.scale.linear().domain([this.attr('lowestValue'), this.attr('highestValue')]).range([this.attr('graph').attr('height'), 0]);
                    } else {
                        var x = this.attr('graph').attr('xScale');
                        var y = this.attr('graph').attr('yScale');
                    }

                    // create a line function that can convert this.attr('data')[] into x and y points
                    var line = d3.svg.line()
                        // assign the X function to plot our line as we wish
                        .x(function(d,i) {
                            // verbose logging to show what's actually being done
                            // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
                            // return the X coordinate where we want to plot this datapoint
                            return x(i).toPrecision(8);
                        })
                        .y(function(d) {
                            // verbose logging to show what's actually being done
                            // console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
                            // return the Y coordinate where we want to plot this datapoint
                            return y(d).toPrecision(8);
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
    graph: null,
    convertListItemsToNumbers: function(listItems) {
        if(listItems) {
                listItems.each(function(data, index) {
                var floatValue = Number.parseFloat(data);
                if(!Number.isNaN(floatValue)) {
                    listItems[index] = floatValue;
                } else {
                    listItems.splice(index, 1);
                }
            });
        }
        return listItems;
    }
});

can.Component.extend({
    tag: "bit-series",
    viewModel: BitSeriesVM,
    events: {
        inserted: function() {
            var parentScope = this.element.parent().scope();
            this.scope.attr('graph', parentScope);
            parentScope.addSeries(this.scope);
        },
        removed: function() {
            this.element.parent().scope().removeSeries(this.scope);
        }
    }
});

export var BitGraphVM = can.Map.extend({
    define: {
        margins: {
            value: [20, 0, 20, 80],
            type: "*"
        },
        width: {
            value: 768,
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
        normalize: {
            value: false,
            type: "htmlbool"
        },
        seriesSerialized: {
            get: function() {
                return this.attr('series').serialize();
            }
        },
        longestSeriesLength: {
            value: 0,
            get: function() {
                if(this.attr('seriesSerialized') && this.attr('series').attr('length')) {
                    var longestSeriesLength = 0;
                    this.attr('series').each(function(s) {
                        longestSeriesLength = Math.max(longestSeriesLength, s.attr('seriesLength'));
                    });
                    return longestSeriesLength;
                }
                return 0;
            }
        },
        lowestSeriesValue: {
            value: 0,
            get: function() {
                if(this.attr('seriesSerialized') && this.attr('series').attr('length')) {
                    var lowestSeriesValue = Infinity;
                    this.attr('series').each(function(s) {
                        lowestSeriesValue = Math.min(lowestSeriesValue, s.attr('lowestValue'));
                    });
                    return lowestSeriesValue;
                }
                return 0;
            }
        },
        highestSeriesValue: {
            value: 0,
            get: function() {
                if(this.attr('seriesSerialized') && this.attr('series').attr('length')) {
                    var highestSeriesValue = -Infinity;
                    this.attr('series').each(function(s) {
                        highestSeriesValue = Math.max(highestSeriesValue, s.attr('highestValue'));
                    });
                    return highestSeriesValue;
                }
                return 0;
            }
        },
        xScale: {
            value: null,
            get: function() {
                var domainEndValue = (this.attr('normalize')) ? 5 : this.attr('longestSeriesLength');

                // X scale will fit all values from data[] within pixels 0-w
                return d3.scale.linear().domain([0, domainEndValue-1]).range([0, this.attr('width')]);
            }  
        },
        yScale: {
            value: null,
            get: function() {
                var normalize = this.attr('normalize'),
                    domainBeginValue = normalize ? 0 : this.attr('lowestSeriesValue'),
                    domainEndValue = normalize ? 5 : this.attr('highestSeriesValue');

                // Y scale will fit all values from data[] within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
                return d3.scale.linear().domain([domainBeginValue, domainEndValue]).range([this.attr('height'), 0]);
            }
        }
    },
    series: [],
    clearContainer: function(container, cb) {
        // no clean way to remove all elements and receive a callback, so we have to make our own
        // http://stackoverflow.com/questions/23118779/d3-callback-function-after-remove
        var counter = 0;
        if(container) {
            container.selectAll('*').call(function(selection) {
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
    clearGraphLines: function(cb) {
        this.clearContainer(this.attr('lineContainerElement'), cb);
    },
    refreshGraph: function() {
        // TODO this method should just capture changes to any element on the graph and move into a define
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
    },
    clearAxes: function(cb) {
        this.clearContainer(this.attr('axisContainerElement'), cb);
    },
    refreshAxes: function() {
        this.clearAxes(() => {
            var axisContainerElement = this.attr('axisContainerElement');

            // create xAxis
            var xAxis = d3.svg.axis().scale(this.attr('xScale')).tickSize(-this.attr('height')).tickSubdivide(true).tickFormat("");

            // create left yAxis
            var yAxisLeft = d3.svg.axis().scale(this.attr('yScale')).ticks(4).orient("left");

            // if we are normalizing, remove the values
            if(this.attr('normalize')) {
                xAxis.tickFormat("");
            }

            // Add the x-axis.
            axisContainerElement.append("svg:g")
                  .attr("class", "x axis")
                  .attr("width", this.attr('width'))
                  .attr("transform", "translate(0," + this.attr('height') + ")")
                  .call(xAxis);

            // Add the y-axis to the left
            axisContainerElement.append("svg:g")
                  .attr("class", "y axis")
                  .attr("height", this.attr('height'))
                  .attr("transform", "translate(-25,0)")
                  .call(yAxisLeft);
        });
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
        this.refreshGraph();
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
        // "{scope} xScale": function() {
        //     this.scope.refreshAxes();
        // },
        // "{scope} yScale": function() {
        //     this.scope.refreshAxes();
        // },
        "{scope} seriesSerialized": function() {
            // TODO figure out how these can just listen and auto refresh
            this.scope.refreshAxes();
            this.scope.refreshGraph();
        }
    }
});
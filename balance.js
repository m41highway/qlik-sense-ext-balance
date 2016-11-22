/**
MIT License
-----------

Copyright (c) 2016 Palo IT (http://hk.palo-it.com)
Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
		

 */
function balance(parent, width, height, arraySide, arrayLabel, inputNumber) {


var _data = null,
    _duration = 1000,
    _selection,
    _margin = {
      top: 0,
      right: 0,
      bottom: 30,
      left: 0
    },
    __width = width,
    __height = height,
    _diameter = Math.min(width, height), //150,
    _minDiam = _diameter,
    _label = "",
		_label2 = "",
    _fontSize = 8;


  var _mouseClick;

  var _value = 0,
    _value2 = 0,
    _minValue = 0,
    _maxValue = 100,
	  _maxValue2 = 100;

  var _currentArc = 0,
    _currentArc2 = 0,
    _currentValue = 0,
	  _angle=360,
	  _radians=180;

  var _arc = d3.svg.arc()
    .startAngle(0 * (Math.PI / _radians)); //just radians

  var _arc2 = d3.svg.arc()
    .startAngle(0 * (Math.PI / _radians))
    .endAngle(0); //just radians


  var boxes = [];
  W = width || 500;
  H = height || 500;
  var backgroundColor = "#F2FFDF"; // light green 
  var pivotColor = "grey";
  var pivotLineColor = "#C9F0D6";
  var levelColor = "grey";
  var levelInclination = "5";
  var boxWidth = W * 6 / 25; // 120
  var boxHeight = H / 10;
  var space = boxWidth / 2; // the space remaining on each side of the level
  var zoomRatio = 1 * W / 500;
  var vZoomRatio = 1 * H / 500;
  var labelInden = 60 * zoomRatio;
  var textDisplacement = 20 * vZoomRatio;
  var fontFamily = "sans-serif";
  var fontSize = H / 25 + "px";  //"20px"
  var fontColor = "black";
  var wordColor = [
    { "label": "Advice", "color": "red" },
    { "label": "Waiting Time", "color": "blue" },
    { "label": "Service", "color": "yellow" },
    { "label": "Explanation", "color": "green" },
    { "label": "Atmosphere", "color": "purple" },
    { "label": "Welcome", "color": "pink" },
    { "label": "Farewell", "color": "orange" }
  ];
  var addBoxes = function (sides, labels) {
    sides.forEach(function (entry, index) {
      boxes.push({
        "side": entry,
        "label": labels[index]
      })
    })
  }

  /**
   * configure Svg canvas size
   */
  var setSvgSize = function (width, height) {
    W = width;
    H = height;
    boxWidth = W * 6 / 25;
    boxHeight = H / 10;
    fontSize = fontSize | H / 25 + "px";
    zoomRatio = 1 * W / 500;
    vZoomRatio = 1 * H /500;
    labelInden = 60 * zoomRatio;
    //textDisplacement = 20 * zoomRatio;
    textDisplacement = 20 * vZoomRatio;

    return this;
  }

  /**
   * Create group
   */
  var createGroup = function (svgContainer, rotateString) {
    return (
      svgContainer.append("svg:g")
        .attr("transform", rotateString)
    )
  }

  var getCenter = function () {
    return {
      "X": W / 2,
      "Y": H * 4 / 5
    }
  }

  var getColor = function (word) {
    var entry = wordColor.find(function (d) {
      return d.label === word
    })

    // if can't match, return default black color
    if (!entry) return "black"

    return entry.color
  }

  /**
   * configure background color
   */
  var setBg = function (color) {
    backgroundColor = color;

    return this;
  }

  var setAngle = function (boxes) {
    var difference = boxes.filter(function (d) {
      return d.side === 0
    }).length - boxes.filter(function (d) {
      return d.side === 1
    }).length;
    var angle = "0"
    if (difference > 0) {
      angle = "-" + levelInclination;
    } else if (difference < 0) {
      angle = levelInclination
    } else {
      angle = "0"
    }
    return rotateString = "rotate(" + angle + " " + getCenter().X + " " + getCenter().Y + ")";
  }

  /**
   * Draw the pivot
   */
  var drawPivot = function (svgContainer) {
    var displacement = 10;
    var X = getCenter().X;
    var Y = getCenter().Y;
    var extend = 50 * zoomRatio;
    var x1 = X;
    var y1 = Y + displacement;
    var x2 = X + extend;
    var y2 = Y + displacement + extend;
    var x3 = X - extend;
    var y3 = Y + displacement + extend;

    svgContainer.append("svg:polyline")
      .attr("points", x1 + "," + y1 + " " + x2 + "," + y2 + " " + x3 + "," + y3)
      .style("stroke", pivotLineColor)
      .attr("fill", pivotColor)
  }

  /**
   * Draw level
   */
  var drawLevel = function (group) {
    var X = getCenter().X;
    var Y = getCenter().Y;

    // Draw the level    
    group.append("svg:line")
      .style("stroke", levelColor)
      .attr("x1", X - (W * 0.8 * 0.5))
      .attr("y1", Y)
      .attr("x2", X + (W * 0.8 * 0.5))
      .attr("y2", Y)
      .attr("stroke-width", 20)
  }

  /**
   * Draw labels
   */
  var drawLabels = function (g) {
    var X = getCenter().X;
    var Y = getCenter().Y;
    var texts = g.selectAll("text")
      .data(boxes)
      .enter()
      .append("text");
    var leftY = Y + textDisplacement // 420
    var rightY = Y + textDisplacement // 420
    var t = texts.attr("x", function (d) {
      return d.side === 0 ? X - space - boxWidth + labelInden : X + space + labelInden
    })
      .attr("y", function (d) {
        if (d.side === 0) {
          leftY = leftY - boxHeight;
          return leftY
        } else if (d.side === 1) {
          rightY = rightY - boxHeight;
          return rightY
        }
      })
      .text(function (d) {
        return d.label;
      })
      .attr("font-family", fontFamily)
      .attr("font-size", fontSize)
      .style("text-anchor", "middle")
      .attr("fill", fontColor);
  }

  /**
   * Draw rectangle
   * 
   */
  var drawBoxes = function (g) {
    var X = getCenter().X;
    var Y = getCenter().Y;

    var rects = g.selectAll("rect")
      .data(boxes)
      .enter()
      .append("rect")

    var leftY = Y - 10
    var rightY = Y - 10
    var r = rects.attr("x", function (d) {
      return d.side === 0 ? X - space - boxWidth : X + space
    })
      .attr("y", function (d) {
        if (d.side === 0) {
          leftY = leftY - boxHeight;
          return leftY
        } else if (d.side === 1) {
          rightY = rightY - boxHeight;
          return rightY
        }
      })
      .attr("width", boxWidth)
      .attr("height", boxHeight)
      .attr("rx", 10 * zoomRatio)
      .attr("ry", 10 * zoomRatio)
      .attr("fill", function (d) { return getColor(d.label) })
  }

  /**
   * Display average number
   */
  var displayAverage = function (svgContainer, boxes) {
    var X = getCenter().X;
    var Y = getCenter().Y;
    var verticalDisplacement = 80 * zoomRatio;
    var horizontalDisplayment = 10 * vZoomRatio;
    var average = (boxes.filter(function (d) {
      return d.side === 0
    }).length + boxes.filter(function (d) {
      return d.side === 1
    }).length) / 2    

    svgContainer.append("svg:text")
      .attr("x", X )
      .attr("y", Y + verticalDisplacement)
      .attr("font-family", fontFamily)
      .attr("font-size", fontSize)
      .attr("fill", fontColor)
      .text(average);
  }

  /**
   * Display number at the pivot
   */
  var displayNumber = function (svgContainer, input) {
    var X = getCenter().X;
    var Y = getCenter().Y;
    var verticalDisplacement = 70 * vZoomRatio;
    var horizontalDisplayment = 10 * zoomRatio;
	
    svgContainer.append("svg:text")
	    .attr("x", X )
      .attr("y", Y + verticalDisplacement)	  
      .attr("font-family", fontFamily)
      .attr("font-size", fontSize)
      .attr("fill", fontColor)
	  .attr("text-anchor", "middle")
      .text(input);
  }

  _selection = d3.select(parent);

  function component() {

    _selection.each(function (data) {

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      var enter = svg.enter().append("svg").attr("class", "radial-svg").append("g");

      //measure();

      svg.attr("width", W)
        .attr("height", H)
        .style("background-color", backgroundColor);

      addBoxes(arraySide, arrayLabel);

      drawPivot(svg);

      var group = createGroup(svg, setAngle(boxes));

      drawLevel(group);

      drawBoxes(group);

      drawLabels(group);

      //displayAverage(svg, boxes);
      displayNumber(svg, inputNumber);

    });

    function onMouseClick(d) {
      if (typeof _mouseClick == "function") {
        _mouseClick.call();
      }
    }
  }

  /**
   * configure background color
   */
  component.setBg = function (color) {
    backgroundColor = color;
    return component;
  }

  /**
   * configure pivot color
   */
  component.setPivotColor = function (color) {
    pivotColor = color;

    return component;
  }

  /**
   * configure pivot line color
   */
  component.setPivotLineColor = function (color) {
    pivotLineColor = color;

    return component;
  }

  /**
   * configure level inclination
   */
  component.setInclination = function (angle) {
    levelInclination = angle;

    return component;
  }

  /**
   * configure word color
   */
  component.setWordColor = function (definition) {
      wordColor = definition;

      return component;
  }

  /**
   * configure level color
   */
  component.setLevelColor = function (color) {
    levelColor = color;

    return component;
  }

  /**
   * configure font color
   */
  component.setFontColor = function (color) {
    fontColor = color;

    return component;
  }

  /**
   * configure font size
   */
  component.setFontSize = function(size) {
    fontSize = size + "px";
    return component;
  }

  component.render = function () {
    //measure();
    component();
    return component;
  }




function labelTween(a) {
    var i = d3.interpolate(_currentValue, a);
    _currentValue = i(0);

    return function(t) {
      _currentValue = i(t);
      this.textContent = Math.round(i(t)) + "%";
    }
  }

  function arcTween(a) {
    var i = d3.interpolate(_currentArc, a);

    return function(t) {
      _currentArc = i(t);
      return _arc.endAngle(i(t))();
    };
  }

  function arcTween2(a) {
    var i = d3.interpolate(_currentArc2, a);

    return function(t) {
      return _arc2.endAngle(i(t))();
    };
  }


  function measure() {
    _width = _diameter - _margin.right - _margin.left - _margin.top - _margin.bottom;
    _height = _width;
    _fontSize = _width * .1;
    _arc.outerRadius(_width / 2);
    _arc.innerRadius(_width / 2 * .85);
    _arc2.outerRadius(_width / 2 * .85);
    _arc2.innerRadius(_width / 2 * .85 - (_width / 2 * .15));
  }


  component.render = function() {
    measure();
    component();
    return component;
  }

  component.value = function(_) {
    if (!arguments.length) return _value;
    _value = [_];
    _selection.datum([_value]);
    return component;
  }

  component.value2 = function(_) {
    if (!arguments.length) return _value2;
    _value2 = [_];
    _selection.datum([_value2]);
    return component;
  }


  component.margin = function(_) {
    if (!arguments.length) return _margin;
    _margin = _;
    return component;
  };

  component.diameter = function(_) {
    if (!arguments.length) return _diameter
    _diameter = _;
    return component;
  };

  component.minValue = function(_) {
    if (!arguments.length) return _minValue;
    _minValue = _;
    return component;
  };

  component.maxValue = function(_) {
    if (!arguments.length) return _maxValue;
    _maxValue = _;
    return component;
  };
	component.maxValue2 = function(_) {
    if (!arguments.length) return _maxValue2;
    _maxValue2 = _;
    return component;
  };

  component.label = function(_) {
    if (!arguments.length) return _label;
    _label = _;
    return component;
  };
	component.label2 = function(_) {
    if (!arguments.length) return _label2;
    _label2 = _;
    return component;
  };

  component._duration = function(_) {
    if (!arguments.length) return _duration;
    _duration = _;
    return component;
  };

  component.onClick = function(_) {
    if (!arguments.length) return _mouseClick;
    _mouseClick = _;
    return component;
  }


  return component;

}

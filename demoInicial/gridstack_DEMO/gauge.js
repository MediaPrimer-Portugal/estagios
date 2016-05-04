$("document").ready(function(){

  /**
   *  "Class" da gauge horizontal
   *   [|||||||||||||||||-------]
   *
   */
  // var gaugeHorizontal = (function(){
  //   var svg, x, barraAtual,
  //       height = 250,
  //       width = 250,
  //       margin = { top: 20, bottom: 50, left: 50, right: 50 };
  //       teste = [1,2,3],
  //       object = { "min" : 10,
  //                  "max" : 100,
  //                  "atual" : [50],
  //                  "meta" : 10
  //                };
  //
  //   function getObject(){
  //     return object;
  //   }
  //
  //   // falta enviar o div para onde desenhar
  //   function buildSVG() {
  //     svg = d3.select("body").select(".wrapper").insert("svg")
  //       .attr("width", width)
  //       .attr("height", height)
  //     .append("g")
  //       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //   }
  //
  //   function buildShape() {
  //     console.log("a construir");
  //     svg.append("rect")
  //       .attr("x", 0)
  //       .attr("y", 0)
  //       .attr("width", 200)
  //       .attr("height", 50)
  //         .style("fill", "grey");
  //   }
  //
  //   function buildScale() {
  //     barraAtual= d3.select(".wrapper").select("g").selectAll(".atual").data(object.atual)
  //
  //     x = d3.scale.linear()
  //       .domain([0, object.max])
  //       .range([0, 200]);
  //
  //     barraAtual
  //       .enter()
  //     .append("rect")
  //       .attr("class", "atual")
  //       .attr("x", 0)
  //       .attr("y", 0)
  //       .attr("width", x(object.atual))
  //       .attr("height", 50)
  //         .style("fill", "red");
  //
  //     svg.append("rect")
  //       .attr("class", "meta")
  //       .attr("x", x(object.meta))
  //       .attr("y", -10)
  //       .attr("width", 2)
  //       .attr("height", 70)
  //         .style("fill", "green");
  //
  //     svg.append("text")
  //       .attr("class", "meta-text")
  //       .attr("x", x(object.meta)-3)
  //       .attr("y", -15)
  //       .attr("dy", ".71em")
  //         .style("text-anchor", "end")
  //         .style("fill", "white")
  //         .text("Meta");
  //   }
  //
  //   function update() {
  //     object.meta = [$(".valor-atual").val()];
  //
  //     barraAtual
  //         .transition()
  //         .duration(600)
  //         .attr("width", x(object.atual));
  //
  //     svg.select(".meta")
  //       .transition()
  //       .attr("x", x(object.meta));
  //
  //     svg.select(".meta-text")
  //       .transition()
  //       .attr("x", x(object.meta)-3);
  //   }
  //
  //   return{
  //     getObject : getObject,
  //     buildSVG : buildSVG,
  //     buildShape : buildShape,
  //     buildScale : buildScale,
  //     update : update
  //   }
  // })();

  var gaugeHorizontal = (function(){
    var svg, x, barraAtual, arc,
        height = 250,
        width = 250,
        margin = { top: 20, bottom: 50, left: 50, right: 50 };
        teste = [1,2,3],
        object = { "min" : 10,
                   "max" : 100,
                   "atual" : [50],
                   "meta" : 10
                 };

    function getObject(){
      return object;
    }

    // falta enviar o div para onde desenhar
    function buildSVG() {
      svg = d3.select("body").select(".wrapper").insert("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }

    function buildShape() {
      arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(300);
      }

    function buildScale() {
      barraAtual= d3.select(".wrapper").select("g").selectAll(".atual").data(object.atual)

      x = d3.scale.linear()
        .domain([0, object.max])
        .range([0, 200]);

      barraAtual
        .enter()
      .append("rect")
        .attr("class", "atual")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", x(object.atual))
        .attr("height", 50)
          .style("fill", "red");

      svg.append("rect")
        .attr("class", "meta")
        .attr("x", x(object.meta))
        .attr("y", -10)
        .attr("width", 2)
        .attr("height", 70)
          .style("fill", "green");

      svg.append("text")
        .attr("class", "meta-text")
        .attr("x", x(object.meta)-3)
        .attr("y", -15)
        .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style("fill", "white")
          .text("Meta");
    }

    function update() {
      object.meta = [$(".valor-atual").val()];

      barraAtual
          .transition()
          .duration(600)
          .attr("width", x(object.atual));

      svg.select(".meta")
        .transition()
        .attr("x", x(object.meta));

      svg.select(".meta-text")
        .transition()
        .attr("x", x(object.meta)-3);
    }

    return{
      getObject : getObject,
      buildSVG : buildSVG,
      buildShape : buildShape,
      buildScale : buildScale,
      update : update
    }
  })();

  // gaugeHorizontal.buildSVG();
  // gaugeHorizontal.buildShape();
  // gaugeHorizontal.buildScale();

  /**
   *  Função update para gauge Horizontal
   */

  // $(".update-gauge").click(function(){
  //   gaugeHorizontal.update();
  // });


  /**
   *   Função gauge em arco
   *     /''''''\
   *    |   \    |
   */


var needle;

(function(){

var barWidth, chart, chartInset, degToRad, repaintGauge,
    height, margin, numSections, padRad, percToDeg, percToRad,
    percent, radius, sectionIndx, svg, totalPercent, width;

  percent = .65;
  numSections = 1;
  sectionPerc = 1 / numSections / 2;
  padRad = 0.025;
  chartInset = 10;

  // Orientation of gauge:
  totalPercent = .75;

  el = d3.select('.chart-gauge');

  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 20
  };

  width = 300;
  height = width;
  radius = Math.min(width, height) / 2;
  barWidth = 40 * width / 300;


  /*
    Utility methods
  */
  percToDeg = function(perc) {
    return perc * 360;
  };

  percToRad = function(perc) {
    return degToRad(percToDeg(perc));
  };

  degToRad = function(deg) {
    return deg * Math.PI / 180;
  };

  // Create SVG element
  svg = el.append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

  // Add layer for the panel
  chart = svg.append('g').attr('transform', "translate(" + ((width + margin.left) / 2) + ", " + ((height + margin.top) / 2) + ")");
  chart.append('path').attr('class', "arc chart-filled");
  chart.append('path').attr('class', "arc chart-empty");

  arc2 = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)
  arc1 = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth)

  repaintGauge = function (perc)
  {
    var next_start = totalPercent;

    arcStartRad = percToRad(next_start);
    arcEndRad = arcStartRad + percToRad(perc / 2);
    next_start += perc / 2;


    arc1.startAngle(arcStartRad).endAngle(arcEndRad);

    arcStartRad = percToRad(next_start);
    arcEndRad = arcStartRad + percToRad((1 - perc) / 2);

    arc2.startAngle(arcStartRad + padRad).endAngle(arcEndRad);


    chart.select(".chart-filled").attr('d', arc1);
    chart.select(".chart-empty").attr('d', arc2);

  }

  var Needle = (function() {

    /**
      * Helper function that returns the `d` value
      * for moving the needle
    **/
    var recalcPointerPos = function(perc) {
      var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
      thetaRad = percToRad(perc / 2);
      centerX = 0;
      centerY = 0;
      topX = centerX - this.len * Math.cos(thetaRad);
      topY = centerY - this.len * Math.sin(thetaRad);
      leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
      leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
      rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
      rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
      return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
    };

    function Needle(el) {
      this.el = el;
      this.len = width / 3;
      this.radius = this.len / 6;
    }

    Needle.prototype.render = function() {
      return this.el.append("text").attr("class", "needle").attr("x", 0).attr("y", 0).style("font-size", "5em").style("fill", "white").style("text-anchor", "middle").text(percent * 100 + "%");
      //this.el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
    };

    Needle.prototype.moveTo = function(perc) {
      var self,
          oldValue = this.perc || 0;

      this.perc = perc;
      self = this;

      // Reset pointer position
      // this.el.transition().delay(100).ease('quad').duration(200).select('.needle').tween('reset-progress', function() {
      //   return function(percentOfPercent) {
      //     var progress = (1 - percentOfPercent) * oldValue;
      //
      //     repaintGauge(progress);
      //     return d3.select(this).attr('d', recalcPointerPos.call(self, progress));
      //   };
      // });

      this.el.transition().delay(150).ease('quad').duration(800).select('.needle').tween('progress', function() {
        return function(percentOfPercent) {
          var progress = percentOfPercent * perc;

          repaintGauge(progress);
          return d3.select(this).text(Math.trunc(progress * 100) + "%");
        };
      });

    };

    return Needle;

  })();

  needle = new Needle(chart);
  needle.render();

  $(".update-gauge").click(function(){
    needle.moveTo($(".valor-atual").val() / 100);
  });
})();

});

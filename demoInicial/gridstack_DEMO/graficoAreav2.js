$("document").ready(function(){

  // $(document).on("click", ".update-widget", function() {
  //   setTimeout(graficoArea.render($(this).parent()), 50);
  // });

graficoArea = (function(){

  var breakpoint = 350,
      margin = {top: 20, right: 50, bottom: 50, left: 50},
      width = $(".wrapper").width() - margin.left - margin.right,
      height = $(".wrapper").height() - margin.top - margin.bottom,
      x, xAxis, y, yAxis, svg, area, dataSelected, dataNest, color, series;

      dataSelected = [
        {nome: "janeiro", teste1: 12,  id: 1},
        {nome: "fev", teste1: 41, id: 1},
        {nome: "março", teste1: 25,id: 1},
        {nome: "abril", teste1: 24, id: 1},
        {nome: "maio", teste1: 32, id: 1},
        {nome: "junho", teste1: 13, id: 1},
        {nome: "julho", teste1: 22, id: 1},
        {nome: "agosto", teste1: 51, id: 1},
        {nome: "setembro", teste1: 21, id: 1},
        {nome: "outubro", teste1: 23, id: 1},
        {nome: "novembro", teste1: 17, id: 1},
        {nome: "dezembro", teste1: 11, id: 1},
        {nome: "janeiro", teste1: 25,  id: 2},
        {nome: "fev", teste1: 16, id: 2},
        {nome: "março", teste1: 23,id: 2},
        {nome: "abril", teste1: 16, id: 2},
        {nome: "maio", teste1: 19, id: 2},
        {nome: "junho", teste1: 8, id: 2},
        {nome: "julho", teste1: 9, id: 2},
        {nome: "agosto", teste1: 11, id: 2},
        {nome: "setembro", teste1: 17, id: 2},
        {nome: "outubro", teste1: 16, id: 2},
        {nome: "novembro", teste1: 20, id: 2},
        {nome: "dezembro", teste1: 25, id: 2},
        {nome: "janeiro", teste1: 31,  id: 3},
        {nome: "fev", teste1: 12, id: 3},
        {nome: "março", teste1: 13,id: 3},
        {nome: "abril", teste1: 31, id: 3},
        {nome: "maio", teste1: 16, id: 3},
        {nome: "junho", teste1: 9, id: 3},
        {nome: "julho", teste1: 19, id: 3},
        {nome: "agosto", teste1: 20, id: 3},
        {nome: "setembro", teste1: 29, id: 3},
        {nome: "outubro", teste1: 11, id: 3},
        {nome: "novembro", teste1: 21, id: 3},
        {nome: "dezembro", teste1: 17, id: 3}
      ];

  function buildScales() {
    x = d3.scale.ordinal()
      .domain(dataSelected.map(function(d) { return d.nome; }))
      .rangeRoundBands([0, width], 0.1);

    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    y = d3.scale.linear()
      .domain([0, d3.max(dataSelected, function(d){ return d.teste1; })])
      .range([height, 0]);

    yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  }

  function buildSVG(div) {
    // Insere area de SVG
    svg = d3.select(div).select(".wrapper").insert("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  function buildShape(){
    area = d3.svg.area()
      .x(function(d) { return x(d.nome); })
      .y0(height)
      .y1(function(d) { return y(d.teste1); });
  }

  function inserirDados() {
    dataNest = d3.nest()
      .key(function(d) {return d.id;})
      .entries(dataSelected);

    color = d3.scale.category10()
      .domain(d3.keys(dataSelected[0]).filter(function(key) { return key === "id"; }));

    series = svg.selectAll(".series")
      .data(dataNest)
    .enter().append("g")
      .attr("class", "series");

    series.append("path")
      .attr("class", "area")
      .attr("d", function (d) { return area(d.values); })
        .style("fill", function(d) { return color(d.key); })
  }

  function insertScales() {
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");
  }

  function render(self) {
    // Volta a redefinir o SVG com o widget que foi selecionado para ser updated
    svg = d3.select("[name="+self.parent().attr("name")+"]").select(".wrapper");

    // Atualizar dimensões conforme a "widget"
    updateDimensions(self);

    // Atualizar escala
    updateScale();

    //update svg elements to new dimensions
    d3.select("#main-gridstack").select("[name="+self.parent().attr("name")+"]").select(".wrapper svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // Numero de representações nos eixos de acordo com o tamanho do widget
    if(height > 300){
      yAxis.ticks(10);
    }
    if(height <= 300){
      yAxis.ticks(5);
    }
    if(height <= 150){
      yAxis.ticks(2);
    }

    if(width >= breakpoint){
      xAxis.tickValues(x.domain());
    }
    if(width <= breakpoint){
      xAxis.tickValues(x.domain().filter( function(d, i) { return !(i % 2); }));
    }
    if(width < (breakpoint - 100)){
      xAxis.tickValues(x.domain().filter( function(d, i) { return !(i % 5); }));
    }

    svg.select(".x.axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .attr("dx", "-2em")
      .attr("dy", ".5em")
      .attr("transform", "rotate(-35)" );

    svg.select(".y.axis")
      .call(yAxis);

    update();
  }

  function update() {
    svg.selectAll(".area").data(dataNest)
      .attr("d", function (d) { return area(d.values); })
  }

  function updateScale() {
    // Construção das novas escalas para x e y
    x = d3.scale.ordinal()
      .domain(dataSelected.map(function(d) { return d.nome; }))
      .rangeRoundBands([0, width], 0.1);

    y = d3.scale.linear()
     .domain([0, d3.max(dataSelected, function(d){ return d.teste1; })])
     .range([height, 0]);

    // Update das escalas de X e Y para as novas dimensões
    x.rangeRoundBands([0, width], 0.1);
    y.range([height, 0]);

    // Update dos Eixos
    yAxis.scale(y);
    xAxis.scale(x);

    // Update na pintura do gráfico
    area = d3.svg.area()
      .x(function(d) { return x(d.nome); })
      .y0(height)
      .y1(function(d) { return y(d.teste1); });
  }

  function updateDimensions(self) {
    // width = (winWidth) - margin.left - margin.right;
    width = self.width();

    // Se for maior for que a sua altura original, volta ao seu Max
    if(width > self.width() - margin.left - margin.right) {
      width = self.width() - margin.right - margin.left;
    }

    height = self.height();

    if(height > self.height() - margin.top - margin.bottom - 20) {
      /* Retiramos 30 pixeis da margem por causa dos nomes estarem num angulo diferente, logo ocupam mais espaço*/
      height = self.height() - margin.top - margin.bottom - 20;
    }
  }

  function buildGraph(div) {
    buildScales();
    buildShape();
    buildSVG(div);
    inserirDados();
    insertScales();
  }

  return{
    buildGraph : buildGraph,
    render : render
  };
})();

  // Botão para desenhar o gráfico no widget escolhido
  // $(".desenha-grafico").click(function() {
  //   graficoArea.buildGraph("[name="+ $(".dropdown-widget").find(":selected").text()+"]");
  // });

});

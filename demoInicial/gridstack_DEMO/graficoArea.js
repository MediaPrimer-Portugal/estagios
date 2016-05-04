$("document").ready(function(){

  // $(document).on("click", ".update-widget", function() {
  //   setTimeout(graficoArea.render($(this).parent()), 50);
  // });

graficoArea = (function(){

  var breakpoint = 350,
      margin = {top: 20, right: 50, bottom: 50, left: 50},
      width = $(".wrapper").width() - margin.left - margin.right,
      height = $(".wrapper").height() - margin.top - margin.bottom,
      x, xAxis, y, yAxis, svg, area, dataSelected;

  dataSelected = [
    {nome: "janeiro", numero: 10 },
    {nome: "fev", numero: 5 },
    {nome: "março", numero: 25 },
    {nome: "abril", numero: 50 },
    {nome: "maio", numero: 6 },
    {nome: "junho", numero: 37 },
    {nome: "julho", numero: 137 },
    {nome: "agosto", numero: 24},
    {nome: "setembro", numero: 19},
    {nome: "outubro", numero: 13},
    {nome: "novembro", numero: 17},
    {nome: "dezembro", numero: 112}
  ];

  function buildScaleX() {
    x = d3.scale.ordinal()
      .domain(dataSelected.map(function(d) { return d.nome; }))
      .rangeRoundBands([0, width], 0.1);

    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  }

  function buildScaleY() {
    y = d3.scale.linear()
      .domain([0, d3.max(dataSelected, function(d){ return d.numero; })])
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

  function gerador(){
    area = d3.svg.area()
      .x(function(d) { return x(d.nome); })
      .y0(height)
      .y1(function(d) { return y(d.numero); });
  }

  function inserirDados() {
    // Desenhar Área
    svg.append("path")
      .datum(dataSelected)
      .attr("class", "area")
      .attr("d", area);
  }

  function inserirEixoX() {
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  }

  function inserirEixoY() {
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

  function buildGraph(div) {
    buildScaleY();
    buildScaleX();
    gerador();
    buildSVG(div);
    inserirDados();
    inserirEixoY();
    inserirEixoX();
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
    svg.selectAll(".area")
       .attr("d", area(dataSelected));
  }

  function updateScale() {
    // Construção das novas escalas para x e y
    x = d3.scale.ordinal()
      .domain(dataSelected.map(function(d) { return d.nome; }))
      .rangeRoundBands([0, width], 0.1);

    y = d3.scale.linear()
     .domain([0, d3.max(dataSelected, function(d){ return d.numero; })])
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
      .y1(function(d) { return y(d.numero); });
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
